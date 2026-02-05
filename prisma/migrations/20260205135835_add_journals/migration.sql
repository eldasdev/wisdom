-- CreateEnum
CREATE TYPE "JournalStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "journalId" TEXT;

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "issn" TEXT,
    "eissn" TEXT,
    "publisher" TEXT,
    "frequency" TEXT,
    "language" TEXT,
    "openAccess" BOOLEAN NOT NULL DEFAULT false,
    "impactFactor" TEXT,
    "coverImage" TEXT,
    "website" TEXT,
    "submissionGuidelines" TEXT,
    "scope" TEXT,
    "indexedIn" TEXT,
    "status" "JournalStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Journal_slug_key" ON "Journal"("slug");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
