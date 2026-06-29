import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const history = await prisma.leadStatusHistory.findMany({
    where: { leadId: params.id },
    orderBy: { changedAt: 'asc' },
  });
  return Response.json(history);
}
