import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStorageClient, BUCKET } from '@/lib/supabase';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; stageId: string; fileId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const file = await prisma.clientStageFile.findUnique({ where: { id: params.fileId } });
  if (!file) return Response.json({ error: 'Not found' }, { status: 404 });

  if (file.storageKey) {
    const supabase = getStorageClient();
    await supabase.storage.from(BUCKET).remove([file.storageKey]);
  }

  await prisma.clientStageFile.delete({ where: { id: params.fileId } });
  return Response.json({ ok: true });
}
