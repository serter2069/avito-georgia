-- UC-17 fix: NEW_MESSAGE in-app notifications were blocked by the global unique index.
-- The old index @@unique([userId, listingId, type]) prevented stacking multiple
-- NEW_MESSAGE records (e.g. second message in same thread = unique violation, silently swallowed).
--
-- Solution: replace the global unique index with a partial unique index that
-- excludes message-type notifications (which must stack for badge counters).

-- Drop old full unique index
DROP INDEX IF EXISTS "Notification_userId_listingId_type_key";

-- Re-create as partial unique index: only for non-message notification types
-- This preserves UC-40 dedup for EXPIRY_REMINDER while allowing NEW_MESSAGE to stack.
CREATE UNIQUE INDEX "Notification_userId_listingId_type_dedup"
  ON "Notification"("userId", "listingId", "type")
  WHERE "type" NOT IN ('NEW_MESSAGE', 'NEW_MESSAGE_EMAIL_SENT');
