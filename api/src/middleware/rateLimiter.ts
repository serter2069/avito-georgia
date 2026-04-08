import rateLimit, { Store } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Request } from 'express';
import { redis } from '../lib/redis';

// Build a RedisStore with the given prefix, using the existing ioredis singleton.
// Falls back to undefined (MemoryStore) if Redis is unavailable — safe for local dev.
function makeStore(prefix: string): Store | undefined {
  try {
    // Only use Redis store if client is ready (connected to Valkey)
    if (redis.status !== 'ready') {
      console.warn(`[RateLimit] Redis not ready (${redis.status}), using in-memory store for ${prefix}`);
      return undefined;
    }
    return new RedisStore({
      prefix,
      sendCommand: (...args: string[]) => (redis as any).call(...args),
    });
  } catch (err) {
    console.warn('[RateLimit] Redis store init failed, falling back to in-memory:', err);
    return undefined;
  }
}

// Real TCP socket IP — not spoofable via X-Forwarded-For header
function socketIp(req: Request): string {
  return req.socket.remoteAddress || 'unknown';
}

// Helper: extract user ID from authenticated request, fallback to real socket IP
function userOrIp(req: Request): string {
  return (req as any).user?.userId || socketIp(req);
}

// OTP request: 3 per minute per email+IP combo
// Using socketIp (not req.ip) prevents X-Forwarded-For spoofing bypass
export const otpRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  store: makeStore('rl:otp-req:'),
  keyGenerator: (req: Request) => {
    const email = req.body?.email || '';
    const ip = socketIp(req);
    return `${ip}:${email}`;
  },
  message: { error: 'Too many OTP requests. Try again in 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP verify: 10 per 15 minutes per real socket IP (brute-force protection)
// Using socketIp prevents X-Forwarded-For spoofing bypass
export const otpVerifyRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  store: makeStore('rl:otp-ver:'),
  keyGenerator: socketIp,
  message: { error: 'Too many verification attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Listing creation: 5 per hour per user
export const listingCreateRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  store: makeStore('rl:listing-create:'),
  keyGenerator: userOrIp,
  message: { error: 'Too many listings created. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat messages: 60 per minute per user
export const chatMessageRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  store: makeStore('rl:chat-msg:'),
  keyGenerator: userOrIp,
  message: { error: 'Too many messages. Slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search / listing list: 100 per minute per IP
export const searchRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  store: makeStore('rl:search:'),
  message: { error: 'Too many search requests. Try again in a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Phone reveal: 20 per hour per user
export const phoneRevealRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  store: makeStore('rl:phone-reveal:'),
  keyGenerator: userOrIp,
  message: { error: 'Phone number reveal limit reached. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Report creation: 10 per hour per user
export const reportCreateRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  store: makeStore('rl:report-create:'),
  keyGenerator: userOrIp,
  message: { error: 'Too many reports submitted. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
