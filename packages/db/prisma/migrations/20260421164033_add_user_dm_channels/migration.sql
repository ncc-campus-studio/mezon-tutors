/*
  Warnings:

  - A unique constraint covering the columns `[reviewer_id,tutor_id]` on the table `tutor_reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "user_dm_channels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "tutor_id" UUID NOT NULL,
    "channel_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_dm_channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_dm_channels_channel_id_key" ON "user_dm_channels"("channel_id");

-- CreateIndex
CREATE INDEX "user_dm_channels_student_id_idx" ON "user_dm_channels"("student_id");

-- CreateIndex
CREATE INDEX "user_dm_channels_tutor_id_idx" ON "user_dm_channels"("tutor_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_dm_channels_student_id_tutor_id_key" ON "user_dm_channels"("student_id", "tutor_id");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_reviews_reviewer_id_tutor_id_key" ON "tutor_reviews"("reviewer_id", "tutor_id");

-- AddForeignKey
ALTER TABLE "user_dm_channels" ADD CONSTRAINT "user_dm_channels_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_dm_channels" ADD CONSTRAINT "user_dm_channels_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
