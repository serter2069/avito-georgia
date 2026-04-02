import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// POST /api/reports — create a report
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { listingId, targetUserId, reason, description } = req.body;

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      res.status(400).json({ error: 'Reason is required' });
      return;
    }

    if (!listingId && !targetUserId) {
      res.status(400).json({ error: 'Either listingId or targetUserId is required' });
      return;
    }

    // Verify listing exists if provided
    if (listingId) {
      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing) {
        res.status(404).json({ error: 'Listing not found' });
        return;
      }
    }

    // Verify target user exists if provided
    if (targetUserId) {
      const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser) {
        res.status(404).json({ error: 'Target user not found' });
        return;
      }
    }

    const report = await prisma.report.create({
      data: {
        reporterId: userId,
        listingId: listingId || null,
        targetUserId: targetUserId || null,
        reason: reason.trim(),
        description: description?.trim() || null,
      },
    });

    res.status(201).json(report);
  } catch (err) {
    console.error('POST /reports error:', err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// GET /api/admin/reports — list all reports (admin only)
router.get('/admin', requireAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    const status = req.query.status as string | undefined;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const where = status ? { status } : {};

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          listing: { select: { id: true, title: true } },
          targetUser: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);

    res.json({ reports, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('GET /admin/reports error:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

export default router;
