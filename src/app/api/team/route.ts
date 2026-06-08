import { prisma } from '@/lib/prisma';
export async function GET() { return Response.json(await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })); }
