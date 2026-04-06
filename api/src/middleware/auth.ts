import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // Accept token from Authorization header (native) or httpOnly cookie (web)
  const header = req.headers.authorization;
  const token: string | undefined = header?.startsWith('Bearer ')
    ? header.slice(7)
    : req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
      type: string;
    };
    if (payload.type !== 'access') {
      res.status(401).json({ error: 'Invalid token type' });
      return;
    }
    if (payload.role === 'blocked') {
      res.status(403).json({ error: 'Account suspended' });
      return;
    }

    // GDPR: check if account has been soft-deleted — must hit DB since JWT is stateless
    // Use minimal select to keep query cost low
    prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, deletedAt: true },
    }).then((user) => {
      if (!user || user.deletedAt !== null) {
        res.status(401).json({ error: 'Account deleted' });
        return;
      }
      req.user = { userId: payload.userId, email: payload.email, role: payload.role };
      next();
    }).catch(() => {
      res.status(500).json({ error: 'Internal server error' });
    });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
