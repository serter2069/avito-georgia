import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// Helper: extract user ID from authenticated request, fallback to IP
function userOrIp(req: Request): string {
  return (req as any).user?.userId || req.ip || 'unknown';
}

// OTP request: 3 per minute per email
export const otpRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  keyGenerator: (req: Request) => req.body?.email || req.ip || 'unknown',
  message: { error: 'Too many OTP requests. Try again in 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP verify: 10 per 15 minutes per IP (brute-force protection)
export const otpVerifyRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many verification attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Listing creation: 5 per hour per user
export const listingCreateRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: userOrIp,
  message: { error: 'Too many listings created. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat messages: 60 per minute per user
export const chatMessageRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: userOrIp,
  message: { error: 'Too many messages. Slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search / listing list: 100 per minute per IP
export const searchRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many search requests. Try again in a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Phone reveal: 20 per hour per user
export const phoneRevealRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: userOrIp,
  message: { error: 'Phone number reveal limit reached. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
