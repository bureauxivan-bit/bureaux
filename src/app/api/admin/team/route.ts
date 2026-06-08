import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const items = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
  return Response.json(items);
}
export async function POST(req: NextRequest) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const data = await req.json();
  const count = await prisma.teamMember.count();
  const item = await prisma.teamMember.create({ data: { ...data, order: count } });
  return Response.json(item, { status: 201 });
}
