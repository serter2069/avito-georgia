import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Lazy Stripe initialization — avoids crash on startup if key is missing
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
    _stripe = new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
  }
  return _stripe;
}

// Price config: amount in tetri (1 GEL = 100 tetri), Stripe uses smallest unit
const PRICES: Record<string, { amount: number; label: string; days: number | null; recurring: boolean }> = {
  top_1d:        { amount: 500,  label: 'Top 1 day',           days: 1,    recurring: false },
  top_3d:        { amount: 1200, label: 'Top 3 days',          days: 3,    recurring: false },
  top_7d:        { amount: 2500, label: 'Top 7 days',          days: 7,    recurring: false },
  highlight:     { amount: 300,  label: 'Highlight 7 days',    days: 7,    recurring: false },
  unlimited_sub: { amount: 999,  label: 'Unlimited listings',  days: null, recurring: true  },
};

// POST /api/promotions/purchase — create Stripe checkout
router.post('/purchase', requireAuth, async (req: Request, res: Response) => {
  const { listingId, type } = req.body;
  const userId = req.user!.userId;

  const priceConfig = PRICES[type];
  if (!priceConfig) {
    res.status(400).json({ error: 'Invalid promotion type. Valid: ' + Object.keys(PRICES).join(', ') });
    return;
  }

  // For non-subscription types, listingId is required
  if (!priceConfig.recurring && !listingId) {
    res.status(400).json({ error: 'listingId required for this promotion type' });
    return;
  }

  // Verify listing belongs to user (for non-subscription)
  if (listingId) {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }
    if (listing.userId !== userId) {
      res.status(403).json({ error: 'Not your listing' });
      return;
    }

    // Check for active promotion of same type on this listing
    const existing = await prisma.promotion.findFirst({
      where: { listingId, promotionType: type, isActive: true },
    });
    if (existing) {
      res.status(409).json({ error: 'Active promotion of this type already exists for this listing' });
      return;
    }
  }

  try {
    if (priceConfig.recurring) {
      // Subscription flow: create a Stripe Checkout Session in subscription mode
      // Requires a Stripe Price object — for now, create inline price
      const session = await getStripe().checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'gel',
            product_data: { name: priceConfig.label },
            unit_amount: priceConfig.amount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        }],
        metadata: { userId, type },
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:8081'}/promotions/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8081'}/promotions/cancel`,
      });

      // Record pending payment
      await prisma.payment.create({
        data: {
          userId,
          amount: priceConfig.amount / 100,
          currency: 'GEL',
          status: 'pending',
          provider: 'stripe',
          externalId: session.id,
          promotionType: type,
        },
      });

      res.json({ url: session.url, sessionId: session.id });
    } else {
      // One-time payment: create PaymentIntent
      const paymentIntent = await getStripe().paymentIntents.create({
        amount: priceConfig.amount,
        currency: 'gel',
        metadata: { userId, listingId: listingId || '', type },
      });

      // Record pending payment
      await prisma.payment.create({
        data: {
          userId,
          amount: priceConfig.amount / 100,
          currency: 'GEL',
          status: 'pending',
          provider: 'stripe',
          externalId: paymentIntent.id,
          promotionType: type,
          listingId: listingId || null,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
    }
  } catch (err: any) {
    console.error('[promotions] Stripe error:', err.message);
    res.status(500).json({ error: 'Payment creation failed' });
  }
});

// GET /api/promotions/prices — list available promotion types and prices
router.get('/prices', (_req: Request, res: Response) => {
  const prices = Object.entries(PRICES).map(([key, val]) => ({
    type: key,
    label: val.label,
    amountGEL: val.amount / 100,
    days: val.days,
    recurring: val.recurring,
  }));
  res.json({ prices });
});

// GET /api/promotions/my — list user's active promotions
router.get('/my', requireAuth, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const promotions = await prisma.promotion.findMany({
    where: { userId, isActive: true },
    include: { listing: { select: { id: true, title: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ promotions });
});

export default router;
