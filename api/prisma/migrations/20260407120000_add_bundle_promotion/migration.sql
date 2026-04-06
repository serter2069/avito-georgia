-- Add bundle value to PromotionType enum
-- NOTE: ALTER TYPE ADD VALUE cannot run inside a transaction block in PostgreSQL
ALTER TYPE "PromotionType" ADD VALUE IF NOT EXISTS 'bundle';
