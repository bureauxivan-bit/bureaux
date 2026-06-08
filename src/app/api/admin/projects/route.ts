import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { projectSchema } from '@/lib/validation';

export async function GET() {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: { images: { orderBy: { order: 'asc' } } },
  });
  return Response.json(projects);
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const parsed = projectSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  const count = await prisma.project.count();
  const project = await prisma.project.create({ data: { ...parsed.data, order: count } });
  return Response.json(project, { status: 201 });
}
