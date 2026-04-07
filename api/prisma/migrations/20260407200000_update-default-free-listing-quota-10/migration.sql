-- AlterTable: update default freeListingQuota from 5 to 10 (UC-02)
ALTER TABLE "Category" ALTER COLUMN "freeListingQuota" SET DEFAULT 10;

-- Update existing rows that still have the old default of 5
-- Rows with 0 are intentionally zero (subcategories inheriting from parent) — leave them
UPDATE "Category" SET "freeListingQuota" = 10 WHERE "freeListingQuota" = 5;
