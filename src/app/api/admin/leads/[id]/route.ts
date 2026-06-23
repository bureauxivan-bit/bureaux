import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  await prisma.lead.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
