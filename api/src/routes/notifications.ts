import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/notifications — paginated list of current user's notifications
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          listing: {
            select: { id: true, title: true, photos: { take: 1, select: { url: true } } },
          },
        },
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    res.json({ notifications, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('GET /notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET /api/notifications/unread-count — count of unread notifications
router.get('/unread-count', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const count = await prisma.notification.count({
      where: { userId, read: false },
    });
    res.json({ count });
  } catch (err) {
    console.error('GET /notifications/unread-count error:', err);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// PATCH /api/notifications/:id/read — mark a single notification as read
router.patch('/:id/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }
    if (notification.userId !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json(updated);
  } catch (err) {
    console.error('PATCH /notifications/:id/read error:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// POST /api/notifications/read-all — mark all notifications as read for current user
router.post('/read-all', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    res.json({ updated: result.count });
  } catch (err) {
    console.error('POST /notifications/read-all error:', err);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

export default router;
