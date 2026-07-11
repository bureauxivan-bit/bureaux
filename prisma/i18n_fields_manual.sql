-- English content fields for the /en site version (2026-07).
-- Nullable columns: frontend falls back to Ukrainian when En is empty.
-- Applied manually (npx prisma db execute --file prisma/i18n_fields_manual.sql --schema prisma/schema.prisma),
-- consistent with the other *_manual.sql files in this folder.

ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "titleEn" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "locationEn" TEXT;

ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "titleEn" TEXT;
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;

ALTER TABLE "TeamMember" ADD COLUMN IF NOT EXISTS "nameEn" TEXT;
ALTER TABLE "TeamMember" ADD COLUMN IF NOT EXISTS "roleEn" TEXT;
ALTER TABLE "TeamMember" ADD COLUMN IF NOT EXISTS "quoteEn" TEXT;

ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "authorEn" TEXT;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "projectNameEn" TEXT;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "textEn" TEXT;

ALTER TABLE "Faq" ADD COLUMN IF NOT EXISTS "questionEn" TEXT;
ALTER TABLE "Faq" ADD COLUMN IF NOT EXISTS "answerEn" TEXT;
