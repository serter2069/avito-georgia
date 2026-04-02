import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/users/:id — public seller profile
router.get('/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: {
          listings: {
            where: {
              status: 'active',
              OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
          },
        },
      },
    },
  });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json({
    id: user.id,
    name: user.name || 'User',
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    activeListings: user._count.listings,
  });
});

export default router;
