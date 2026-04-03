import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.user!.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }
  return true;
}

// GET /api/admin/users — paginated user list
router.get('/users', requireAuth, async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const q = req.query.q as string | undefined;

  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: 'insensitive' as const } },
          { name: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { listings: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
});

// PATCH /api/admin/users/:id/role — update user role (block/unblock)
router.patch('/users/:id/role', requireAuth, async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const id = req.params.id as string;
  const { role } = req.body;

  if (!role || !['user', 'admin', 'blocked'].includes(role)) {
    res.status(400).json({ error: 'role must be user, admin, or blocked' });
    return;
  }

  // Prevent admin from changing own role
  if (id === req.user!.userId) {
    res.status(400).json({ error: 'Cannot change own role' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, email: true, name: true, role: true },
  });

  res.json(updated);
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', requireAuth, async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalListings, totalUsers, pendingReports, pendingModeration, paymentsThisMonth] = await Promise.all([
    prisma.listing.count(),
    prisma.user.count(),
    prisma.report.count({ where: { status: 'pending' } }),
    prisma.listing.count({ where: { status: 'pending_moderation' } }),
    prisma.payment.aggregate({
      where: {
        createdAt: { gte: monthStart },
        status: 'completed',
      },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  res.json({
    totalListings,
    totalUsers,
    pendingReports,
    pendingModeration,
    paymentsThisMonth: {
      count: paymentsThisMonth._count,
      sum: paymentsThisMonth._sum.amount || 0,
    },
  });
});

// PATCH /api/admin/reports/:id/status — update report status
router.patch('/reports/:id/status', requireAuth, async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const id = req.params.id as string;
  const { status } = req.body;

  if (!status || !['pending', 'resolved', 'dismissed'].includes(status)) {
    res.status(400).json({ error: 'status must be pending, resolved, or dismissed' });
    return;
  }

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  const updated = await prisma.report.update({
    where: { id },
    data: { status },
  });

  res.json(updated);
});

// GET /api/admin/listings/pending — moderation queue (pending_moderation listings)
router.get('/listings/pending', requireAuth, async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;

  const where = { status: 'pending_moderation' as const };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
      include: {
        photos: { orderBy: { order: 'asc' }, take: 1 },
        city: { select: { id: true, nameRu: true } },
        category: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  res.json({ listings, total, page, totalPages: Math.ceil(total / limit) });
});

// PATCH /api/admin/listings/:id/status — admin can approve/reject listings
router.patch('/listings/:id/status', requireAuth, async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const id = req.params.id as string;
  const { status } = req.body;

  const allowedStatuses = ['active', 'removed', 'rejected', 'pending_moderation'];
  if (!status || !allowedStatuses.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${allowedStatuses.join(', ')}` });
    return;
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    res.status(404).json({ error: 'Listing not found' });
    return;
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: { status: status as any },
  });

  res.json(updated);
});

export default router;
