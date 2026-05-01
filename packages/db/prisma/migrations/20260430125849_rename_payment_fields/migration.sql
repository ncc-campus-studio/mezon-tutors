/*
  Warnings:

  - You are about to drop the column `payos_order_code` on the `trial_lesson_booking` table. All the data in the column will be lost.
  - You are about to drop the column `payos_payment_link` on the `trial_lesson_booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_ref]` on the table `trial_lesson_booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "trial_lesson_booking_payos_order_code_idx";

-- DropIndex
DROP INDEX "trial_lesson_booking_payos_order_code_key";

-- AlterTable
ALTER TABLE "trial_lesson_booking" DROP COLUMN "payos_order_code",
DROP COLUMN "payos_payment_link",
ADD COLUMN     "payment_ref" VARCHAR(50),
ADD COLUMN     "payment_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "trial_lesson_booking_payment_ref_key" ON "trial_lesson_booking"("payment_ref");

-- CreateIndex
CREATE INDEX "trial_lesson_booking_payment_ref_idx" ON "trial_lesson_booking"("payment_ref");
