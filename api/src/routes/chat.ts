import { Router, Request, Response } from 'express';
import xss from 'xss';
import { requireAuth } from '../middleware/auth';
import { chatMessageRateLimit } from '../middleware/rateLimiter';
import { prisma } from '../lib/prisma';

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

    // Compute unread count per thread: messages from others sent after our lastSeenAt
    type ThreadWithIncludes = (typeof threads)[number];
    const result = await Promise.all(threads.map(async (t: ThreadWithIncludes) => {
      const myParticipant = t.participants.find((p: { userId: string }) => p.userId === userId);
      const lastSeenAt = myParticipant?.lastSeenAt;

      const unreadCount = await prisma.message.count({
        where: {
          threadId: t.id,
          senderId: { not: userId },
          ...(lastSeenAt ? { createdAt: { gt: lastSeenAt } } : {}),
        },
      });

      return {
        id: t.id,
        listing: t.listing,
        otherUser: t.participants.find((p: { userId: string }) => p.userId !== userId)?.user || null,
        lastMessage: t.messages[0] || null,
        updatedAt: t.updatedAt,
        unreadCount,
      };
    }));

    res.json(result);
  } catch (err) {
    console.error('GET /threads error:', err);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// GET /api/threads/unread-count — total unread messages across all threads
router.get('/threads/unread-count', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Get all thread participations for this user
    const participations = await prisma.threadParticipant.findMany({
      where: { userId },
      select: { threadId: true, lastSeenAt: true },
    });

    if (participations.length === 0) {
      res.json({ count: 0 });
      return;
    }

    // Count unread per participation and sum
    let total = 0;
    await Promise.all(participations.map(async (p: { threadId: string; lastSeenAt: Date | null }) => {
      const count = await prisma.message.count({
        where: {
          threadId: p.threadId,
          senderId: { not: userId },
          ...(p.lastSeenAt ? { createdAt: { gt: p.lastSeenAt } } : {}),
        },
      });
      total += count;
    }));

    res.json({ count: total });
  } catch (err) {
    console.error('GET /threads/unread-count error:', err);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// POST /api/threads/:threadId/seen — mark thread as seen (update lastSeenAt)
router.post('/threads/:threadId/seen', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const threadId = req.params.threadId as string;

    const participant = await prisma.threadParticipant.findUnique({
      where: { threadId_userId: { threadId, userId } },
    });
    if (!participant) {
      res.status(403).json({ error: 'Not a participant of this thread' });
      return;
    }

    await prisma.threadParticipant.update({
      where: { threadId_userId: { threadId, userId } },
      data: { lastSeenAt: new Date() },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('POST /threads/:threadId/seen error:', err);
    res.status(500).json({ error: 'Failed to mark thread as seen' });
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

// POST /api/threads — find or create a direct thread between two users (no listing required)
router.post('/threads', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { otherUserId } = req.body;

    if (!otherUserId || typeof otherUserId !== 'string') {
      res.status(400).json({ error: 'otherUserId is required' });
      return;
    }

    if (otherUserId === userId) {
      res.status(400).json({ error: 'Cannot start a dialog with yourself' });
      return;
    }

    // Verify the other user exists
    const otherUser = await prisma.user.findUnique({ where: { id: otherUserId }, select: { id: true, name: true } });
    if (!otherUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Sort IDs to ensure consistent uniqueness: participant1Id < participant2Id
    const [p1, p2] = [userId, otherUserId].sort();

    // Upsert direct thread
    let thread = await prisma.thread.findUnique({
      where: { participant1Id_participant2Id: { participant1Id: p1, participant2Id: p2 } },
    });

    if (!thread) {
      thread = await prisma.thread.create({
        data: {
          participant1Id: p1,
          participant2Id: p2,
          participants: {
            create: [{ userId }, { userId: otherUserId }],
          },
        },
      });
    }

    res.status(201).json({ threadId: thread.id });
  } catch (err) {
    console.error('POST /threads error:', err);
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// POST /api/threads/:listingId/message — send message (creates thread on first message)
router.post('/threads/:listingId/message', requireAuth, chatMessageRateLimit, async (req: Request, res: Response) => {
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
        text: xss(text.trim()),
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
