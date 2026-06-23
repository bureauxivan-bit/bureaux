import { NextRequest } from 'next/server';
import { getClientSession } from '@/lib/client-auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { stageIndex: string } }
) {
  const session = await getClientSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const idx = parseInt(params.stageIndex, 10);
  if (isNaN(idx) || idx < 0 || idx > 5) return Response.json({ error: 'Invalid stage' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  if (!body.text?.trim()) return Response.json({ error: 'text required' }, { status: 400 });

  const stage = await prisma.clientStage.findUnique({
    where: { clientId_stageIndex: { clientId: session.clientId, stageIndex: idx } },
    select: { id: true },
  });
  if (!stage) return Response.json({ error: 'Not found' }, { status: 404 });

  const [revision] = await prisma.$transaction([
    prisma.clientStageRevision.create({
      data: { stageId: stage.id, text: body.text.trim(), isFromClient: true },
    }),
    prisma.clientStage.update({
      where: { id: stage.id },
      data: { clientApprovedAt: null },
    }),
  ]);

  return Response.json(revision);
}
