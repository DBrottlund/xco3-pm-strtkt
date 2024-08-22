-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_requestId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_requestId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
