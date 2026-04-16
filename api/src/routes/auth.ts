import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { sendOtpEmail } from '../lib/mail';
import { requireAuth } from '../middleware/auth';

const router = Router();

const MAX_OTP_ATTEMPTS = 3;
const IS_PROD = process.env.NODE_ENV === 'production';

function generateOtp(): string {
  if (process.env.DEV_AUTH === 'true') return '000000';
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getLocale(req: Request): string {
  const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0]?.toLowerCase();
  return ['ru', 'en', 'ka'].includes(lang || '') ? lang! : 'ru';
}

function signTokens(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    { userId, email, role, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_ACCESS_EXPIRES || '15m') as string } as jwt.SignOptions
  );
  const refreshToken = jwt.sign(
    { userId, email, role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: (process.env.JWT_REFRESH_EXPIRES || '30d') as string } as jwt.SignOptions
  );
  return { accessToken, refreshToken };
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/api/auth/refresh', // Only sent to the refresh endpoint — limits XSS exposure
  });
}

// POST /api/auth/request-otp
router.post('/request-otp', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email required' });
    return;
  }

  // Rate limit: block if OTP was requested within the last 60 seconds
  const recentOtp = await prisma.otpCode.findFirst({
    where: {
      email,
      used: false,
      createdAt: { gte: new Date(Date.now() - 60_000) },
    },
  });
  if (recentOtp) {
    res.status(429).json({ error: 'Wait 60 seconds before requesting a new OTP' });
    return;
  }

  // GDPR: block OTP for soft-deleted accounts (check before upsert to avoid re-creating user)
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, deletedAt: true },
  });
  if (existingUser && existingUser.deletedAt !== null) {
    res.status(401).json({ error: 'Account deleted' });
    return;
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Ensure user record exists (upsert — first login creates user)
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  // Invalidate any previous unused OTPs for this email
  await prisma.otpCode.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  await prisma.otpCode.create({
    data: { email, code: otp, expiresAt, userId: user.id },
  });

  await sendOtpEmail(email, otp, getLocale(req));
  res.json({ ok: true });
});

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token: string): Promise<boolean> {
  const formData = new FormData();
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY!);
  formData.append('response', token);
  const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v1/siteverify', {
    method: 'POST',
    body: formData,
  });
  const cfData = await cfRes.json() as { success: boolean };
  return cfData.success === true;
}

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, code, captchaToken } = req.body;
  if (!email || !code) {
    res.status(400).json({ error: 'Email and code required' });
    return;
  }

  // Find latest unused, unexpired OTP for this email (do NOT filter by code yet — need to track attempts)
  const otpRecord = await prisma.otpCode.findFirst({
    where: { email, used: false, expiresAt: { gte: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    res.status(400).json({ error: 'Invalid or expired OTP' });
    return;
  }

  // Brute-force protection: after MAX_OTP_ATTEMPTS wrong codes require CAPTCHA
  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    // If CAPTCHA not provided, ask frontend to show it
    if (!captchaToken) {
      res.status(400).json({ error: 'CAPTCHA required', captchaRequired: true });
      return;
    }
    // Verify CAPTCHA token
    const captchaOk = await verifyTurnstile(captchaToken);
    if (!captchaOk) {
      res.status(400).json({ error: 'CAPTCHA verification failed', captchaRequired: true });
      return;
    }
  }

  // Wrong code: increment attempts counter
  if (otpRecord.code !== code) {
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });
    const newAttempts = otpRecord.attempts + 1;
    const attemptsLeft = Math.max(0, MAX_OTP_ATTEMPTS - newAttempts);
    // After this wrong attempt hits MAX_OTP_ATTEMPTS, tell frontend CAPTCHA is needed next time
    const captchaRequired = newAttempts >= MAX_OTP_ATTEMPTS;
    res.status(400).json({ error: 'Invalid code', attemptsLeft, captchaRequired });
    return;
  }

  // Correct code: mark as used
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  // GDPR: soft-deleted accounts cannot obtain new tokens
  if (user.deletedAt !== null) {
    res.status(401).json({ error: 'Account deleted' });
    return;
  }

  // Security: blocked accounts cannot obtain new tokens
  if (user.role === 'blocked') {
    res.status(403).json({ error: 'Account suspended' });
    return;
  }

  const tokens = signTokens(user.id, user.email, user.role);

  // Persist session in DB for sliding window refresh and server-side revocation
  const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: { userId: user.id, refreshToken: tokens.refreshToken, expiresAt: sessionExpiresAt },
  });

  // Set httpOnly cookies for web clients
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  // Also return tokens in body — native clients (iOS/Android) read from here
  res.json({ ...tokens, user: { id: user.id, email: user.email, role: user.role, isOnboarded: user.isOnboarded } });
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  // Accept from httpOnly cookie (web) or request body (native)
  const refreshToken: string | undefined = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    res.status(400).json({ error: 'refreshToken required' });
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
      email: string;
      role: string;
      type: string;
    };
    if (payload.type !== 'refresh') {
      res.status(401).json({ error: 'Invalid token type' });
      return;
    }

    // Validate session exists in DB and is not expired (enables server-side revocation)
    const session = await prisma.session.findUnique({ where: { refreshToken } });
    if (!session || session.expiresAt < new Date()) {
      res.status(401).json({ error: 'Session expired or revoked' });
      return;
    }

    // Verify user still exists and hasn't been soft-deleted
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    if (user.deletedAt !== null) {
      res.status(401).json({ error: 'Account deleted' });
      return;
    }
    if (user.role === 'blocked') {
      res.status(403).json({ error: 'Account suspended' });
      return;
    }

    // Issue new token pair (token rotation)
    const tokens = signTokens(user.id, user.email, user.role);

    // Sliding window: update session with new refreshToken and extended expiresAt
    const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken, expiresAt: newExpiresAt },
    });

    // Refresh httpOnly cookies for web
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    // Return tokens in body for native clients
    res.json(tokens);
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response) => {
  // Accept from httpOnly cookie (web) or request body (native)
  const refreshToken: string | undefined = req.cookies?.refreshToken || req.body?.refreshToken;

  if (refreshToken) {
    // Delete session — refresh token is now revoked server-side
    await prisma.session.deleteMany({ where: { refreshToken } });
  }

  // Clear httpOnly cookies for web clients
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

  res.json({ ok: true });
});

// GET /api/auth/me — return current authenticated user
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, name: true, phone: true, city: true, avatarUrl: true, role: true, locale: true, isOnboarded: true, createdAt: true },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err) {
    console.error('GET /auth/me error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
