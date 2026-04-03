import { Router, Request, Response } from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma';
import { uploadFile } from '../lib/storage';
import { requireAuth } from '../middleware/auth';

const router = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// PATCH /api/users/me — update current user profile (must be before /:id)
router.patch('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { name, phone, city, isOnboarded } = req.body;

    const data: Record<string, string | boolean | null> = {};
    if (name !== undefined) data.name = typeof name === 'string' ? name.trim() || null : null;
    if (phone !== undefined) data.phone = typeof phone === 'string' ? phone.trim() || null : null;
    if (city !== undefined) data.city = typeof city === 'string' ? city.trim() || null : null;
    if (isOnboarded === true) data.isOnboarded = true;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, phone: true, avatarUrl: true, role: true, locale: true, city: true, isOnboarded: true },
    });

    res.json({ user });
  } catch (err) {
    console.error('PATCH /users/me error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/users/avatar — upload avatar image
router.post('/avatar', requireAuth, upload.single('avatar'), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const file = req.file;
    if (!file) { res.status(400).json({ error: 'No file uploaded' }); return; }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, WebP, GIF allowed.' }); return;
    }

    const { url } = await uploadFile(file.buffer, file.mimetype, 'avatars');

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: url },
      select: { id: true, avatarUrl: true },
    });

    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error('POST /users/avatar error:', err);
    res.status(500).json({ error: 'Failed to upload avatar' });
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
