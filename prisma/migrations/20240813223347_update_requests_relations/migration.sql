-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PM', 'PA', 'ASSIGNEE');

-- CreateEnum
CREATE TYPE "TimeUnit" AS ENUM ('HOUR', 'DAY', 'WEEK');

-- CreateEnum
CREATE TYPE "ProductTag" AS ENUM ('ONBOARDING', 'ANALYST', 'PIPELINE', 'DOCS', 'VAULT', 'COMPLIANCE', 'BACKOFFICE_SETTINGS', 'BACKOFFICE');

-- CreateEnum
CREATE TYPE "InitiativeTag" AS ENUM ('API', 'CYBERSECURITY', 'BACKOFFICE', 'UI', 'UX', 'DOCUMENT_AUTOMATION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "lastLogin" TIMESTAMP(3),
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "requestIntro" TEXT,
    "requestOutro" TEXT,
    "requestOriginal" TEXT,
    "requestAIProcessed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "percentComplete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dueAfterTimeId" TEXT NOT NULL,
    "turnaroundTimeId" TEXT NOT NULL,
    "completedTasks" TEXT[],
    "assigneeId" TEXT,
    "assignedById" TEXT,
    "createdById" TEXT,
    "productTags" "ProductTag"[],
    "initiativesTags" "InitiativeTag"[],

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeFrame" (
    "id" TEXT NOT NULL,
    "timeUnit" "TimeUnit" NOT NULL,
    "timeNumber" INTEGER NOT NULL,

    CONSTRAINT "TimeFrame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskText" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requestId" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Request_dueAfterTimeId_key" ON "Request"("dueAfterTimeId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_turnaroundTimeId_key" ON "Request"("turnaroundTimeId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_dueAfterTimeId_fkey" FOREIGN KEY ("dueAfterTimeId") REFERENCES "TimeFrame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_turnaroundTimeId_fkey" FOREIGN KEY ("turnaroundTimeId") REFERENCES "TimeFrame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
