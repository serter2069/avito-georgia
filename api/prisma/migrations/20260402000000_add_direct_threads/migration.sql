-- AlterTable: make listingId optional on Thread
ALTER TABLE "Thread" ALTER COLUMN "listingId" DROP NOT NULL;

-- AlterTable: add participant1Id and participant2Id for direct threads
ALTER TABLE "Thread" ADD COLUMN "participant1Id" TEXT;
ALTER TABLE "Thread" ADD COLUMN "participant2Id" TEXT;

-- CreateIndex: unique constraint for direct threads
CREATE UNIQUE INDEX "Thread_participant1Id_participant2Id_key" ON "Thread"("participant1Id", "participant2Id");
