-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "otpAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "otpLastAttemptAt" TIMESTAMP(3),
ADD COLUMN     "otpRateLimitResetAt" TIMESTAMP(3);
