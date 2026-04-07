import { Router, Request, Response } from 'express';
import { ListingStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { sendListingApprovedEmail, sendListingRejectedEmail } from '../lib/mail';
import { isValidAdminTransition, getAdminAllowedTransitions, ALL_LISTING_STATUSES } from '../lib/listing-state-machine';
import { LISTING_EXPIRY_DAYS } from '../lib/constants';

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireAdmin);

// Helper: write an audit log entry fire-and-forget (never throws, never blocks response)
function logAudit(
  adminId: string,
  adminEmail: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>,
): void {
  prisma.auditLog.create({
    data: {
      adminId,
      adminEmail,
      action,
      targetType,
      targetId,
      details: details ? (details as Prisma.InputJsonValue) : Prisma.DbNull,
    },
  }).catch(err => console.error('audit log error:', err));
}

// GET /api/admin/users — paginated user list
router.get('/users', async (req: Request, res: Response) => {

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
router.patch('/users/:id/role', async (req: Request, res: Response) => {

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

  if (role === 'blocked') {
    await prisma.listing.updateMany({
      where: { userId: id, status: 'active' },
      data: { status: 'removed' },
    });
    // Invalidate all active sessions immediately — blocked user loses access at next request
    await prisma.session.deleteMany({ where: { userId: id } });
  }

  logAudit(req.user!.userId, req.user!.email, 'user.role_change', 'user', id, {
    previousRole: user.role,
    newRole: role,
    targetEmail: user.email,
  });

  res.json(updated);
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', async (req: Request, res: Response) => {

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
router.patch('/reports/:id/status', async (req: Request, res: Response) => {

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

  logAudit(req.user!.userId, req.user!.email, 'report.status_change', 'report', id, {
    previousStatus: report.status,
    newStatus: status,
  });

  res.json(updated);
});

// GET /api/admin/listings/pending — moderation queue (pending_moderation listings)
router.get('/listings/pending', async (req: Request, res: Response) => {

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
        city: { select: { id: true, nameRu: true, nameEn: true, nameKa: true } },
        category: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  res.json({ listings, total, page, totalPages: Math.ceil(total / limit) });
});

// PATCH /api/admin/listings/:id/status — admin status transitions (state machine)
router.patch('/listings/:id/status', async (req: Request, res: Response) => {

  const id = req.params.id as string;
  const { status, rejectReason } = req.body;

  if (!status || !ALL_LISTING_STATUSES.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${ALL_LISTING_STATUSES.join(', ')}` });
    return;
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true } } },
  });
  if (!listing) {
    res.status(404).json({ error: 'Listing not found' });
    return;
  }

  const currentStatus = listing.status as ListingStatus;
  const targetStatus = status as ListingStatus;

  // Validate transition using state machine
  if (!isValidAdminTransition(currentStatus, targetStatus)) {
    const allowed = getAdminAllowedTransitions(currentStatus);
    res.status(400).json({
      error: `Invalid status transition from '${currentStatus}' to '${targetStatus}'`,
      allowedTransitions: allowed,
    });
    return;
  }

  const updateData: Record<string, any> = { status: targetStatus };
  if (targetStatus === 'rejected') {
    updateData.rejectionReason = rejectReason || null;
  } else if (targetStatus === 'active') {
    updateData.rejectionReason = null;
    // Set activation timestamp and expiry when admin approves
    const now = new Date();
    updateData.activatedAt = now;
    updateData.expiresAt = new Date(now.getTime() + LISTING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: updateData,
  });

  logAudit(req.user!.userId, req.user!.email, 'listing.status_change', 'listing', id, {
    previousStatus: currentStatus,
    newStatus: targetStatus,
    ...(rejectReason ? { rejectReason } : {}),
  });

  // Send email notification to the listing owner (check moderation_update pref first)
  if (targetStatus === 'active' || targetStatus === 'rejected') {
    const moderationPref = await prisma.notificationPref.findUnique({
      where: { userId_type: { userId: listing.user.id, type: 'moderation_update' } },
    });
    if (!moderationPref || moderationPref.enabled) {
      const userEmail = listing.user.email;
      if (targetStatus === 'active') {
        sendListingApprovedEmail(userEmail, listing.title)
          .catch(err => console.error('Approval email error:', err));
      } else {
        sendListingRejectedEmail(userEmail, listing.title, rejectReason || null)
          .catch(err => console.error('Rejection email error:', err));
      }
    }
  }

  res.json(updated);
});

// GET /api/admin/categories — list categories with monetization fields
router.get('/categories', async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      children: { select: { id: true, name: true, nameKa: true, nameRu: true, nameEn: true, slug: true, freeListingQuota: true, paidListingPrice: true } },
    },
  });
  res.json(categories);
});

// PATCH /api/admin/categories/:id — update category monetization settings
router.patch('/categories/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { freeListingQuota, paidListingPrice } = req.body;

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  const updateData: Record<string, any> = {};
  if (freeListingQuota !== undefined) {
    const quota = parseInt(freeListingQuota, 10);
    if (isNaN(quota) || quota < 0) {
      res.status(400).json({ error: 'freeListingQuota must be a non-negative integer' });
      return;
    }
    updateData.freeListingQuota = quota;
  }
  if (paidListingPrice !== undefined) {
    const price = parseFloat(paidListingPrice);
    if (isNaN(price) || price < 0) {
      res.status(400).json({ error: 'paidListingPrice must be a non-negative number' });
      return;
    }
    updateData.paidListingPrice = price;
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No valid fields to update' });
    return;
  }

  const updated = await prisma.category.update({ where: { id }, data: updateData });

  logAudit(req.user!.userId, req.user!.email, 'category.update', 'category', id, {
    changes: updateData,
    categoryName: category.name,
  });

  res.json(updated);
});

// GET /api/admin/audit-log — paginated audit log (UC-25)
router.get('/audit-log', async (req: Request, res: Response) => {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const targetType = req.query.targetType as string | undefined;

  const where = targetType ? { targetType } : {};

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  res.json({ logs, total, page, totalPages: Math.ceil(total / limit) });
});

// GET /api/admin/settings — return auto-moderation settings (with safe defaults)
router.get('/settings', async (_req: Request, res: Response) => {
  const rows = await prisma.appSettings.findMany({
    where: { key: { in: ['autoModerationEnabled', 'bannedWords'] } },
  });
  const byKey: Record<string, string> = {};
  for (const row of rows) byKey[row.key] = row.value;

  res.json({
    autoModerationEnabled: byKey['autoModerationEnabled'] === 'true',
    bannedWords: byKey['bannedWords'] ? JSON.parse(byKey['bannedWords']) as string[] : [],
  });
});

// PATCH /api/admin/settings — save auto-moderation settings
router.patch('/settings', async (req: Request, res: Response) => {
  const { autoModerationEnabled, bannedWords } = req.body;

  if (autoModerationEnabled !== undefined && typeof autoModerationEnabled !== 'boolean') {
    res.status(400).json({ error: 'autoModerationEnabled must be a boolean' });
    return;
  }
  if (bannedWords !== undefined && !Array.isArray(bannedWords)) {
    res.status(400).json({ error: 'bannedWords must be an array of strings' });
    return;
  }
  if (bannedWords !== undefined && bannedWords.some((w: unknown) => typeof w !== 'string')) {
    res.status(400).json({ error: 'bannedWords must be an array of strings' });
    return;
  }

  const updates: Promise<unknown>[] = [];

  if (autoModerationEnabled !== undefined) {
    updates.push(
      prisma.appSettings.upsert({
        where: { key: 'autoModerationEnabled' },
        create: { key: 'autoModerationEnabled', value: String(autoModerationEnabled) },
        update: { value: String(autoModerationEnabled) },
      }),
    );
  }
  if (bannedWords !== undefined) {
    // Normalize: trim, lowercase, filter empty
    const normalized = (bannedWords as string[])
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 0);
    updates.push(
      prisma.appSettings.upsert({
        where: { key: 'bannedWords' },
        create: { key: 'bannedWords', value: JSON.stringify(normalized) },
        update: { value: JSON.stringify(normalized) },
      }),
    );
  }

  await Promise.all(updates);

  logAudit(req.user!.userId, req.user!.email, 'settings.update', 'settings', 'app', {
    ...(autoModerationEnabled !== undefined ? { autoModerationEnabled } : {}),
    ...(bannedWords !== undefined ? { bannedWordsCount: (bannedWords as string[]).length } : {}),
  });

  res.json({ ok: true });
});

export default router;
