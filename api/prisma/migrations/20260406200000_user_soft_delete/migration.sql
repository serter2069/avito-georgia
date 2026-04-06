-- Add soft-delete support to User (GDPR right to erasure)
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Index for fast cron lookups (find users to hard-delete after 30 days)
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
