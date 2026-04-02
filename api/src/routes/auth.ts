import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { sendOtpEmail } from '../lib/mail';
import { requireAuth } from '../middleware/auth';

const router = Router();

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

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400).json({ error: 'Email and code required' });
    return;
  }

  const otpRecord = await prisma.otpCode.findFirst({
    where: { email, code, used: false },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    res.status(400).json({ error: 'Invalid or expired OTP' });
    return;
  }

  // Mark OTP as used
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  const tokens = signTokens(user.id, user.email, user.role);
  res.json({ ...tokens, user: { id: user.id, email: user.email, role: user.role } });
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
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
    // Verify user still exists
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    // Return new token pair (access + refresh rotation)
    const tokens = signTokens(user.id, user.email, user.role);
    res.json(tokens);
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// GET /api/auth/me — return current user from JWT
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true, createdAt: true },
  });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json({ user });
});

export default router;
