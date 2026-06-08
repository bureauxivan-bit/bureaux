import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const { status } = await req.json();
  if (!['NEW', 'IN_PROGRESS', 'CLOSED'].includes(status))
    return Response.json({ error: 'Невірний статус' }, { status: 422 });
  const lead = await prisma.lead.update({ where: { id: params.id }, data: { status } });
  return Response.json(lead);
}
