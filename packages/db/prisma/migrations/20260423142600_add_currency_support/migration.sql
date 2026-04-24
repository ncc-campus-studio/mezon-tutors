-- CreateEnum
CREATE TYPE "ECurrency" AS ENUM ('USD', 'VND', 'PHP');

-- AlterTable
ALTER TABLE "tutor_profiles" ADD COLUMN "currency" "ECurrency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "trial_lesson_booking" ADD COLUMN "currency" "ECurrency" NOT NULL DEFAULT 'USD';
