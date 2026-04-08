import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/favorites/:listingId
router.post('/:listingId', requireAuth, async (req: Request, res: Response) => {
  try {
    const listingId = String(req.params.listingId);
    const userId = req.user!.userId;
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) { res.status(404).json({ error: 'Listing not found' }); return; }
    await prisma.favorite.upsert({
      where: { userId_listingId: { userId, listingId } },
      create: { userId, listingId },
      update: {},
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('POST /favorites/:listingId error:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// DELETE /api/favorites/:listingId
router.delete('/:listingId', requireAuth, async (req: Request, res: Response) => {
  try {
    const listingId = String(req.params.listingId);
    const userId = req.user!.userId;
    const existing = await prisma.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });
    if (!existing) { res.status(404).json({ error: 'Not in favorites' }); return; }
    await prisma.favorite.delete({ where: { userId_listingId: { userId, listingId } } });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /favorites/:listingId error:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// GET /api/favorites/:listingId/check
router.get('/:listingId/check', requireAuth, async (req: Request, res: Response) => {
  try {
    const listingId = String(req.params.listingId);
    const userId = req.user!.userId;
    const result = await prisma.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });
    res.json({ isFavorited: !!result });
  } catch (err) {
    console.error('GET /favorites/:listingId/check error:', err);
    res.status(500).json({ error: 'Failed to check favorite' });
  }
});

// GET /api/favorites
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const take = 20;
    const skip = (page - 1) * take;
    const blockedFilter = { listing: { user: { role: { not: 'blocked' } } } };
    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId, ...blockedFilter },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            include: {
              photos: { orderBy: { order: 'asc' }, take: 1 },
              city: { select: { id: true, nameRu: true, nameEn: true, nameKa: true } },
              category: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      }),
      prisma.favorite.count({ where: { userId, ...blockedFilter } }),
    ]);
    res.json({ favorites, total, page, limit: take });
  } catch (err) {
    console.error('GET /favorites error:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

export default router;
