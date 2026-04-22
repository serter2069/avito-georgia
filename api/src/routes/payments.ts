import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/payments/my — payment history for the authenticated user
router.get('/my', requireAuth, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      amount: true,
      currency: true,
      status: true,
      promotionType: true,
      listingId: true,
      createdAt: true,
    },
  });

  res.json({ payments });
});

export default router;
