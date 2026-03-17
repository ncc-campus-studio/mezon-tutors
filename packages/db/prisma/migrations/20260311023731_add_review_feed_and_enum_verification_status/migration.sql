/*
  Warnings:

  - Changed the type of `verification_status` on the `tutor_profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER COLUMN "subject" SET DEFAULT '',
DROP COLUMN "verification_status",
ADD COLUMN     "verification_status" "VerificationStatus" NOT NULL;
