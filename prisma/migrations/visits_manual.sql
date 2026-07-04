-- Visit log for Telegram analytics monthly stats (applied manually,
-- following this project's manual-migration convention).
CREATE TABLE IF NOT EXISTS "Visit" (
  "id" TEXT NOT NULL,
  "ip" TEXT NOT NULL,
  "country" TEXT,
  "city" TEXT,
  "isp" TEXT,
  "device" TEXT,
  "os" TEXT,
  "browser" TEXT,
  "language" TEXT,
  "referrer" TEXT,
  "utm" TEXT,
  "page" TEXT NOT NULL,
  "isNew" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Visit_createdAt_idx" ON "Visit"("createdAt");
