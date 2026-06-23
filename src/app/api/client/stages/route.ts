import { NextRequest } from 'next/server';
import { getClientSession } from '@/lib/client-auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  const session = await getClientSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const stages = await prisma.clientStage.findMany({
    where: { clientId: session.clientId },
    orderBy: { stageIndex: 'asc' },
    select: { id: true, stageIndex: true, status: true },
  });

  return Response.json(stages);
}
