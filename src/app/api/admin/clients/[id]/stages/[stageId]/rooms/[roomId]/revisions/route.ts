import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; stageId: string; roomId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const revisions = await prisma.clientRoomRevision.findMany({
    where: { roomId: params.roomId },
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(revisions);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; stageId: string; roomId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await req.json().catch(() => ({}));
  if (!body.text?.trim()) return Response.json({ error: 'text required' }, { status: 400 });

  const [revision] = await prisma.$transaction([
    prisma.clientRoomRevision.create({
      data: { roomId: params.roomId, text: body.text.trim(), isFromClient: false },
    }),
    // reset room approval
    prisma.clientRoom.update({
      where: { id: params.roomId },
      data: { clientApprovedAt: null },
    }),
    // reset stage-level approval
    prisma.clientStage.update({
      where: { id: params.stageId },
      data: { clientApprovedAt: null },
    }),
  ]);

  return Response.json(revision);
}
