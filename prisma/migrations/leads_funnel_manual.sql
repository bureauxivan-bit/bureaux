-- Leads funnel: extend Lead table for unified instagram + site funnel
-- Run in Supabase SQL editor BEFORE deploying schema/code changes.

-- 1. Convert status column from LeadStatus enum to plain text
ALTER TABLE "Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE TEXT USING "status"::text;

-- Remap old enum values to new funnel statuses
UPDATE "Lead" SET "status" = CASE "status"
  WHEN 'NEW'         THEN 'new'
  WHEN 'IN_PROGRESS' THEN 'qualified'
  WHEN 'CLOSED'      THEN 'lost'
  ELSE 'new'
END;

ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'new';

DROP TYPE IF EXISTS "LeadStatus";

-- 2. Make name and phone nullable (Instagram leads don't always provide them upfront)
ALTER TABLE "Lead" ALTER COLUMN "name"  DROP NOT NULL;
ALTER TABLE "Lead" ALTER COLUMN "phone" DROP NOT NULL;

-- 3. Add new funnel columns
ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "source"          TEXT        NOT NULL DEFAULT 'site',
  ADD COLUMN IF NOT EXISTS "externalId"      TEXT,
  ADD COLUMN IF NOT EXISTS "clientName"      TEXT,
  ADD COLUMN IF NOT EXISTS "objectType"      TEXT,
  ADD COLUMN IF NOT EXISTS "areaM2"          INTEGER,
  ADD COLUMN IF NOT EXISTS "location"        TEXT,
  ADD COLUMN IF NOT EXISTS "service"         TEXT,
  ADD COLUMN IF NOT EXISTS "lostReason"      TEXT,
  ADD COLUMN IF NOT EXISTS "kpId"            TEXT,
  ADD COLUMN IF NOT EXISTS "lastClientMsgAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "pushSentAt"      TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- 4. Backfill clientName from name for existing site leads
UPDATE "Lead" SET "clientName" = "name" WHERE "name" IS NOT NULL AND "clientName" IS NULL;

-- 5. FK to KpProposal
ALTER TABLE "Lead"
  DROP CONSTRAINT IF EXISTS "Lead_kpId_fkey";
ALTER TABLE "Lead"
  ADD CONSTRAINT "Lead_kpId_fkey"
  FOREIGN KEY ("kpId") REFERENCES "KpProposal"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 6. Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Lead_externalId_key" ON "Lead"("externalId") WHERE "externalId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "Lead_source_idx"  ON "Lead"("source");
CREATE INDEX IF NOT EXISTS "Lead_status_idx"  ON "Lead"("status");
