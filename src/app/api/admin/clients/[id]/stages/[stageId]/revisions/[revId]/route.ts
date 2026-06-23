import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; stageId: string; revId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  await prisma.clientStageRevision.delete({ where: { id: params.revId } });
  return Response.json({ ok: true });
}
