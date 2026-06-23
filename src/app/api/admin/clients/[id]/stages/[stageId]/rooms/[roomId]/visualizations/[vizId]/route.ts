import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStorageClient, BUCKET } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; stageId: string; roomId: string; vizId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.description !== undefined) data.description = body.description || null;

  const viz = await prisma.clientVisualization.update({ where: { id: params.vizId }, data });
  return Response.json(viz);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; stageId: string; roomId: string; vizId: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const viz = await prisma.clientVisualization.findUnique({ where: { id: params.vizId } });
  if (!viz) return Response.json({ error: 'Not found' }, { status: 404 });

  // Try to delete from Supabase storage
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (supabaseUrl && viz.url.includes(supabaseUrl)) {
    const parts = new URL(viz.url).pathname.split('/');
    const storageKey = parts.slice(parts.indexOf('object') + 3).join('/');
    const supabase = getStorageClient();
    await supabase.storage.from(BUCKET).remove([storageKey]).catch(() => {});
  }

  await prisma.clientVisualization.delete({ where: { id: params.vizId } });
  return Response.json({ ok: true });
}
