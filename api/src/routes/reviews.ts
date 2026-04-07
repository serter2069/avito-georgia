import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/reviews/stats/:userId — average rating + total for a seller (public)
// IMPORTANT: registered before GET / and GET ?sellerId to avoid "stats" matching as a query param
router.get('/stats/:userId', async (req: Request, res: Response) => {
  const sellerId = String(req.params.userId);

  const result = await prisma.review.aggregate({
    where: { sellerId },
    _avg: { rating: true },
    _count: { id: true },
  });

  res.json({
    averageRating: result._avg.rating ? Math.round(result._avg.rating * 10) / 10 : null,
    totalReviews: result._count.id,
  });
});

// GET /api/reviews?sellerId= — list reviews for a seller (public)
router.get('/', async (req: Request, res: Response) => {
  const sellerId = req.query.sellerId ? String(req.query.sellerId) : undefined;

  if (!sellerId) {
    res.status(400).json({ error: 'sellerId query param is required' });
    return;
  }

  const reviews = await prisma.review.findMany({
    where: { sellerId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      listing: { select: { id: true, title: true } },
    },
  });

  res.json({ reviews, total: reviews.length });
});

// POST /api/reviews — create a review (auth required)
// Guards: listing exists → listing.status === 'sold' → caller !== seller → ThreadParticipant check → unique (409)
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const authorId = req.user!.userId;
  const { listingId, rating, text } = req.body;

  // Validate input
  if (!listingId || typeof listingId !== 'string') {
    res.status(400).json({ error: 'listingId is required' });
    return;
  }
  const ratingNum = Number(rating);
  if (!rating || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
    return;
  }
  // UC-15: review text max 500 characters
  if (text && typeof text === 'string' && text.trim().length > 500) {
    res.status(400).json({ error: 'Review text must be 500 characters or fewer' });
    return;
  }

  // Guard 1: listing must exist
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    res.status(404).json({ error: 'Listing not found' });
    return;
  }

  // Guard 2: listing must be sold
  if (listing.status !== 'sold') {
    res.status(400).json({ error: 'Reviews can only be left for sold listings' });
    return;
  }

  // Guard 3: caller must not be the seller
  if (listing.userId === authorId) {
    res.status(403).json({ error: 'Sellers cannot review their own listings' });
    return;
  }

  // Guard 4: caller must have been a thread participant on this listing
  const thread = await prisma.thread.findFirst({
    where: {
      listingId,
      participants: { some: { userId: authorId } },
    },
  });
  if (!thread) {
    res.status(403).json({ error: 'Only buyers who contacted the seller can leave a review' });
    return;
  }

  // Guard 5: unique constraint — one review per author+listing (409 if duplicate)
  const existing = await prisma.review.findUnique({
    where: { authorId_listingId: { authorId, listingId } },
  });
  if (existing) {
    res.status(409).json({ error: 'You have already reviewed this listing' });
    return;
  }

  const review = await prisma.review.create({
    data: {
      listingId,
      authorId,
      sellerId: listing.userId,
      rating: ratingNum,
      text: text && typeof text === 'string' ? text.trim() || null : null,
    },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      listing: { select: { id: true, title: true } },
    },
  });

  res.status(201).json(review);
});

export default router;
