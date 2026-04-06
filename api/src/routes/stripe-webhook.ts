import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { PromotionType } from '@prisma/client';

const router = Router();

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
    _stripe = new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
  }
  return _stripe;
}

const DAYS_MAP: Record<string, number | null> = {
  top_1d: 1,
  top_3d: 3,
  top_7d: 7,
  highlight: 7,
  unlimited_sub: null,
  bundle: 7,
};

// Bundle expands to two individual promotion types on fulfillment
const BUNDLE_SUB_TYPES: PromotionType[] = ['top_7d', 'highlight'];

// POST /api/stripe-webhook — receives raw body (express.raw applied in index.ts)
router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body, // must be raw Buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    res.status(400).json({ error: 'Webhook signature verification failed' });
    return;
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const { userId, listingId, type } = pi.metadata;

        if (!userId || !type) break;

        // Update payment status
        await prisma.payment.updateMany({
          where: { externalId: pi.id },
          data: { status: 'completed' },
        });

        // Create promotion(s) — idempotency: skip if already active
        const days = DAYS_MAP[type];
        if (listingId && days != null) {
          if (type === 'bundle') {
            // Bundle: create top_7d + highlight as separate Promotion records
            const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            for (const subType of BUNDLE_SUB_TYPES) {
              const existingSubPromo = await prisma.promotion.findFirst({
                where: { userId, listingId, promotionType: subType, isActive: true },
              });
              if (existingSubPromo) {
                console.log(`[stripe-webhook] Skipped duplicate bundle sub-promotion ${subType} for listing ${listingId}`);
                continue;
              }
              await prisma.promotion.create({
                data: {
                  userId,
                  listingId,
                  promotionType: subType,
                  isActive: true,
                  expiresAt,
                },
              });
              console.log(`[stripe-webhook] Created bundle sub-promotion ${subType} for listing ${listingId}, expires ${expiresAt.toISOString()}`);
            }
          } else {
            const existingPromo = await prisma.promotion.findFirst({
              where: { userId, listingId, promotionType: type as PromotionType, isActive: true },
            });
            if (existingPromo) {
              console.log(`[stripe-webhook] Skipped duplicate promotion ${type} for listing ${listingId}`);
              break;
            }
            const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            await prisma.promotion.create({
              data: {
                userId,
                listingId,
                promotionType: type as PromotionType,
                isActive: true,
                expiresAt,
              },
            });
            console.log(`[stripe-webhook] Created promotion ${type} for listing ${listingId}, expires ${expiresAt.toISOString()}`);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.updateMany({
          where: { externalId: pi.id },
          data: { status: 'failed' },
        });
        console.log(`[stripe-webhook] Payment failed: ${pi.id}`);
        break;
      }

      case 'checkout.session.completed': {
        // Subscription checkout completed
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, type } = session.metadata || {};

        if (!userId || type !== 'unlimited_sub') break;

        await prisma.payment.updateMany({
          where: { externalId: session.id },
          data: { status: 'completed' },
        });

        // Create unlimited_sub promotion (idempotency: skip if active sub already exists)
        const existingSub = await prisma.promotion.findFirst({
          where: { userId, listingId: null, promotionType: 'unlimited_sub', isActive: true },
        });
        if (existingSub) {
          console.log(`[stripe-webhook] Skipped duplicate unlimited_sub for user ${userId}`);
          break;
        }
        // Create unlimited_sub promotion (no expiry — managed by subscription)
        await prisma.promotion.create({
          data: {
            userId,
            listingId: null, // Not listing-specific
            promotionType: 'unlimited_sub',
            isActive: true,
            expiresAt: null,
          },
        });
        console.log(`[stripe-webhook] Created unlimited_sub for user ${userId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        // Subscription canceled — deactivate unlimited_sub promotion
        const sub = event.data.object as Stripe.Subscription;

        // Try metadata on the subscription object first (set via subscription_data.metadata at checkout)
        let userId: string | undefined = sub.metadata?.userId;

        // Fallback: look up the original checkout session to get userId from its metadata
        if (!userId) {
          const sessions = await getStripe().checkout.sessions.list({ subscription: sub.id, limit: 1 });
          userId = sessions.data[0]?.metadata?.userId ?? undefined;
        }

        if (!userId) {
          console.warn(`[stripe-webhook] customer.subscription.deleted: could not resolve userId for subscription ${sub.id}, skipping deactivation`);
          break;
        }

        const result = await prisma.promotion.updateMany({
          where: { userId, promotionType: 'unlimited_sub', isActive: true },
          data: { isActive: false },
        });

        if (result.count === 0) {
          console.warn(`[stripe-webhook] customer.subscription.deleted: no active unlimited_sub found for user ${userId} (sub ${sub.id})`);
        } else {
          console.log(`[stripe-webhook] Deactivated ${result.count} unlimited_sub promotion(s) for user ${userId} (sub ${sub.id})`);
        }
        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (err: any) {
    console.error('[stripe-webhook] Processing error:', err.message);
  }

  res.json({ received: true });
});

export default router;
