-- AlterTable: add activatedAt column (nullable, no default — existing listings keep NULL)
ALTER TABLE "Listing" ADD COLUMN "activatedAt" TIMESTAMP(3);

-- Backfill: set activatedAt for existing active listings based on createdAt
UPDATE "Listing" SET "activatedAt" = "createdAt" WHERE "status" = 'active' AND "activatedAt" IS NULL;
