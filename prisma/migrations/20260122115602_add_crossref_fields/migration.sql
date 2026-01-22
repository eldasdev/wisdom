-- CreateEnum
CREATE TYPE "CrossrefStatus" AS ENUM ('PENDING', 'REGISTERED', 'FAILED');

-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "orcid" TEXT;

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "crossrefDepositId" TEXT,
ADD COLUMN     "crossrefStatus" "CrossrefStatus";
