-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "usersFilled" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "marks" INTEGER,
ADD COLUMN     "testGiven" BOOLEAN NOT NULL DEFAULT false;
