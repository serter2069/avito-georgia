import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Prisma } from '@prisma/client';
import { z, ZodError } from 'zod';
import { prisma } from '../lib/prisma';
import { uploadFile, deleteFile } from '../lib/storage';
import { requireAuth } from '../middleware/auth';
import xss from 'xss';

const router = Router();

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

const createListingSchema = z.object({
  title: z.string().min(5).max(100).transform(stripHtml),
  description: z.string().min(20).max(5000).transform(stripHtml).optional(),
  price: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().min(0)).optional().nullable(),
  currency: z.enum(['GEL', 'USD', 'EUR']).default('GEL'),
  categoryId: z.string().uuid(),
  cityId: z.string().uuid(),
  districtId: z.string().uuid().optional(),
});

const updateListingSchema = createListingSchema.partial();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const ACTIVE_LISTING_LIMIT = 10;
const LISTING_EXPIRY_DAYS = 30;

function qs(val: unknown): string | undefined {
  if (typeof val === 'string') return val;
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0];
  return undefined;
}

// GET /api/listings/my — authenticated user's own listings (all statuses)
router.get('/my', requireAuth, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const status = qs(req.query.status); // 'active' | 'sold' | 'removed' or undefined for all
  const limit = Math.min(parseInt(qs(req.query.limit) || '20', 10), 50);
  const page = parseInt(qs(req.query.page) || '1', 10);
  const skip = (page - 1) * limit;

  const where: Prisma.ListingWhereInput = {
    userId,
    ...(status ? { status: status as any } : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
      include: {
        photos: { orderBy: { order: 'asc' }, take: 1 },
        city: { select: { id: true, nameRu: true } },
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  res.json({ listings, total, page, limit });
});

// GET /api/listings/map?city= — MUST be before /:id
// city param is optional: omit to get all cities
router.get('/map', async (req: Request, res: Response) => {
  const city = qs(req.query.city);
  const listings = await prisma.listing.findMany({
    where: {
      ...(city ? { cityId: city } : {}),
      status: 'active',
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: {
      id: true, title: true, price: true, currency: true,
      city: { select: { lat: true, lng: true } },
      photos: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
    },
  });
  res.json(
    listings.map((l) => ({
      id: l.id, title: l.title, price: l.price, currency: l.currency,
      lat: l.city.lat, lng: l.city.lng,
      photo: l.photos[0]?.url || null,
    }))
  );
});

// GET /api/listings
router.get('/', async (req: Request, res: Response) => {
  const q = qs(req.query.q);
  const category = qs(req.query.category);
  const city = qs(req.query.city);
  const price_min = qs(req.query.price_min);
  const price_max = qs(req.query.price_max);
  const sort = qs(req.query.sort);
  const limit = Math.min(parseInt(qs(req.query.limit) || '20', 10), 50);
  const page = parseInt(qs(req.query.page) || '1', 10);
  const take = limit;
  const skip = (page - 1) * take;
  const userId = qs(req.query.userId);

  // Resolve category: accept either a cuid (starts with 'c', 25+ chars) or a slug
  let categoryId: string | undefined;
  if (category) {
    const isCuid = /^c[a-z0-9]{24,}$/.test(category);
    if (isCuid) {
      categoryId = category;
    } else {
      const cat = await prisma.category.findFirst({ where: { slug: category } });
      if (cat) {
        categoryId = cat.id;
      } else {
        res.json({ listings: [], total: 0, page, limit: take });
        return;
      }
    }
  }

  const where: Prisma.ListingWhereInput = {
    status: 'active',
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    ...(q ? { title: { contains: q, mode: 'insensitive' as const } } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(city ? { cityId: city } : {}),
    ...(userId ? { userId } : {}),
    ...(price_min || price_max
      ? {
          price: {
            ...(price_min ? { gte: parseFloat(price_min) } : {}),
            ...(price_max ? { lte: parseFloat(price_max) } : {}),
          },
        }
      : {}),
  };
  type OrderBy = Prisma.ListingOrderByWithRelationInput;
  const sortMap: Record<string, OrderBy> = {
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    views_desc: { views: 'desc' },
    createdAt_desc: { createdAt: 'desc' },
  };
  const orderBy: OrderBy = sortMap[sort || ''] || { createdAt: 'desc' };
  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where, orderBy, take, skip,
      include: {
        photos: { orderBy: { order: 'asc' }, take: 3 },
        city: { select: { id: true, nameRu: true } },
        category: { select: { id: true, name: true } },
        promotions: {
          where: { isActive: true },
          select: { promotionType: true, expiresAt: true },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  // Sort: promoted (top_*) listings first, then by original sort order
  const TOP_TYPES = new Set(['top_1d', 'top_3d', 'top_7d']);
  const enriched = listings.map((l) => {
    const activePromos = l.promotions || [];
    const isTop = activePromos.some((p) => TOP_TYPES.has(p.promotionType));
    const isHighlighted = activePromos.some((p) => p.promotionType === 'highlight');
    return { ...l, isPromoted: isTop, isHighlighted };
  });

  // Stable sort: promoted first, then original order preserved
  enriched.sort((a, b) => {
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;
    return 0;
  });

  res.json({ listings: enriched, total, page, limit: take });
});

// GET /api/listings/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: 'asc' } },
      city: true, district: true, category: true,
      // phone intentionally excluded — contact via chat only
      user: { select: { id: true, name: true, createdAt: true } },
    },
  });
  if (!listing) { res.status(404).json({ error: 'Not found' }); return; }
  // Atomic view increment
  await prisma.listing.update({ where: { id }, data: { views: { increment: 1 } } });
  res.json({ ...listing, views: listing.views + 1 });
});

// POST /api/listings
router.post('/', requireAuth, async (req: Request, res: Response) => {
  let data;
  try {
    data = createListingSchema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.errors[0]?.message || 'Validation failed' }); return;
    }
    throw err;
  }
  const { title, description, price, currency, categoryId, cityId, districtId } = data;
  // Sanitize text fields to strip HTML tags (XSS prevention) — defense in depth
  const safeTitle = xss(title);
  const safeDescription = description ? xss(description) : description;
  const userId = req.user!.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role !== 'admin') {
    // Check if user has an active unlimited_sub promotion — bypasses the listing limit
    const hasUnlimited = await prisma.promotion.findFirst({
      where: {
        userId,
        promotionType: 'unlimited_sub',
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });
    if (!hasUnlimited) {
      const activeCount = await prisma.listing.count({
        where: {
          userId, status: 'active',
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });
      if (activeCount >= ACTIVE_LISTING_LIMIT) {
        res.status(403).json({ error: `Active listing limit reached (${ACTIVE_LISTING_LIMIT})` }); return;
      }
    }
  }
  const expiresAt = new Date(Date.now() + LISTING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  try {
    const listing = await prisma.listing.create({
      data: { title: safeTitle, description: safeDescription, price: price ?? null, currency, categoryId, cityId, districtId, userId, expiresAt },
    });
    res.status(201).json(listing);
  } catch (err: any) {
    if (err?.code === 'P2003' || err?.code === 'P2025') {
      res.status(400).json({ error: 'Invalid categoryId or districtId — record not found' });
      return;
    }
    console.error('POST /listings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/listings/:id
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) { res.status(404).json({ error: 'Not found' }); return; }
  if (listing.userId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }
  const oldPrice = listing.price;
  let updateData;
  try {
    updateData = updateListingSchema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.errors[0]?.message || 'Validation failed' }); return;
    }
    throw err;
  }
  const { title, description, price, currency, categoryId, cityId, districtId } = updateData;
  const newPrice = price;
  // Sanitize only fields present in the request body to strip HTML tags (XSS prevention)
  const safeTitle = title !== undefined ? xss(title) : title;
  const safeDescription = description !== undefined ? xss(description) : description;
  const updated = await prisma.listing.update({
    where: { id },
    data: {
      title: safeTitle, description: safeDescription,
      price: newPrice,
      currency, categoryId, cityId, districtId,
    },
  });

  // Price-drop notification for users who favorited this listing
  if (newPrice !== undefined && newPrice !== null && oldPrice !== null && newPrice < oldPrice) {
    const favorites = await prisma.favorite.findMany({
      where: { listingId: id },
      include: { user: { select: { id: true, email: true } } },
    });
    if (favorites.length > 0) {
      await prisma.notification.createMany({
        data: favorites.map(f => ({
          userId: f.user.id,
          listingId: id,
          type: 'PRICE_DROP',
          payload: { oldPrice, newPrice, title: updated.title },
        })),
      });
      const { sendPriceDropNotification } = await import('../lib/mail');
      for (const fav of favorites) {
        sendPriceDropNotification(fav.user.email, updated.title, oldPrice, newPrice)
          .catch(err => console.error('Price drop email error:', err));
      }
    }
  }

  res.json(updated);
});

