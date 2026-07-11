-- First-touch traffic source on interaction events, for per-channel
-- conversion attribution in the /stats funnel.
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "source" TEXT;
