import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Prisma } from '@prisma/client';
import { z, ZodError } from 'zod';
import { ListingStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { uploadFile, deleteFile } from '../lib/storage';
import { requireAuth } from '../middleware/auth';
import { listingCreateRateLimit, searchRateLimit, phoneRevealRateLimit } from '../middleware/rateLimiter';
import { geocodeCity, geocodeAddress } from '../lib/geocoder';
import { isValidOwnerTransition, getOwnerAllowedTransitions, ALL_LISTING_STATUSES } from '../lib/listing-state-machine';
import xss from 'xss';

const router = Router();

// View deduplication: track {ip}:{listingId}:{date} to count only 1 view per IP per listing per day.
// In-memory only — does not survive restarts, single-process assumption.
// Future: replace with Redis when cluster mode is introduced.
const viewedToday = new Map<string, Set<string>>();

// Purge stale date keys every hour to prevent unbounded memory growth.
setInterval(() => {
  const today = new Date().toISOString().slice(0, 10);
  for (const date of viewedToday.keys()) {
    if (date !== today) viewedToday.delete(date);
  }
}, 60 * 60 * 1000).unref();

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

// Prisma uses cuid() for IDs — validate as non-empty string with min length
const cuid = z.string().min(1);

const createListingSchema = z.object({
  title: z.string().min(5).max(100).transform(stripHtml),
  description: z.string().min(20).max(5000).transform(stripHtml).optional(),
  price: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().min(0)).optional().nullable(),
  currency: z.enum(['GEL', 'USD', 'EUR']).default('GEL'),
  categoryId: cuid,
  cityId: cuid,
  districtId: cuid.optional(),
  address: z.string().max(200).optional(),
});

// Draft schema: categoryId + cityId required by DB, all other fields optional
const createDraftSchema = z.object({
  title: z.string().min(1).max(100).transform(stripHtml).optional(),
  description: z.string().max(5000).transform(stripHtml).optional(),
  price: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().min(0)).optional().nullable(),
  currency: z.enum(['GEL', 'USD', 'EUR']).default('GEL'),
  categoryId: cuid,
  cityId: cuid,
  districtId: cuid.optional(),
  address: z.string().max(200).optional(),
  status: z.literal('draft'),
});

const updateListingSchema = createListingSchema.partial();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

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
        city: { select: { id: true, nameRu: true, nameEn: true, nameKa: true } },
        category: { select: { id: true, name: true, nameKa: true, nameRu: true, nameEn: true, slug: true } },
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
      lat: true, lng: true,
      city: { select: { lat: true, lng: true } },
      photos: { orderBy: { order: 'asc' }, take: 1, select: { url: true } },
    },
  });
  res.json(
    listings.map((l) => ({
      id: l.id, title: l.title, price: l.price, currency: l.currency,
      lat: l.lat ?? l.city.lat,
      lng: l.lng ?? l.city.lng,
      photo: l.photos[0]?.url || null,
    }))
  );
});

