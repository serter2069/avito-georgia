import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Run daily at 03:00 UTC — mark expired listings as removed
export function startCleanupCron(): void {
  cron.schedule('0 3 * * *', async () => {
    try {
      const result = await prisma.listing.updateMany({
        where: {
          status: 'active',
          expiresAt: { lt: new Date() },
        },
        data: { status: 'removed' },
      });
      console.log(`[cron] cleanup: marked ${result.count} expired listings as removed`);
    } catch (err) {
      console.error('[cron] cleanup error:', err);
    }
  });

  console.log('[cron] Listing cleanup scheduled (daily 03:00 UTC, 30-day expiry)');
}
