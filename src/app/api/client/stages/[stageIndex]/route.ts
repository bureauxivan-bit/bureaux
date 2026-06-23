import { NextRequest } from 'next/server';
import { getClientSession } from '@/lib/client-auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { stageIndex: string } }
) {
  const session = await getClientSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const idx = parseInt(params.stageIndex, 10);
  if (isNaN(idx) || idx < 0 || idx > 5) return Response.json({ error: 'Invalid stage' }, { status: 400 });

  const stage = await prisma.clientStage.findUnique({
    where: { clientId_stageIndex: { clientId: session.clientId, stageIndex: idx } },
    include: {
      files: { orderBy: { createdAt: 'asc' } },
      rooms: {
        orderBy: { order: 'asc' },
        include: { visualizations: { orderBy: { order: 'asc' } } },
      },
      specItems: { orderBy: { order: 'asc' } },
    },
  });

  if (!stage) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(stage);
}