// GET /api/listings
router.get('/', searchRateLimit, async (req: Request, res: Response) => {
  const q = qs(req.query.q);
  const category = qs(req.query.category);
  const city = qs(req.query.city);
  const exclude = qs(req.query.exclude);
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
    user: { role: { not: 'blocked' } },
    AND: [
      { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      ...(q
        ? [
            {
              OR: [
                { title: { contains: q, mode: 'insensitive' as const } },
                { description: { contains: q, mode: 'insensitive' as const } },
              ],
            },
          ]
        : []),
    ],
    ...(categoryId ? { categoryId } : {}),
    ...(city ? { cityId: city } : {}),
    ...(userId ? { userId } : {}),
    ...(exclude ? { id: { not: exclude } } : {}),
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
        city: { select: { id: true, nameRu: true, nameEn: true, nameKa: true } },
        category: { select: { id: true, name: true, nameKa: true, nameRu: true, nameEn: true, slug: true } },
        promotions: {
          where: { isActive: true },
          select: { promotionType: true, expiresAt: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            promotions: {
              where: {
                promotionType: 'unlimited_sub',
                isActive: true,
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
              },
              select: { id: true },
            },
          },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  // Sort: promoted (top_*) listings first, then premium (unlimited_sub), then original order
  const TOP_TYPES = new Set(['top_1d', 'top_3d', 'top_7d']);
  const enriched = listings.map((l) => {
    const activePromos = l.promotions || [];
    const isTop = activePromos.some((p) => TOP_TYPES.has(p.promotionType));
    const isHighlighted = activePromos.some((p) => p.promotionType === 'highlight');
    const isPremium = (l.user?.promotions?.length ?? 0) > 0;
    const { promotions: _userPromos, ...userWithoutPromos } = l.user ?? { id: '', name: null };
    return { ...l, user: userWithoutPromos, isPromoted: isTop, isHighlighted, isPremium };
  });

  // Stable sort: top_* first, then premium, then original order preserved
  enriched.sort((a, b) => {
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
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
      user: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          promotions: {
            where: {
              promotionType: 'unlimited_sub',
              isActive: true,
              OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
            select: { id: true },
          },
        },
      },
    },
  });
  if (!listing) { res.status(404).json({ error: 'Not found' }); return; }

  // UC-05: increment views only once per IP per listing per day.
  const today = new Date().toISOString().slice(0, 10);
  const viewKey = `${req.ip || 'unknown'}:${id}:${today}`;
  if (!viewedToday.has(today)) viewedToday.set(today, new Set());
  const todaySet = viewedToday.get(today)!;
  let updatedViews = listing.views;
  if (!todaySet.has(viewKey)) {
    todaySet.add(viewKey);
    await prisma.listing.update({ where: { id }, data: { views: { increment: 1 } } });
    updatedViews = listing.views + 1;
  }

  // UC-16: compute isPremium — seller has active unlimited_sub promotion
  const { promotions: _sellerPromos, ...sellerInfo } = listing.user ?? { id: '', name: null, createdAt: new Date() };
  const isPremium = (_sellerPromos?.length ?? 0) > 0;
  res.json({ ...listing, user: sellerInfo, isPremium, views: updatedViews });
});

// GET /api/listings/:id/phone — reveal seller phone (auth required, rate limited)
router.get('/:id/phone', requireAuth, phoneRevealRateLimit, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { id: true, status: true, user: { select: { phone: true } } },
  });
  if (!listing) { res.status(404).json({ error: 'Not found' }); return; }
  if (listing.status !== 'active') { res.status(410).json({ error: 'Listing is not active' }); return; }
  res.json({ phone: listing.user.phone || null });
});

