-- CreateEnum
CREATE TYPE "ProfessionalDocumentStatus" AS ENUM ('NEW', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProfessionalDocumentType" AS ENUM ('DEGREE', 'CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "IdentityVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "tutor_profiles" ADD COLUMN      "phone" TEXT NOT NULL;
ALTER TABLE "tutor_profiles" ADD COLUMN      "email" TEXT NOT NULL;
-- CreateTable
CREATE TABLE "tutor_admin_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tutor_id" UUID NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "reviewer_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_admin_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tutor_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT,
    "type" "ProfessionalDocumentType" NOT NULL,
    "status" "ProfessionalDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specialization" TEXT,
    "year_of_complete" SMALLINT,
    "file_key" TEXT NOT NULL,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "professional_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_verification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tutor_id" UUID NOT NULL,
    "status" "IdentityVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "name_match" BOOLEAN NOT NULL DEFAULT false,
    "not_expired" BOOLEAN NOT NULL DEFAULT false,
    "photo_clarity" BOOLEAN NOT NULL DEFAULT false,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_key" TEXT NOT NULL,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "identity_verification_pkey" PRIMARY KEY ("id")
);



-- CreateIndex
CREATE UNIQUE INDEX "identity_verification_tutor_id_key" ON "identity_verification"("tutor_id");

-- AddForeignKey
ALTER TABLE "tutor_admin_notes" ADD CONSTRAINT "tutor_admin_notes_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_documents" ADD CONSTRAINT "professional_documents_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_verification" ADD CONSTRAINT "identity_verification_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
