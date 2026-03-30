-- CreateTable
CREATE TABLE "tutor_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tutor_id" UUID NOT NULL,
    "reviewer_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutor_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tutor_reviews_tutor_id_created_at_idx" ON "tutor_reviews"("tutor_id", "created_at");

-- CreateIndex
CREATE INDEX "tutor_reviews_reviewer_id_idx" ON "tutor_reviews"("reviewer_id");

-- AddForeignKey
ALTER TABLE "tutor_reviews" ADD CONSTRAINT "tutor_reviews_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_reviews" ADD CONSTRAINT "tutor_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
