import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

type Params = { params: { id: string } };

// Attach an already-uploaded image (from /api/upload) to a project.
export async function POST(req: NextRequest, { params }: Params) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const { storageKey, url, alt, width, height } = await req.json();
  const count = await prisma.projectImage.count({ where: { projectId: params.id } });
  const image = await prisma.projectImage.create({
    data: { projectId: params.id, storageKey, url, alt: alt ?? null, width, height, order: count },
  });
  // First image becomes cover by default.
  if (count === 0) await prisma.project.update({ where: { id: params.id }, data: { coverId: image.id } });
  return Response.json(image, { status: 201 });
}

// Reorder images: body = { order: string[] of imageIds }
export async function PATCH(req: NextRequest, { params }: Params) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const { order } = (await req.json()) as { order: string[] };
  await prisma.$transaction(
    order.map((id, i) => prisma.projectImage.update({ where: { id }, data: { order: i } })),
  );
  return Response.json({ ok: true });
}
