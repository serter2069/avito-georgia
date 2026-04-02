import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired access token' });
  }
}
