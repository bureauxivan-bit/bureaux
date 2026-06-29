-- Migration: add LeadStatusHistory table
-- Run via Supabase SQL editor or direct DB connection

CREATE TABLE IF NOT EXISTS "LeadStatusHistory" (
  "id"        TEXT NOT NULL,
  "leadId"    TEXT NOT NULL,
  "status"    TEXT NOT NULL,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LeadStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LeadStatusHistory_leadId_idx"
  ON "LeadStatusHistory"("leadId");

ALTER TABLE "LeadStatusHistory"
  ADD CONSTRAINT "LeadStatusHistory_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
