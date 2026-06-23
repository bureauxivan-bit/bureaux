import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; stageId: string; itemId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.category !== undefined) data.category = body.category || null;
  if (body.quantity !== undefined) data.quantity = body.quantity || null;
  if (body.unit !== undefined) data.unit = body.unit || null;
  if (body.note !== undefined) data.note = body.note || null;

  const item = await prisma.clientSpecItem.update({ where: { id: params.itemId }, data });
  return Response.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; stageId: string; itemId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  await prisma.clientSpecItem.delete({ where: { id: params.itemId } });
  return Response.json({ ok: true });
}
