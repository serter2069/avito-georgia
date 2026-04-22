-- CreateTable: Review — buyer reviews after listing is sold
CREATE TABLE "Review" (
  "id"        TEXT         NOT NULL,
  "listingId" TEXT         NOT NULL,
  "authorId"  TEXT         NOT NULL,
  "sellerId"  TEXT         NOT NULL,
  "rating"    INTEGER      NOT NULL,
  "text"      TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Review_pkey"              PRIMARY KEY ("id"),
  CONSTRAINT "Review_listingId_fkey"    FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Review_authorId_fkey"     FOREIGN KEY ("authorId")  REFERENCES "User"("id")    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Review_sellerId_fkey"     FOREIGN KEY ("sellerId")  REFERENCES "User"("id")    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Review_authorId_listingId_key" UNIQUE ("authorId", "listingId")
);

-- CreateIndex
CREATE INDEX "Review_sellerId_idx"  ON "Review"("sellerId");
CREATE INDEX "Review_listingId_idx" ON "Review"("listingId");
