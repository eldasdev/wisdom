-- CreateTable
CREATE TABLE "EditorialBoardMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" TEXT,
    "department" TEXT,
    "bio" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditorialBoardMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EditorialBoardMember_userId_key" ON "EditorialBoardMember"("userId");

-- AddForeignKey
ALTER TABLE "EditorialBoardMember" ADD CONSTRAINT "EditorialBoardMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