// PATCH /api/listings/:id/status
router.patch('/:id/status', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) { res.status(404).json({ error: 'Not found' }); return; }
  if (listing.userId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }
  const { status } = req.body;
  if (!['sold', 'removed'].includes(status)) {
    res.status(400).json({ error: 'status must be sold or removed' }); return;
  }
  const updated = await prisma.listing.update({ where: { id }, data: { status } });

  // Notify favoriters when listing is removed
  if (status === 'removed') {
    const favorites = await prisma.favorite.findMany({
      where: { listingId: id },
      include: { user: { select: { id: true, email: true } } },
    });
    if (favorites.length > 0) {
      await prisma.notification.createMany({
        data: favorites.map(f => ({
          userId: f.user.id,
          listingId: id,
          type: 'LISTING_REMOVED',
          payload: { title: listing.title },
        })),
      });
      const { sendListingRemovedNotification } = await import('../lib/mail');
      for (const fav of favorites) {
        sendListingRemovedNotification(fav.user.email, listing.title)
          .catch(err => console.error('Listing removed email error:', err));
      }
    }
  }

  res.json(updated);
});

// POST /api/listings/:id/renew
router.post('/:id/renew', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) { res.status(404).json({ error: 'Not found' }); return; }
  if (listing.userId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }
  if (listing.status !== 'active') { res.status(400).json({ error: 'Can only renew active listings' }); return; }
  const expiresAt = new Date(Date.now() + LISTING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const updated = await prisma.listing.update({ where: { id }, data: { expiresAt } });
  res.json(updated);
});

