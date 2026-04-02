import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/admin/payments — list all payments (admin only)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  if (req.user!.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const page = parseInt(String(req.query.page) || '1', 10);
  const take = 50;
  const skip = (page - 1) * take;
  const status = req.query.status as string | undefined;

  const where = status ? { status: status as any } : {};

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  res.json({ payments, total, page, limit: take });
});

// GET /api/admin/promotions — list all active promotions (admin only)
router.get('/promotions', requireAuth, async (req: Request, res: Response) => {
  if (req.user!.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const promotions = await prisma.promotion.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { id: true, email: true, name: true } },
      listing: { select: { id: true, title: true } },
    },
  });

  res.json({ promotions });
});

export default router;
