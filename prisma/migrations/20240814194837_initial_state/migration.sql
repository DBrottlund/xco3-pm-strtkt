/*
  Warnings:

  - Added the required column `status` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Request', 'Viewed', 'Assigned', 'PastDue', 'Merged', 'Completed');

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "status" "Status" NOT NULL;
