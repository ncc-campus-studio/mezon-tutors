/*
  Warnings:

  - You are about to drop the `lessons` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ETrialLessonStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EDayOfWeek" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- CreateEnum
CREATE TYPE "EPaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "EPaymentReferenceType" AS ENUM ('TRIAL_LESSON', 'SUBSCRIPTION');

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_student_id_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_tutor_id_fkey";

-- AlterTable
ALTER TABLE "professional_documents" ALTER COLUMN "year_of_complete" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "lessons";

-- DropEnum
DROP TYPE "LessonCategory";

-- DropEnum
DROP TYPE "LessonStatus";

-- CreateTable
CREATE TABLE "trial_lesson_booking" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tutor_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "status" "ETrialLessonStatus" NOT NULL DEFAULT 'PENDING',
    "price_at_booking" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trial_lesson_booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "EPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT NOT NULL,
    "reference_type" "EPaymentReferenceType" NOT NULL,
    "reference_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "idempotency_key" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trial_lesson_booking_tutor_id_idx" ON "trial_lesson_booking"("tutor_id");

-- CreateIndex
CREATE INDEX "trial_lesson_booking_student_id_idx" ON "trial_lesson_booking"("student_id");

-- CreateIndex
CREATE INDEX "trial_lesson_booking_tutor_id_start_at_idx" ON "trial_lesson_booking"("tutor_id", "start_at");

-- CreateIndex
CREATE INDEX "payments_student_id_idx" ON "payments"("student_id");

-- CreateIndex
CREATE INDEX "payments_reference_type_reference_id_idx" ON "payments"("reference_type", "reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "trial_lesson_booking" ADD CONSTRAINT "trial_lesson_booking_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trial_lesson_booking" ADD CONSTRAINT "trial_lesson_booking_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
