import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const source = searchParams.get('source');
  const type = searchParams.get('type');
  const leads = await prisma.lead.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
      ...(type ? { type: type as 'ESTIMATE' | 'CONSULT' | 'GENERAL' } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(leads);
}