// POST /api/listings/:id/photos
const photosWithIds = Prisma.validator<Prisma.ListingInclude>()({
  photos: { select: { id: true } },
});
type ListingWithPhotos = Prisma.ListingGetPayload<{ include: typeof photosWithIds }>;

router.post('/:id/photos', requireAuth, upload.array('photos', 10), async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const listingWithPhotos = await prisma.listing.findUnique({
    where: { id },
    include: photosWithIds,
  }) as ListingWithPhotos | null;
  if (!listingWithPhotos) { res.status(404).json({ error: 'Not found' }); return; }
  if (listingWithPhotos.userId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }
  const files = req.files as Express.Multer.File[];
  if (!files?.length) { res.status(400).json({ error: 'No files uploaded' }); return; }
  const currentCount = listingWithPhotos.photos.length;
  if (currentCount + files.length > 10) {
    res.status(400).json({ error: `Max 10 photos. Currently ${currentCount}, uploading ${files.length}` }); return;
  }
  const uploaded = await Promise.all(
    files.map(async (file, i) => {
      const { url, key } = await uploadFile(file.buffer, file.mimetype);
      return prisma.listingPhoto.create({
        data: { listingId: id, url, key, order: currentCount + i },
      });
    })
  );
  res.status(201).json(uploaded);
});

// DELETE /api/listings/:id/photos/:photoId
router.delete('/:id/photos/:photoId', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const photoId = String(req.params.photoId);
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) { res.status(404).json({ error: 'Not found' }); return; }
  if (listing.userId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }
  const photo = await prisma.listingPhoto.findUnique({ where: { id: photoId } });
  if (!photo || photo.listingId !== id) { res.status(404).json({ error: 'Photo not found' }); return; }
  if (photo.key) await deleteFile(photo.key);
  await prisma.listingPhoto.delete({ where: { id: photoId } });
  res.json({ ok: true });
});

export default router;
