import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/cities — list all cities with their districts
router.get('/', async (_req: Request, res: Response) => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        districts: { select: { id: true, name: true }, orderBy: { name: 'asc' } },
      },
      orderBy: { name: 'asc' },
    });
    res.json(cities);
  } catch (err) {
    console.error('GET /cities error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
