import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; stageId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await req.json().catch(() => ({}));
  if (!body.name) return Response.json({ error: 'name required' }, { status: 400 });

  const maxOrder = await prisma.clientSpecItem.aggregate({
    where: { stageId: params.stageId },
    _max: { order: true },
  });

  const item = await prisma.clientSpecItem.create({
    data: {
      stageId: params.stageId,
      name: body.name,
      category: body.category ?? null,
      quantity: body.quantity ?? null,
      unit: body.unit ?? null,
      note: body.note ?? null,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });
  return Response.json(item);
}
