-- KP Stage 2: add status date columns to KpProposal + create KpEvent table

ALTER TABLE "KpProposal"
  ADD COLUMN IF NOT EXISTS "firstViewedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "ctaClickedAt"  TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "sentAt"        TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "viewedAt"      TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "meetingAt"     TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "contractAt"    TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "declinedAt"    TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "KpEvent" (
  "id"        TEXT         NOT NULL,
  "kpId"      TEXT         NOT NULL,
  "eventType" TEXT         NOT NULL,
  "value"     INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "KpEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "KpEvent_kpId_idx"
  ON "KpEvent"("kpId");

CREATE INDEX IF NOT EXISTS "KpEvent_kpId_eventType_idx"
  ON "KpEvent"("kpId", "eventType");

ALTER TABLE "KpEvent"
  DROP CONSTRAINT IF EXISTS "KpEvent_kpId_fkey";

ALTER TABLE "KpEvent"
  ADD CONSTRAINT "KpEvent_kpId_fkey"
  FOREIGN KEY ("kpId") REFERENCES "KpProposal"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
