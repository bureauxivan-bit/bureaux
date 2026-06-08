import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const leads = await prisma.lead.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(type ? { type: type as any } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(leads);
}
