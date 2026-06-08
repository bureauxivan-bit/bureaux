import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { settingsSchema } from '@/lib/validation';

export async function PATCH(req: NextRequest) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const parsed = settingsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: parsed.data,
    create: { id: 'singleton', ...parsed.data },
  });
  return Response.json(settings);
}
