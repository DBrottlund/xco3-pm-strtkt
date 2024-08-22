/*
  Warnings:

  - You are about to drop the `_AssigneeHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AssigneeHistory" DROP CONSTRAINT "_AssigneeHistory_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssigneeHistory" DROP CONSTRAINT "_AssigneeHistory_B_fkey";

-- DropTable
DROP TABLE "_AssigneeHistory";

-- CreateTable
CREATE TABLE "AssigneeHistoryEntry" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "AssigneeHistoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssigneeHistoryEntry_requestId_position_key" ON "AssigneeHistoryEntry"("requestId", "position");

-- AddForeignKey
ALTER TABLE "AssigneeHistoryEntry" ADD CONSTRAINT "AssigneeHistoryEntry_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigneeHistoryEntry" ADD CONSTRAINT "AssigneeHistoryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
