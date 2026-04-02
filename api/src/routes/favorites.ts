import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/favorites/:listingId
router.post('/:listingId', requireAuth, async (req: AuthRequest, res: Response) => {
  const listingId = String(req.params.listingId);
  const userId = req.user!.userId;
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) { res.status(404).json({ error: 'Listing not found' }); return; }
  const existing = await prisma.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });
  if (existing) { res.json({ ok: true, alreadyFavorited: true }); return; }
  await prisma.favorite.create({ data: { userId, listingId } });
  res.status(201).json({ ok: true });
});

// DELETE /api/favorites/:listingId
router.delete('/:listingId', requireAuth, async (req: AuthRequest, res: Response) => {
  const listingId = String(req.params.listingId);
  const userId = req.user!.userId;
  const existing = await prisma.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });
  if (!existing) { res.status(404).json({ error: 'Not in favorites' }); return; }
  await prisma.favorite.delete({ where: { userId_listingId: { userId, listingId } } });
  res.json({ ok: true });
});

// GET /api/favorites
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const take = 20;
  const skip = (page - 1) * take;
  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: {
            photos: { orderBy: { order: 'asc' }, take: 1 },
            city: { select: { id: true, nameRu: true } },
            category: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.favorite.count({ where: { userId } }),
  ]);
  res.json({ favorites, total, page, limit: take });
});

export default router;
