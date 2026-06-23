import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const client = await prisma.clientUser.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, email: true, phone: true, projectType: true, projectName: true, projectDetails: true, projectAddress: true, projectCity: true, status: true, adminNote: true, createdAt: true },
  });
  if (!client) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(client);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const body = await req.json().catch(() => ({}));
  const { status, adminNote, projectName, projectAddress, projectCity } = body as {
    status?: string; adminNote?: string; projectName?: string; projectAddress?: string; projectCity?: string;
  };

  const allowed = ['PENDING', 'APPROVED', 'REJECTED'];
  if (status && !allowed.includes(status)) {
    return Response.json({ error: 'Невірний статус' }, { status: 422 });
  }

  const updated = await prisma.clientUser.update({
    where: { id: params.id },
    data: {
      ...(status ? { status: status as any } : {}),
      ...(adminNote !== undefined ? { adminNote } : {}),
      ...(projectName !== undefined ? { projectName: projectName || null } : {}),
      ...(projectAddress !== undefined ? { projectAddress: projectAddress || null } : {}),
      ...(projectCity !== undefined ? { projectCity: projectCity || null } : {}),
    },
    select: { id: true, status: true, adminNote: true, projectName: true, projectAddress: true, projectCity: true },
  });
  return Response.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  await prisma.clientUser.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
