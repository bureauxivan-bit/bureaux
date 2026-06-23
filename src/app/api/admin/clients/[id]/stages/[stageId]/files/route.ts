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
  if (!body.name || !body.url) return Response.json({ error: 'name and url required' }, { status: 400 });

  const file = await prisma.clientStageFile.create({
    data: {
      stageId: params.stageId,
      name: body.name,
      url: body.url,
      storageKey: body.storageKey ?? null,
    },
  });
  return Response.json(file);
}
