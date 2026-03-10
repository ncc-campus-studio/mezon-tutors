/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[tutor_id,day_of_week,start_time,end_time]` on the table `tutor_availability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tutor_id,language_code]` on the table `tutor_language` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TUTOR', 'ADMIN');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';

-- CreateIndex
CREATE UNIQUE INDEX "tutor_availability_tutor_id_day_of_week_start_time_end_time_key" ON "tutor_availability"("tutor_id", "day_of_week", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_language_tutor_id_language_code_key" ON "tutor_language"("tutor_id", "language_code");
