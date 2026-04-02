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
};

// POST /api/stripe-webhook — receives raw body (express.raw applied in index.ts)
router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body, // must be raw Buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
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

        // Create promotion
        const days = DAYS_MAP[type];
        if (listingId && days != null) {
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

        // Create unlimited_sub promotion (no expiry — managed by subscription)
        await prisma.promotion.create({
          data: {
            userId,
            listingId: '', // Not listing-specific
            promotionType: 'unlimited_sub',
            isActive: true,
            expiresAt: null,
          },
        });
        console.log(`[stripe-webhook] Created unlimited_sub for user ${userId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        // Subscription canceled — deactivate unlimited_sub
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        // Find user by Stripe customer — for now, log it
        console.log(`[stripe-webhook] Subscription deleted for customer ${customerId}`);
        // TODO: map Stripe customer to userId and deactivate promotion
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
