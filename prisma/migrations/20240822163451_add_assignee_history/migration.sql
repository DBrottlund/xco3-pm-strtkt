-- CreateTable
CREATE TABLE "_AssigneeHistory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AssigneeHistory_AB_unique" ON "_AssigneeHistory"("A", "B");

-- CreateIndex
CREATE INDEX "_AssigneeHistory_B_index" ON "_AssigneeHistory"("B");

-- AddForeignKey
ALTER TABLE "_AssigneeHistory" ADD CONSTRAINT "_AssigneeHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssigneeHistory" ADD CONSTRAINT "_AssigneeHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
