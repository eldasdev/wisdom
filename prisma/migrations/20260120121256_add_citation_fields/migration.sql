-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "bibtex" TEXT,
ADD COLUMN     "citationCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "citationStyle" TEXT,
ADD COLUMN     "doi" TEXT;

-- CreateIndex
CREATE INDEX "Content_doi_idx" ON "Content"("doi");
