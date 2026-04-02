import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// PATCH /api/users/me — update current user profile (must be before /:id)
router.patch('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { name, phone } = req.body;

    const data: Record<string, string | null> = {};
    if (name !== undefined) data.name = typeof name === 'string' ? name.trim() || null : null;
    if (phone !== undefined) data.phone = typeof phone === 'string' ? phone.trim() || null : null;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, phone: true, avatarUrl: true, role: true, locale: true },
    });

    res.json({ user });
  } catch (err) {
    console.error('PATCH /users/me error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

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
