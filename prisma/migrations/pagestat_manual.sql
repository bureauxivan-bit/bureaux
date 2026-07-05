-- Per-pageview engagement (time on page, scroll depth) for monthly stats.
CREATE TABLE IF NOT EXISTS "PageStat" (
  "id" TEXT NOT NULL,
  "page" TEXT NOT NULL,
  "seconds" INTEGER NOT NULL DEFAULT 0,
  "scroll" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PageStat_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PageStat_createdAt_idx" ON "PageStat"("createdAt");
