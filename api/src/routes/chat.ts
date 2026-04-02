import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// GET /api/threads — list current user's threads
router.get('/threads', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const threads = await prisma.thread.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        listing: { select: { id: true, title: true, price: true, currency: true, photos: { take: 1, select: { url: true } } } },
        participants: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const result = threads.map((t) => ({
      id: t.id,
      listing: t.listing,
      otherUser: t.participants.find((p) => p.userId !== userId)?.user || null,
      lastMessage: t.messages[0] || null,
      updatedAt: t.updatedAt,
    }));

    res.json(result);
  } catch (err) {
    console.error('GET /threads error:', err);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// GET /api/threads/:id/messages — paginated messages for a thread
router.get('/threads/:id/messages', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const threadId = req.params.id as string;
    const cursor = (req.query.cursor as string) || undefined;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

    // Verify user is participant
    const participant = await prisma.threadParticipant.findUnique({
      where: { threadId_userId: { threadId, userId } },
    });
    if (!participant) {
      res.status(403).json({ error: 'Not a participant of this thread' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
    });

    res.json({
      messages,
      nextCursor: messages.length === limit ? messages[messages.length - 1].id : null,
    });
  } catch (err) {
    console.error('GET /threads/:id/messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/threads/:listingId/message — send message (creates thread on first message)
router.post('/threads/:listingId/message', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const listingId = req.params.listingId as string;
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    // Find listing and its owner
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    if (listing.userId === userId) {
      res.status(400).json({ error: 'Cannot message yourself' });
      return;
    }

    // Find or create thread between this buyer and seller for this listing
    let thread = await prisma.thread.findFirst({
      where: {
        listingId,
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: listing.userId } } },
        ],
      },
    });

    if (!thread) {
      thread = await prisma.thread.create({
        data: {
          listingId,
          participants: {
            create: [{ userId }, { userId: listing.userId }],
          },
        },
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        threadId: thread.id,
        senderId: userId,
      },
      include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
    });

    // Touch thread updatedAt
    await prisma.thread.update({ where: { id: thread.id }, data: { updatedAt: new Date() } });

    res.status(201).json({ threadId: thread.id, message });
  } catch (err) {
    console.error('POST /threads/:listingId/message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
