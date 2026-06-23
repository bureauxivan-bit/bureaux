import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { getStorageClient, BUCKET } from '@/lib/supabase';

type Params = { params: { id: string; imageId: string } };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const image = await prisma.projectImage.findUnique({ where: { id: params.imageId } });
  if (!image) return Response.json({ error: 'Not found' }, { status: 404 });

  // Remove from Supabase Storage.
  if (image.storageKey) {
    const supabase = getStorageClient();
    await supabase.storage.from(BUCKET).remove([image.storageKey]);
  }

  // If this image was the cover, clear coverId first.
  await prisma.project.updateMany({
    where: { id: params.id, coverId: params.imageId },
    data: { coverId: null },
  });

  await prisma.projectImage.delete({ where: { id: params.imageId } });

  // Auto-assign next cover if project has remaining images.
  const next = await prisma.projectImage.findFirst({
    where: { projectId: params.id },
    orderBy: { order: 'asc' },
  });
  if (next) {
    await prisma.project.update({ where: { id: params.id }, data: { coverId: next.id } });
  }

  return Response.json({ ok: true });
}
