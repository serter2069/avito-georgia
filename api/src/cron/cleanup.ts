import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { sendExpiryReminderEmail } from '../lib/mail';

// Run daily at 03:00 UTC — mark expired listings with 'expired' status
// Run daily at 09:00 UTC — send expiry reminder emails (3 days before expiry)
// Run hourly — deactivate expired promotions
export function startCleanupCron(): void {
  // Listings expiry: daily at 03:00 UTC — active listings past expiresAt → expired
  cron.schedule('0 3 * * *', async () => {
    try {
      const result = await prisma.listing.updateMany({
        where: {
          status: 'active',
          expiresAt: { lt: new Date() },
        },
        data: { status: 'expired' },
      });
      console.log(`[cron] cleanup: marked ${result.count} expired listings as expired`);
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
          // UC-40: upsert is idempotent — concurrent cron runs or retries won't
          // create a duplicate row thanks to @@unique([userId, listingId, type]).
          // `created` flag tells us whether this is a new reminder or a no-op.
          const { created } = await prisma.notification.upsert({
            where: {
              userId_listingId_type: {
                userId: listing.userId,
                listingId: listing.id,
                type: 'EXPIRY_REMINDER',
              },
            },
            update: {},
            create: {
              userId: listing.userId,
              listingId: listing.id,
              type: 'EXPIRY_REMINDER',
              payload: { expiresAt: listing.expiresAt.toISOString() },
            },
            select: { id: true, createdAt: true },
          }).then(async (record) => {
            // Determine if row was just created: createdAt within the last 5 seconds
            const justCreated = Date.now() - record.createdAt.getTime() < 5000;
            return { created: justCreated };
          });

          if (!created) {
            // Reminder already recorded (duplicate cron run) — skip email
            console.log(`[cron] expiry-reminder: skipped duplicate for listing ${listing.id}`);
            continue;
          }

          // Check notification preference — absence of row means enabled by default
          const expiryPref = await prisma.notificationPref.findUnique({
            where: { userId_type: { userId: listing.userId, type: 'moderation_update' } },
          });
          if (!expiryPref || expiryPref.enabled) {
            await sendExpiryReminderEmail(
              listing.user.email,
              listing.title,
              listing.id,
              listing.expiresAt
            );
          }
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

  // GDPR hard-delete: daily at 04:00 UTC — permanently delete users soft-deleted 30+ days ago
  // Cascade order (FK-safe): Message → ThreadParticipant → Thread (orphaned) →
  //   Notification → Favorite → Promotion → Payment → Report → OtpCode → Session →
  //   ListingPhoto → Listing → User
  cron.schedule('0 4 * * *', async () => {
    try {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const users = await prisma.user.findMany({
        where: { deletedAt: { not: null, lt: cutoff } },
        select: { id: true },
      });

      if (users.length === 0) return;

      const userIds = users.map((u) => u.id);
      console.log(`[cron] gdpr-purge: hard-deleting ${userIds.length} user(s)`);

      for (const userId of userIds) {
        try {
          // 1. Messages sent by this user
          await prisma.message.deleteMany({ where: { senderId: userId } });

          // 2. Thread participations — also removes any orphaned threads below
          await prisma.threadParticipant.deleteMany({ where: { userId } });

          // 3. Orphaned threads: threads with no remaining participants
          await prisma.thread.deleteMany({
            where: { participants: { none: {} } },
          });

          // 4. Notifications
          await prisma.notification.deleteMany({ where: { userId } });

          // 5. Favorites
          await prisma.favorite.deleteMany({ where: { userId } });

          // 6. Promotions
          await prisma.promotion.deleteMany({ where: { userId } });

          // 7. Payments
          await prisma.payment.deleteMany({ where: { userId } });

          // 8. Reports (both as reporter and as reported target)
          await prisma.report.deleteMany({
            where: { OR: [{ reporterId: userId }, { targetUserId: userId }] },
          });

          // 9. OTP codes
          await prisma.otpCode.deleteMany({ where: { userId } });

          // 10. Sessions
          await prisma.session.deleteMany({ where: { userId } });

          // 11. Listing photos (child of Listing)
          const listingIds = await prisma.listing.findMany({
            where: { userId },
            select: { id: true },
          });
          if (listingIds.length > 0) {
            const ids = listingIds.map((l) => l.id);
            await prisma.listingPhoto.deleteMany({ where: { listingId: { in: ids } } });
            // Also clean up listing-related data referencing these listings
            await prisma.favorite.deleteMany({ where: { listingId: { in: ids } } });
            await prisma.notification.deleteMany({ where: { listingId: { in: ids } } });
            await prisma.promotion.deleteMany({ where: { listingId: { in: ids } } });
            await prisma.report.deleteMany({ where: { listingId: { in: ids } } });
            // Threads referencing deleted listings
            await prisma.message.deleteMany({ where: { thread: { listingId: { in: ids } } } });
            await prisma.threadParticipant.deleteMany({ where: { thread: { listingId: { in: ids } } } });
            await prisma.thread.deleteMany({ where: { listingId: { in: ids } } });
          }

          // 12. Listings
          await prisma.listing.deleteMany({ where: { userId } });

          // 13. User record
          await prisma.user.delete({ where: { id: userId } });

          console.log(`[cron] gdpr-purge: deleted user ${userId}`);
        } catch (err) {
          console.error(`[cron] gdpr-purge: failed to delete user ${userId}:`, err);
        }
      }
    } catch (err) {
      console.error('[cron] gdpr-purge error:', err);
    }
  });

  console.log('[cron] Listing expiry scheduled (daily 03:00 UTC)');
  console.log('[cron] Expiry reminder scheduled (daily 09:00 UTC)');
  console.log('[cron] Promotion cleanup scheduled (hourly)');
  console.log('[cron] GDPR hard-delete scheduled (daily 04:00 UTC)');
}
