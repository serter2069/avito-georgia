import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { sendOtpEmail } from '../lib/mail';

const router = Router();

function generateOtp(): string {
  if (process.env.DEV_AUTH === 'true') return '000000';
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getLocale(req: Request): string {
  const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0]?.toLowerCase();
  return ['ru', 'en', 'ka'].includes(lang || '') ? lang! : 'ru';
}

// POST /api/auth/request-otp
router.post('/request-otp', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email required' });
    return;
  }
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Ensure user record exists
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  // Create a new OtpCode record (invalidate old ones by marking them used)
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
    res.status(401).json({ error: 'Invalid or expired code' });
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

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' } as jwt.SignOptions
  );
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d' } as jwt.SignOptions
  );

  res.json({ accessToken, refreshToken, userId: user.id });
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
      type: string;
    };
    if (payload.type !== 'refresh') {
      res.status(401).json({ error: 'Invalid token type' });
      return;
    }
    const accessToken = jwt.sign(
      { userId: payload.userId, email: payload.email, type: 'access' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' } as jwt.SignOptions
    );
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

export default router;
