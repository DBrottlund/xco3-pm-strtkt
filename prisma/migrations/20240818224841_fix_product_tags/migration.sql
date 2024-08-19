/*
  Warnings:

  - You are about to drop the column `initiativesTags` on the `Request` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductTag" ADD VALUE 'API';
ALTER TYPE "ProductTag" ADD VALUE 'CYBERSECURITY';
ALTER TYPE "ProductTag" ADD VALUE 'UI';
ALTER TYPE "ProductTag" ADD VALUE 'UX';
ALTER TYPE "ProductTag" ADD VALUE 'DOCUMENT_AUTOMATION';

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "initiativesTags";

-- DropEnum
DROP TYPE "InitiativeTag";
