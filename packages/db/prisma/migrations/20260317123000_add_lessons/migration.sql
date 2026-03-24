-- CreateEnum
CREATE TYPE "LessonCategory" AS ENUM ('MATH', 'SCIENCE', 'CHEMISTRY', 'OTHER');

-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('BOOKED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "tutor_id" UUID NOT NULL,
    "subject" TEXT NOT NULL,
    "category" "LessonCategory" NOT NULL DEFAULT 'OTHER',
    "status" "LessonStatus" NOT NULL DEFAULT 'BOOKED',
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lessons_student_id_starts_at_idx" ON "lessons"("student_id", "starts_at");

-- CreateIndex
CREATE INDEX "lessons_tutor_id_starts_at_idx" ON "lessons"("tutor_id", "starts_at");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
