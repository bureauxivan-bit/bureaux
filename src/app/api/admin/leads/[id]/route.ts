import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const body = await req.json().catch(() => ({}));
  const allowed = ['lostReason', 'status', 'objectType', 'areaM2', 'location', 'service', 'clientName', 'kpId'];
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const lead = await prisma.lead.update({ where: { id: params.id }, data });
  return Response.json(lead);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  await prisma.lead.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
