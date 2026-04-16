import { Router, Request, Response } from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma';
import { uploadFile } from '../lib/storage';
import { requireAuth } from '../middleware/auth';
import { NotificationPrefType } from '@prisma/client';
import { validateImageMagicBytes } from '../lib/magic-bytes';

const router = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const VALID_LOCALES = ['ka', 'ru', 'en'] as const;
type ValidLocale = typeof VALID_LOCALES[number];

const NOTIFICATION_PREF_TYPES: NotificationPrefType[] = [
  NotificationPrefType.new_message,
  NotificationPrefType.price_drop,
  NotificationPrefType.moderation_update,
];

// PATCH /api/users/me — update current user profile (must be before /:id)
router.patch('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { name, phone, city, isOnboarded, locale } = req.body;

    const data: Record<string, string | boolean | null> = {};
    if (name !== undefined) data.name = typeof name === 'string' ? name.trim() || null : null;
    if (phone !== undefined) data.phone = typeof phone === 'string' ? phone.trim() || null : null;
    if (city !== undefined) data.city = typeof city === 'string' ? city.trim() || null : null;
    if (isOnboarded === true) data.isOnboarded = true;
    if (locale !== undefined) {
      if (!VALID_LOCALES.includes(locale as ValidLocale)) {
        res.status(400).json({ error: 'Invalid locale. Must be one of: ka, ru, en' });
        return;
      }
      data.locale = locale;
    }

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

// GET /api/users/me/notification-prefs — get all notification preferences for current user
// Returns defaults (all enabled) for types that have no DB row yet (upserts on first call).
router.get('/me/notification-prefs', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Fetch existing prefs
    const existing = await prisma.notificationPref.findMany({ where: { userId } });
    const existingTypes = new Set(existing.map((p) => p.type));

    // Create default rows for any missing types
    const missing = NOTIFICATION_PREF_TYPES.filter((t) => !existingTypes.has(t));
    if (missing.length > 0) {
      await prisma.notificationPref.createMany({
        data: missing.map((type) => ({ userId, type, enabled: true })),
        skipDuplicates: true,
      });
    }

    // Return all prefs (re-fetch to include newly created)
    const prefs = await prisma.notificationPref.findMany({
      where: { userId },
      select: { type: true, enabled: true },
      orderBy: { type: 'asc' },
    });

    res.json({ prefs });
  } catch (err) {
    console.error('GET /users/me/notification-prefs error:', err);
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// PUT /api/users/me/notification-prefs — update a single notification preference
router.put('/me/notification-prefs', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { type, enabled } = req.body;

    if (!NOTIFICATION_PREF_TYPES.includes(type as NotificationPrefType)) {
      res.status(400).json({ error: `Invalid type. Must be one of: ${NOTIFICATION_PREF_TYPES.join(', ')}` });
      return;
    }
    if (typeof enabled !== 'boolean') {
      res.status(400).json({ error: 'enabled must be a boolean' });
      return;
    }

    const pref = await prisma.notificationPref.upsert({
      where: { userId_type: { userId, type: type as NotificationPrefType } },
      create: { userId, type: type as NotificationPrefType, enabled },
      update: { enabled },
      select: { type: true, enabled: true },
    });

    res.json({ pref });
  } catch (err) {
    console.error('PUT /users/me/notification-prefs error:', err);
    res.status(500).json({ error: 'Failed to update notification preference' });
  }
});

// PATCH /api/users/me/notification-prefs — alias for PUT (same semantics, supports both HTTP methods)
router.patch('/me/notification-prefs', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { type, enabled } = req.body;

    if (!NOTIFICATION_PREF_TYPES.includes(type as NotificationPrefType)) {
      res.status(400).json({ error: `Invalid type. Must be one of: ${NOTIFICATION_PREF_TYPES.join(', ')}` });
      return;
    }
    if (typeof enabled !== 'boolean') {
      res.status(400).json({ error: 'enabled must be a boolean' });
      return;
    }

    const pref = await prisma.notificationPref.upsert({
      where: { userId_type: { userId, type: type as NotificationPrefType } },
      create: { userId, type: type as NotificationPrefType, enabled },
      update: { enabled },
      select: { type: true, enabled: true },
    });

    res.json({ pref });
  } catch (err) {
    console.error('PATCH /users/me/notification-prefs error:', err);
    res.status(500).json({ error: 'Failed to update notification preference' });
  }
});

// POST /api/users/avatar — upload avatar image
router.post('/avatar', requireAuth, upload.single('avatar'), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const file = req.file;
    if (!file) { res.status(400).json({ error: 'No file uploaded' }); return; }

    // Validate real file content via magic bytes (prevents MIME type spoofing)
    let detectedMime: string;
    try {
      detectedMime = validateImageMagicBytes(file.buffer);
    } catch {
      res.status(400).json({ error: 'Invalid file content. Only JPEG, PNG, WebP, GIF images are allowed.' }); return;
    }

    const { url } = await uploadFile(file.buffer, detectedMime, 'avatars');

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

// DELETE /api/users/me — soft-delete account (GDPR right to erasure)
// Sets deletedAt = now(), revokes all sessions immediately.
// A cron job will hard-delete the account and all its data 30 days later.
router.delete('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Soft-delete: set deletedAt timestamp
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    // Revoke ALL sessions immediately so existing tokens stop working
    await prisma.session.deleteMany({ where: { userId } });

    // Clear httpOnly cookies for web clients
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /users/me error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// GET /api/users/me/sessions — list active sessions for current user
router.get('/me/sessions', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const sessions = await prisma.session.findMany({
      where: { userId, expiresAt: { gte: new Date() } },
      select: { id: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ sessions });
  } catch (err) {
    console.error('GET /users/me/sessions error:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// DELETE /api/users/me/sessions/:id — revoke a specific session
router.delete('/me/sessions/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const sessionId = req.params.id;
    await prisma.session.deleteMany({ where: { id: sessionId, userId } });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /users/me/sessions/:id error:', err);
    res.status(500).json({ error: 'Failed to revoke session' });
  }
});

// GET /api/users/:id — public seller profile
router.get('/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id, role: { not: 'blocked' } },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      promotions: {
        where: {
          promotionType: 'unlimited_sub',
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        select: { id: true },
      },
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
  // UC-16: isPremium = seller has active unlimited_sub promotion
  const { promotions: _promos, ...userBase } = user;
  const isPremium = _promos.length > 0;
  res.json({
    id: userBase.id,
    name: userBase.name || 'User',
    avatarUrl: userBase.avatarUrl,
    createdAt: userBase.createdAt,
    activeListings: userBase._count.listings,
    isPremium,
  });
});

export default router;
