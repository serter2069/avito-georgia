import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/categories — list all top-level categories with children
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: { select: { id: true, name: true, nameKa: true, nameRu: true, nameEn: true, slug: true, freeListingQuota: true, paidListingPrice: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    console.error('GET /categories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/categories/:id/quota?userId= — quota info for a user in a category
router.get('/:id/quota', requireAuth, async (req: Request, res: Response) => {
  try {
    const categoryId = String(req.params.id);
    const userId = req.user!.userId;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { parent: { select: { freeListingQuota: true, paidListingPrice: true } } },
    });
    if (!category) { res.status(404).json({ error: 'Category not found' }); return; }

    // Subcategory inherits from parent if own freeListingQuota is 0
    const freeQuota = (category.freeListingQuota === 0 && category.parent)
      ? category.parent.freeListingQuota
      : category.freeListingQuota;
    const paidPrice = (category.freeListingQuota === 0 && category.parent)
      ? category.parent.paidListingPrice
      : category.paidListingPrice;

    const used = await prisma.listing.count({
      where: {
        userId,
        categoryId,
        status: { in: ['active', 'pending_moderation'] },
      },
    });

    res.json({
      used,
      freeQuota,
      remaining: Math.max(0, freeQuota - used),
      paidPrice,
    });
  } catch (err) {
    console.error('GET /categories/:id/quota error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/categories/:id — single category with children
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: String(req.params.id) },
      include: { children: true },
    });
    if (!category) { res.status(404).json({ error: 'Category not found' }); return; }
    res.json(category);
  } catch (err) {
    console.error('GET /categories/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
