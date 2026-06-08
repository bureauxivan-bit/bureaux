import { prisma } from '@/lib/prisma';
export async function GET() { return Response.json(await prisma.review.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } })); }