// POST /api/listings
router.post('/', requireAuth, listingCreateRateLimit, async (req: Request, res: Response) => {
  const isDraft = req.body.status === 'draft';
  let data: any;
  try {
    data = isDraft ? createDraftSchema.parse(req.body) : createListingSchema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.errors[0]?.message || 'Validation failed' }); return;
    }
    throw err;
  }
  const { title, description, price, currency, categoryId, cityId, districtId, address } = data;
  // Sanitize text fields to strip HTML tags (XSS prevention) — defense in depth
  const safeTitle = title ? xss(title) : 'Draft';
  const safeDescription = description ? xss(description) : description;
  const userId = req.user!.userId;

  // Per-category free listing quota check (only for non-draft listings)
  if (!isDraft) {
    const userRecord = await prisma.user.findUnique({ where: { id: userId } });
    if (userRecord?.role !== 'admin') {
      // Check if user has an active unlimited_sub promotion — bypasses quota
      const hasUnlimited = await prisma.promotion.findFirst({
        where: {
          userId,
          promotionType: 'unlimited_sub',
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });
      if (!hasUnlimited) {
        // Load category with parent for inheritance
        const cat = await prisma.category.findUnique({
          where: { id: categoryId },
          include: { parent: { select: { freeListingQuota: true, paidListingPrice: true } } },
        });
        // Subcategory inherits from parent if own freeListingQuota is 0
        const freeQuota = (cat && cat.freeListingQuota === 0 && cat.parent)
          ? cat.parent.freeListingQuota
          : (cat?.freeListingQuota ?? 10);
        const paidPrice = (cat && cat.freeListingQuota === 0 && cat.parent)
          ? cat.parent.paidListingPrice
          : (cat?.paidListingPrice ?? 0);

        // Count active + pending_moderation listings in THIS category
        const usedCount = await prisma.listing.count({
          where: {
            userId,
            categoryId,
            status: { in: ['active', 'pending_moderation'] },
          },
        });

        if (usedCount >= freeQuota) {
          if (paidPrice === 0) {
            // Extra listings are blocked (not purchasable)
            res.status(402).json({
              error: 'quota_exceeded',
              allowPaid: false,
              freeQuota,
              used: usedCount,
            });
            return;
          }
          // Paid listing flow: require paymentId
          const paymentId = req.body.paymentId as string | undefined;
          if (!paymentId) {
            res.status(402).json({
              error: 'quota_exceeded',
              allowPaid: true,
              price: paidPrice,
              freeQuota,
              used: usedCount,
            });
            return;
          }
          // Verify payment: must be completed, belong to user, not yet consumed
          const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
          if (!payment || payment.status !== 'completed' || payment.userId !== userId || payment.listingId !== null) {
            res.status(400).json({ error: 'Invalid or already used payment' });
            return;
          }
          // Atomically mark payment as consumed (set listingId after listing creation below)
          // We store paymentId to link after creation
          (req as any)._quotaPaymentId = paymentId;
        }
      }
    }
  }

  // Duplicate listing protection: block same user + category + title within 24h (skip for drafts and admins)
  if (!isDraft && req.user!.role !== 'admin') {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dupe = await prisma.listing.findFirst({
      where: {
        userId,
        categoryId,
        status: { in: ['active', 'pending_moderation'] },
        createdAt: { gte: since },
        title: { equals: safeTitle, mode: 'insensitive' },
      },
      select: { id: true },
    });
    if (dupe) {
      res.status(409).json({ error: 'duplicate_listing', existingId: dupe.id });
      return;
    }
  }

  // Determine initial status based on admin settings (skip for drafts)
  let initialStatus: ListingStatus = isDraft ? 'draft' : 'pending_moderation';
  let autoRejectionReason: string | null = null;
  let autoActivatedAt: Date | null = null;
  let autoExpiresAt: Date | null = null;

  if (!isDraft) {
    // Load admin settings: auto-moderation toggle + banned words
    const settingsRows = await prisma.appSettings.findMany({
      where: { key: { in: ['autoModerationEnabled', 'bannedWords'] } },
    });
    const settingsByKey: Record<string, string> = {};
    for (const row of settingsRows) settingsByKey[row.key] = row.value;

    const autoModerationEnabled = settingsByKey['autoModerationEnabled'] === 'true';
    const bannedWords: string[] = settingsByKey['bannedWords']
      ? (JSON.parse(settingsByKey['bannedWords']) as string[])
      : [];

    if (bannedWords.length > 0) {
      const textToCheck = `${safeTitle} ${safeDescription ?? ''}`.toLowerCase();
      const matchedWord = bannedWords.find((w) => textToCheck.includes(w));
      if (matchedWord) {
        // Auto-reject: listing contains a banned word
        initialStatus = 'rejected';
        autoRejectionReason = `Auto-rejected: contains banned word`;
      }
    }

    // Only auto-approve if not already auto-rejected
    if (initialStatus === 'pending_moderation' && autoModerationEnabled) {
      initialStatus = 'active';
      const now = new Date();
      autoActivatedAt = now;
      autoExpiresAt = new Date(now.getTime() + LISTING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    }
  }

  // Geocode coordinates — best-effort, never blocks listing creation
  // If address is provided: try address-level first, fall back to city-level
  let lat: number | null = null;
  let lng: number | null = null;
  if (cityId) {
    const cityRecord = await prisma.city.findUnique({ where: { id: cityId }, select: { nameEn: true } });
    if (cityRecord?.nameEn) {
      if (address) {
        const addrCoords = await geocodeAddress(address, cityRecord.nameEn);
        if (addrCoords) {
          lat = addrCoords.lat;
          lng = addrCoords.lng;
        }
      }
      if (lat === null) {
        const cityCoords = await geocodeCity(cityRecord.nameEn);
        if (cityCoords) { lat = cityCoords.lat; lng = cityCoords.lng; }
      }
    }
  }
  try {
    const listing = await prisma.listing.create({
      data: {
        title: safeTitle,
        description: safeDescription,
        price: price ?? null,
        currency: currency || 'GEL',
        categoryId,
        cityId,
        districtId,
        address: address ?? null,
        userId,
        status: initialStatus,
        ...(autoRejectionReason ? { rejectionReason: autoRejectionReason } : {}),
        ...(autoActivatedAt ? { activatedAt: autoActivatedAt } : {}),
        ...(autoExpiresAt ? { expiresAt: autoExpiresAt } : {}),
        lat,
        lng,
      },
    });

    // Atomically link payment to listing if quota was exceeded and payment was provided
    const quotaPaymentId = (req as any)._quotaPaymentId as string | undefined;
    if (quotaPaymentId) {
      await prisma.payment.update({
        where: { id: quotaPaymentId },
        data: { listingId: listing.id },
      });
    }

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
  const { title, description, price, currency, categoryId, cityId, districtId, address } = updateData;
  const newPrice = price;
  // Sanitize only fields present in the request body to strip HTML tags (XSS prevention)
  const safeTitle = title !== undefined ? xss(title) : title;
  const safeDescription = description !== undefined ? xss(description) : description;
  // Re-geocode when address or cityId changes
  let coordsUpdate: { lat?: number | null; lng?: number | null } = {};
  const newAddress = address !== undefined ? address : undefined;
  const effectiveCityId = cityId ?? listing.cityId;
  if (address !== undefined || cityId !== undefined) {
    const city = await prisma.city.findUnique({ where: { id: effectiveCityId }, select: { nameEn: true } });
    if (city?.nameEn) {
      const addrToGeocode = address !== undefined ? address : listing.address;
      if (addrToGeocode) {
        const addrCoords = await geocodeAddress(addrToGeocode, city.nameEn);
        if (addrCoords) {
          coordsUpdate = { lat: addrCoords.lat, lng: addrCoords.lng };
        }
      }
      if (coordsUpdate.lat === undefined) {
        const cityCoords = await geocodeCity(city.nameEn);
        coordsUpdate = { lat: cityCoords?.lat ?? null, lng: cityCoords?.lng ?? null };
      }
    } else {
      coordsUpdate = { lat: null, lng: null };
    }
  }
  const updated = await prisma.listing.update({
    where: { id },
    data: {
      title: safeTitle, description: safeDescription,
      price: newPrice,
      currency, categoryId, cityId, districtId,
      ...(newAddress !== undefined ? { address: newAddress || null } : {}),
      ...coordsUpdate,
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
        // Check notification preference — absence of row means enabled by default
        const pref = await prisma.notificationPref.findUnique({
          where: { userId_type: { userId: fav.user.id, type: 'price_drop' } },
        });
        if (pref && !pref.enabled) continue;
        sendPriceDropNotification(fav.user.email, updated.title, oldPrice, newPrice)
          .catch(err => console.error('Price drop email error:', err));
      }
    }
  }

  res.json(updated);
});

// PATCH /api/listings/:id/status — owner status transitions (state machine)
router.patch('/:id/status', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) { res.status(404).json({ error: 'Not found' }); return; }
  if (listing.userId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

  const { status } = req.body;
  if (!status || !ALL_LISTING_STATUSES.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${ALL_LISTING_STATUSES.join(', ')}` }); return;
  }

  const currentStatus = listing.status as ListingStatus;
  const targetStatus = status as ListingStatus;

  // Validate transition using state machine
  if (!isValidOwnerTransition(currentStatus, targetStatus)) {
    const allowed = getOwnerAllowedTransitions(currentStatus);
    res.status(400).json({
      error: `Invalid status transition from '${currentStatus}' to '${targetStatus}'`,
      allowedTransitions: allowed,
    }); return;
  }

  // Submitting for moderation: validate required fields
  if (targetStatus === 'pending_moderation' && (currentStatus === 'draft' || currentStatus === 'rejected' || currentStatus === 'expired')) {
    if (!listing.title || listing.title === 'Draft' || !listing.categoryId || !listing.cityId) {
      res.status(400).json({ error: 'Listing is missing required fields (title, category, city)' }); return;
    }
  }

  const updated = await prisma.listing.update({ where: { id }, data: { status: targetStatus } });

  // Notify favoriters when listing is removed
  if (targetStatus === 'removed') {
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
        // Check notification preference — price_drop covers all listing-change alerts for favoriters
        const pref = await prisma.notificationPref.findUnique({
          where: { userId_type: { userId: fav.user.id, type: 'price_drop' } },
        });
        if (pref && !pref.enabled) continue;
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
  // 30-day cooldown: free renewal is allowed once per 30 days
  const RENEWAL_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;
  if (listing.lastRenewedAt && (Date.now() - listing.lastRenewedAt.getTime()) < RENEWAL_COOLDOWN_MS) {
    res.status(403).json({ error: 'Free renewal available once per 30 days' }); return;
  }
  const expiresAt = new Date(Date.now() + LISTING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const updated = await prisma.listing.update({ where: { id }, data: { expiresAt, lastRenewedAt: new Date() } });
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
  const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const invalidFile = files.find(f => !ALLOWED_MIME.includes(f.mimetype));
  if (invalidFile) {
    res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, WebP, GIF allowed.' }); return;
  }
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
