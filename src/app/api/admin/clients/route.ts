import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const clients = await prisma.clientUser.findMany({
    where: status ? { status: status as any } : {},
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, phone: true, projectType: true, projectName: true, projectDetails: true, status: true, adminNote: true, createdAt: true },
  });
  return Response.json(clients);
}
