-- Add new listing status values
ALTER TYPE "ListingStatus" ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE "ListingStatus" ADD VALUE IF NOT EXISTS 'pending_moderation';
ALTER TYPE "ListingStatus" ADD VALUE IF NOT EXISTS 'rejected';
ALTER TYPE "ListingStatus" ADD VALUE IF NOT EXISTS 'expired';
