/*
  Warnings:

  - Made the column `marks` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "marks" SET NOT NULL,
ALTER COLUMN "marks" SET DEFAULT 0;
