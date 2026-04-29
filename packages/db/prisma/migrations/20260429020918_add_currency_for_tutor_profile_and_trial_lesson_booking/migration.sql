/*
  Warnings:

  - Added the required column `currency` to the `trial_lesson_booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `tutor_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ECurrency" AS ENUM ('USD', 'VND', 'PHP');

-- AlterTable
ALTER TABLE "trial_lesson_booking" ADD COLUMN     "currency" "ECurrency" NOT NULL;

-- AlterTable
ALTER TABLE "tutor_profiles" ADD COLUMN     "currency" "ECurrency" NOT NULL;
