-- DropForeignKey
ALTER TABLE "CodingQuestion" DROP CONSTRAINT "CodingQuestion_testId_fkey";

-- DropForeignKey
ALTER TABLE "Mcq" DROP CONSTRAINT "Mcq_testId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_testId_fkey";

-- AlterTable
-- Set `testId` to NOT NULL after ensuring there are no NULL values in existing rows
UPDATE "CodingQuestion" SET "testId" = 'default_test_slot_id' WHERE "testId" IS NULL;
ALTER TABLE "CodingQuestion" ALTER COLUMN "testId" SET NOT NULL;

-- AlterTable
-- Set `testId` to NOT NULL after ensuring there are no NULL values in existing rows
UPDATE "Mcq" SET "testId" = 'default_test_slot_id' WHERE "testId" IS NULL;
ALTER TABLE "Mcq" ALTER COLUMN "testId" SET NOT NULL;

-- AlterTable
-- Add the `year` column with a default value to avoid errors on existing rows
ALTER TABLE "Test" ADD COLUMN "year" INTEGER DEFAULT 1;

-- Update existing rows with a suitable value for `year` before making the column NOT NULL
UPDATE "Test" SET "year" = 1 WHERE "year" IS NULL;

-- Now enforce the NOT NULL constraint and remove the default value for `year`
ALTER TABLE "Test" ALTER COLUMN "year" SET NOT NULL;
ALTER TABLE "Test" ALTER COLUMN "year" DROP DEFAULT;

-- Drop columns after ensuring data migration or backups
ALTER TABLE "Test" DROP COLUMN "endTime",
DROP COLUMN "noOfCodingQues",
DROP COLUMN "noOfMcqs",
DROP COLUMN "timeSlot",
DROP COLUMN "totalMarks",
DROP COLUMN "usersAllowed",
DROP COLUMN "usersFilled";

-- AlterTable
-- Adjust `User` table and add new columns with a default value to avoid NULL issues
ALTER TABLE "User" ADD COLUMN "testSlotId" TEXT,
ADD COLUMN "year" INTEGER NOT NULL DEFAULT 1;

-- Drop columns safely after ensuring no dependency on the data
ALTER TABLE "User" DROP COLUMN "testId",
DROP COLUMN "testSlot";

-- Create the new `TestSlot` table
CREATE TABLE "TestSlot" (
    "id" TEXT NOT NULL,
    "timeSlot" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "testId" TEXT NOT NULL,
    "usersAllowed" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "usersFilled" INTEGER NOT NULL DEFAULT 0,
    "noOfMcqs" INTEGER NOT NULL DEFAULT 0,
    "noOfCodingQues" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TestSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_testSlotId_fkey" FOREIGN KEY ("testSlotId") REFERENCES "TestSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mcq" ADD CONSTRAINT "Mcq_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodingQuestion" ADD CONSTRAINT "CodingQuestion_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSlot" ADD CONSTRAINT "TestSlot_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
