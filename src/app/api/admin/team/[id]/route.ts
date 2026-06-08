import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const data = await req.json();
  const item = await prisma.teamMember.update({ where: { id: params.id }, data });
  return Response.json(item);
}
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  await prisma.teamMember.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
