-- CreateIndex
CREATE UNIQUE INDEX "Report_reporterId_listingId_key" ON "Report"("reporterId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reporterId_targetUserId_key" ON "Report"("reporterId", "targetUserId");
