import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; stageId: string; roomId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await req.json().catch(() => ({}));
  if (!body.name?.trim()) return Response.json({ error: 'name required' }, { status: 400 });

  const room = await prisma.clientRoom.update({
    where: { id: params.roomId },
    data: { name: body.name.trim() },
  });
  return Response.json(room);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; stageId: string; roomId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  await prisma.clientRoom.delete({ where: { id: params.roomId } });
  return Response.json({ ok: true });
}
