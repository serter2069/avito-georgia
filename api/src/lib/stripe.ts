import Stripe from 'stripe';

// Shared lazy Stripe initialization — avoids crash on startup if key is missing.
// Used by both promotions.ts and stripe-webhook.ts.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
    _stripe = new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
  }
  return _stripe;
}
