import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; stageId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const revisions = await prisma.clientStageRevision.findMany({
    where: { stageId: params.stageId },
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(revisions);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; stageId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await req.json().catch(() => ({}));
  if (!body.text?.trim()) return Response.json({ error: 'text required' }, { status: 400 });

  const [revision] = await prisma.$transaction([
    prisma.clientStageRevision.create({
      data: { stageId: params.stageId, text: body.text.trim(), isFromClient: false },
    }),
    prisma.clientStage.update({
      where: { id: params.stageId },
      data: { clientApprovedAt: null },
    }),
  ]);

  return Response.json(revision);
}
