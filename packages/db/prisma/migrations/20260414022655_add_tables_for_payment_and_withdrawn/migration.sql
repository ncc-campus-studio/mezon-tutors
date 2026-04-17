/*
  Warnings:

  - You are about to drop the column `price_at_booking` on the `trial_lesson_booking` table. All the data in the column will be lost.
  - You are about to alter the column `price_per_hour` on the `tutor_profiles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `BigInt`.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idempotency_key]` on the table `trial_lesson_booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payos_order_code]` on the table `trial_lesson_booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gross_amount` to the `trial_lesson_booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_fee` to the `trial_lesson_booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutor_amount` to the `trial_lesson_booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EWalletTransactionType" AS ENUM ('BOOKING_PAYMENT', 'RELEASE', 'WITHDRAWAL', 'REFUND', 'PLATFORM_FEE');

-- CreateEnum
CREATE TYPE "EWalletTransactionDirection" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "EWithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_student_id_fkey";

-- AlterTable
ALTER TABLE "trial_lesson_booking" DROP COLUMN "price_at_booking",
ADD COLUMN     "failed_at" TIMESTAMP(3),
ADD COLUMN     "gross_amount" BIGINT NOT NULL,
ADD COLUMN     "idempotency_key" TEXT,
ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "payment_status" "EPaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "payos_order_code" VARCHAR(50),
ADD COLUMN     "payos_payment_link" TEXT,
ADD COLUMN     "platform_fee" BIGINT NOT NULL,
ADD COLUMN     "refunded_at" TIMESTAMP(3),
ADD COLUMN     "tutor_amount" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "tutor_profiles" ALTER COLUMN "price_per_hour" SET DATA TYPE BIGINT;

-- DropTable
DROP TABLE "payments";

-- DropEnum
DROP TYPE "EPaymentReferenceType";

-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "pendingBalance" BIGINT NOT NULL DEFAULT 0,
    "totalEarned" BIGINT NOT NULL DEFAULT 0,
    "totalWithdrawn" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "wallet_id" UUID NOT NULL,
    "booking_id" UUID,
    "withdrawal_id" UUID,
    "type" "EWalletTransactionType" NOT NULL,
    "amount" BIGINT NOT NULL,
    "direction" "EWalletTransactionDirection" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tutor_id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "amount" BIGINT NOT NULL,
    "bank_name" VARCHAR(100) NOT NULL,
    "bank_account_number" VARCHAR(50) NOT NULL,
    "bank_account_name" VARCHAR(255) NOT NULL,
    "status" "EWithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "admin_note" TEXT,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_code" VARCHAR(50) NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "raw_payload" JSONB NOT NULL,
    "is_processed" BOOLEAN NOT NULL DEFAULT false,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "transactions_wallet_id_created_at_idx" ON "transactions"("wallet_id", "created_at");

-- CreateIndex
CREATE INDEX "transactions_booking_id_idx" ON "transactions"("booking_id");

-- CreateIndex
CREATE INDEX "transactions_withdrawal_id_idx" ON "transactions"("withdrawal_id");

-- CreateIndex
CREATE INDEX "withdrawals_tutor_id_status_idx" ON "withdrawals"("tutor_id", "status");

-- CreateIndex
CREATE INDEX "withdrawals_wallet_id_idx" ON "withdrawals"("wallet_id");

-- CreateIndex
CREATE INDEX "webhook_logs_order_code_is_processed_idx" ON "webhook_logs"("order_code", "is_processed");

-- CreateIndex
CREATE UNIQUE INDEX "trial_lesson_booking_idempotency_key_key" ON "trial_lesson_booking"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "trial_lesson_booking_payos_order_code_key" ON "trial_lesson_booking"("payos_order_code");

-- CreateIndex
CREATE INDEX "trial_lesson_booking_payos_order_code_idx" ON "trial_lesson_booking"("payos_order_code");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "trial_lesson_booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_withdrawal_id_fkey" FOREIGN KEY ("withdrawal_id") REFERENCES "withdrawals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
