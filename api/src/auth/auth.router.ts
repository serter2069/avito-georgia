import { Router, Request, Response, NextFunction } from 'express';
import { requestOtp, verifyOtp, refreshTokens } from './auth.service';

const router = Router();

// POST /api/auth/request-otp
// Body: { email: string }
// Header: Accept-Language: ru|en|ka
router.post('/request-otp', async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body as { email?: string };
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email is required' });
    return;
  }
  try {
    await requestOtp(email.toLowerCase().trim(), req.headers['accept-language']);
    res.json({ message: 'OTP sent' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp
// Body: { email: string, code: string }
router.post('/verify-otp', async (req: Request, res: Response, next: NextFunction) => {
  const { email, code } = req.body as { email?: string; code?: string };
  if (!email || !code) {
    res.status(400).json({ error: 'email and code are required' });
    return;
  }
  try {
    const result = await verifyOtp(email.toLowerCase().trim(), code.trim());
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh
// Body: { refreshToken: string }
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    res.status(400).json({ error: 'refreshToken is required' });
    return;
  }
  try {
    const tokens = await refreshTokens(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
});

export default router;
