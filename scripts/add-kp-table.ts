import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "KpProposal" (
      "id"                 TEXT        NOT NULL,
      "code"               TEXT        NOT NULL,
      "clientName"         TEXT        NOT NULL,
      "objectType"         TEXT,
      "areaM2"             INTEGER,
      "location"           TEXT,
      "service"            TEXT,
      "priceDesign"        INTEGER,
      "supervisionMonthly" INTEGER,
      "startDate"          TEXT,
      "durationWeeks"      TEXT        NOT NULL DEFAULT '~12 тижнів',
      "projectIds"         TEXT[]      NOT NULL DEFAULT '{}',
      "introText"          TEXT,
      "validDays"          INTEGER     NOT NULL DEFAULT 14,
      "status"             TEXT        NOT NULL DEFAULT 'draft',
      "viewCount"          INTEGER     NOT NULL DEFAULT 0,
      "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "KpProposal_pkey" PRIMARY KEY ("id")
    )
  `;

  await prisma.$executeRaw`
    CREATE UNIQUE INDEX IF NOT EXISTS "KpProposal_code_key" ON "KpProposal"("code")
  `;

  console.log('KpProposal table created successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
