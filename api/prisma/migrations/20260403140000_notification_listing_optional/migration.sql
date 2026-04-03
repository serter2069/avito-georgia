-- AlterTable: make listingId nullable in Notification
ALTER TABLE "Notification" ALTER COLUMN "listingId" DROP NOT NULL;
