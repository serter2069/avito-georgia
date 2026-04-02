import cron from 'node-cron';
import { prisma } from '../lib/prisma';

// Run daily at 03:00 UTC — mark expired listings as removed
// Run hourly — deactivate expired promotions
export function startCleanupCron(): void {
  // Listings cleanup: daily at 03:00 UTC
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

  // Promotions cleanup: every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await prisma.promotion.updateMany({
        where: {
          isActive: true,
          expiresAt: { not: null, lt: new Date() },
        },
        data: { isActive: false },
      });
      if (result.count > 0) {
        console.log(`[cron] promotions: deactivated ${result.count} expired promotions`);
      }
    } catch (err) {
      console.error('[cron] promotions cleanup error:', err);
    }
  });

  console.log('[cron] Listing cleanup scheduled (daily 03:00 UTC)');
  console.log('[cron] Promotion cleanup scheduled (hourly)');
}
