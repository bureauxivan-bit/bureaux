import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const STAGE_COUNT = 6;

async function ensureStages(clientId: string) {
  const existing = await prisma.clientStage.findMany({ where: { clientId } });
  if (existing.length < STAGE_COUNT) {
    const existingIndexes = new Set(existing.map((s) => s.stageIndex));
    await prisma.clientStage.createMany({
      data: Array.from({ length: STAGE_COUNT }, (_, i) => i)
        .filter((i) => !existingIndexes.has(i))
        .map((i) => ({ clientId, stageIndex: i })),
    });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const client = await prisma.clientUser.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!client) return Response.json({ error: 'Not found' }, { status: 404 });

  await ensureStages(params.id);

  const stages = await prisma.clientStage.findMany({
    where: { clientId: params.id },
    orderBy: { stageIndex: 'asc' },
    include: {
      files: { orderBy: { createdAt: 'asc' } },
      rooms: {
        orderBy: { order: 'asc' },
        include: {
          visualizations: { orderBy: { order: 'asc' } },
          revisions: { orderBy: { createdAt: 'desc' } },
        },
      },
      specItems: { orderBy: { order: 'asc' } },
      revisions: { orderBy: { createdAt: 'desc' } },
    },
  });

  return Response.json(stages);
}
