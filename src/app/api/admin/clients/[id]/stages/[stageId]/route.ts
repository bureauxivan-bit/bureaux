import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; stageId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.status !== undefined) data.status = body.status;
  if (body.note !== undefined) data.note = body.note ?? null;

  const stage = await prisma.clientStage.update({
    where: { id: params.stageId, clientId: params.id },
    data,
  });
  return Response.json(stage);
}
