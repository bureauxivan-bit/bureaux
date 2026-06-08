import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { projectSchema } from '@/lib/validation';
import { getStorageClient, BUCKET } from '@/lib/supabase';

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const body = await req.json().catch(() => ({}));
  // Allow partial updates incl. coverId / order without full schema.
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  const data: Record<string, unknown> = { ...parsed.data };
  if (typeof body.coverId === 'string') data.coverId = body.coverId;
  if (typeof body.order === 'number') data.order = body.order;
  const project = await prisma.project.update({ where: { id: params.id }, data });
  return Response.json(project);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const images = await prisma.projectImage.findMany({ where: { projectId: params.id } });
  if (images.length) {
    try { await getStorageClient().storage.from(BUCKET).remove(images.map((i) => i.storageKey)); } catch {}
  }
  await prisma.project.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
