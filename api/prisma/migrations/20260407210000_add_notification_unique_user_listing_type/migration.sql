-- UC-40: Dedup guard for expiry reminder notifications
-- Remove duplicate (userId, listingId, type) rows before adding unique index.
-- Keep the row with the smallest id (earliest created).
DELETE FROM "Notification" a
USING "Notification" b
WHERE a.id > b.id
  AND a."userId" = b."userId"
  AND a."listingId" = b."listingId"
  AND a."type" = b."type";

-- CreateIndex: one notification per user + listing + type
CREATE UNIQUE INDEX "Notification_userId_listingId_type_key" ON "Notification"("userId", "listingId", "type");
