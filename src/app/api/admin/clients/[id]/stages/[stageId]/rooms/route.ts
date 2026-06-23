import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; stageId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const rooms = await prisma.clientRoom.findMany({
    where: { stageId: params.stageId },
    orderBy: { order: 'asc' },
    include: { visualizations: { orderBy: { order: 'asc' } } },
  });
  return Response.json(rooms);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; stageId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await req.json().catch(() => ({}));
  if (!body.name?.trim()) return Response.json({ error: 'name required' }, { status: 400 });

  const maxOrder = await prisma.clientRoom.aggregate({
    where: { stageId: params.stageId },
    _max: { order: true },
  });

  const room = await prisma.clientRoom.create({
    data: {
      stageId: params.stageId,
      name: body.name.trim(),
      order: (maxOrder._max.order ?? -1) + 1,
    },
    include: { visualizations: true },
  });
  return Response.json(room);
}
