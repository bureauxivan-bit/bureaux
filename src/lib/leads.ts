import { prisma } from './prisma';
import type { PrismaClient } from '@prisma/client';

type Tx = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export async function recordStatusChange(leadId: string, status: string, tx?: Tx) {
  const db = tx ?? prisma;
  await db.leadStatusHistory.create({ data: { leadId, status } });
}
