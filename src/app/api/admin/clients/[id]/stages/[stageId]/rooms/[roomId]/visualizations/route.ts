import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; stageId: string; roomId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await req.json().catch(() => ({}));
  if (!body.url) return Response.json({ error: 'url required' }, { status: 400 });

  const maxOrder = await prisma.clientVisualization.aggregate({
    where: { roomId: params.roomId },
    _max: { order: true },
  });

  const viz = await prisma.clientVisualization.create({
    data: {
      roomId: params.roomId,
      url: body.url,
      description: body.description ?? null,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });
  return Response.json(viz);
}
