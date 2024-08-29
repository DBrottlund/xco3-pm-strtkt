/*
  Warnings:

  - A unique constraint covering the columns `[requestId,position]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "position" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Task_requestId_position_key" ON "Task"("requestId", "position");
