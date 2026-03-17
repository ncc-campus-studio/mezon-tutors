-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('TRIAL', 'REGULAR');

-- CreateEnum
CREATE TYPE "LessonPaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- AlterTable
ALTER TABLE "professional_documents" ALTER COLUMN "year_of_complete" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tutor_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "start_at" TIMESTAMPTZ NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "status" "LessonStatus" NOT NULL,
    "type" "LessonType" NOT NULL,
    "meeting_link" TEXT,
    "original_price" DECIMAL(10,2) NOT NULL,
    "discount_amount" DECIMAL(10,2) NOT NULL,
    "wallet_used" DECIMAL(10,2) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "platform_fee" DECIMAL(10,2) NOT NULL,
    "final_payout" DECIMAL(10,2) NOT NULL,
    "promo_code_id" TEXT,
    "plan_id" TEXT,
    "payment_status" "LessonPaymentStatus" NOT NULL,
    "canceled_at" TIMESTAMP(3),
    "cancel_reason" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_performance_metrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lesson_id" UUID NOT NULL,
    "reassurance" DOUBLE PRECISION NOT NULL,
    "clarity" DOUBLE PRECISION NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL,
    "preparation" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "lesson_performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_performance_metrics_lesson_id_key" ON "lesson_performance_metrics"("lesson_id");

-- AddForeignKey
ALTER TABLE "lesson_performance_metrics" ADD CONSTRAINT "lesson_performance_metrics_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
