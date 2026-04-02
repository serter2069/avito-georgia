import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { uploadFile, deleteFile } from '../lib/storage';
import { requireAuth } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const ACTIVE_LISTING_LIMIT = 10;
const LISTING_EXPIRY_DAYS = 30;

function qs(val: unknown): string | undefined {
  if (typeof val === 'string') return val;
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0];
  return undefined;
}

// GET /api/listings/map?city= — MUST be before /:id
router.get('/map', async (req: Request, res: Response) => {
  const city = qs(req.query.city);
  if (!city) { res.status(400).json({ error: 'city param required' }); return; }
  const listings = await prisma.listing.findMany({
    where: {
      cityId: city,
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
  const category = qs(req.query.category);
  const city = qs(req.query.city);
  const price_min = qs(req.query.price_min);
  const price_max = qs(req.query.price_max);
  const sort = qs(req.query.sort);
  const page = parseInt(qs(req.query.page) || '1', 10);
  const take = 20;
  const skip = (page - 1) * take;
  const where: Prisma.ListingWhereInput = {
    status: 'active',
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    ...(category ? { categoryId: category } : {}),
    ...(city ? { cityId: city } : {}),
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
      },
    }),
    prisma.listing.count({ where }),
  ]);
  res.json({ listings, total, page, limit: take });
});

// GET /api/listings/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: 'asc' } },
      city: true, district: true, category: true,
      user: { select: { id: true, name: true, phone: true, createdAt: true } },
    },
  });
  if (!listing) { res.status(404).json({ error: 'Not found' }); return; }
  // Atomic view increment
  await prisma.listing.update({ where: { id }, data: { views: { increment: 1 } } });
  res.json({ ...listing, views: listing.views + 1 });
});

// POST /api/listings
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const { title, description, price, currency = 'GEL', categoryId, cityId, districtId } = req.body;
  if (!title || !categoryId || !cityId) {
    res.status(400).json({ error: 'title, categoryId, cityId required' }); return;
  }
  const userId = req.user!.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role !== 'admin') {
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
  const expiresAt = new Date(Date.now() + LISTING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  try {
    const listing = await prisma.listing.create({
      data: { title, description, price: price ? parseFloat(price) : null, currency, categoryId, cityId, districtId, userId, expiresAt },
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
  const { title, description, price, currency, categoryId, cityId, districtId } = req.body;
  const newPrice = price !== undefined ? parseFloat(price) : undefined;
  const updated = await prisma.listing.update({
    where: { id },
    data: {
      title, description,
      price: newPrice,
      currency, categoryId, cityId, districtId,
    },
  });

  // Price-drop notification for users who favorited this listing
  if (newPrice !== undefined && oldPrice !== null && newPrice < oldPrice) {
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
