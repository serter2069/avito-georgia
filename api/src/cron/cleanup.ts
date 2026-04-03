import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { sendExpiryReminderEmail } from '../lib/mail';

// Run daily at 03:00 UTC — mark expired listings as removed
// Run daily at 09:00 UTC — send expiry reminder emails (3 days before expiry)
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

  // Expiry reminder: daily at 09:00 UTC — email owners 3 days before listing expires
  cron.schedule('0 9 * * *', async () => {
    try {
      const now = new Date();
      const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

      // Find active listings expiring in the next 3 days that haven't received a reminder yet
      const listings = await prisma.listing.findMany({
        where: {
          status: 'active',
          expiresAt: { gte: now, lte: in3Days },
          // Skip listings where owner has no email
          user: { email: { not: '' } },
          // Skip listings that already got an EXPIRY_REMINDER notification
          notifications: {
            none: { type: 'EXPIRY_REMINDER' },
          },
        },
        select: {
          id: true,
          title: true,
          expiresAt: true,
          userId: true,
          user: { select: { id: true, email: true } },
        },
      });

      let sent = 0;
      for (const listing of listings) {
        if (!listing.expiresAt) continue;
        try {
          // Record notification first (idempotency guard)
          await prisma.notification.create({
            data: {
              userId: listing.userId,
              listingId: listing.id,
              type: 'EXPIRY_REMINDER',
              payload: { expiresAt: listing.expiresAt.toISOString() },
            },
          });
          await sendExpiryReminderEmail(
            listing.user.email,
            listing.title,
            listing.id,
            listing.expiresAt
          );
          sent++;
        } catch (err) {
          console.error(`[cron] expiry reminder failed for listing ${listing.id}:`, err);
        }
      }

      if (sent > 0) {
        console.log(`[cron] expiry-reminder: sent ${sent} reminder emails`);
      }
    } catch (err) {
      console.error('[cron] expiry reminder error:', err);
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
  console.log('[cron] Expiry reminder scheduled (daily 09:00 UTC)');
  console.log('[cron] Promotion cleanup scheduled (hourly)');
}
