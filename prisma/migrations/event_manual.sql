-- Client interaction events (CTA clicks) for conversion-funnel stats.
CREATE TABLE IF NOT EXISTS "Event" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "page" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Event_createdAt_idx" ON "Event"("createdAt");
CREATE INDEX IF NOT EXISTS "Event_name_idx" ON "Event"("name");
