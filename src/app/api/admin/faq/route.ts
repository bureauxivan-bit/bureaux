import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const items = await prisma.faq.findMany({ orderBy: { order: 'asc' } });
  return Response.json(items);
}
export async function POST(req: NextRequest) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const data = await req.json();
  const count = await prisma.faq.count();
  const item = await prisma.faq.create({ data: { ...data, order: count } });
  return Response.json(item, { status: 201 });
}
