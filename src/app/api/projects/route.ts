import { prisma } from '@/lib/prisma';
export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { year: 'desc' }],
    include: { images: { orderBy: { order: 'asc' } } },
  });
  return Response.json(projects);
}
