import { prisma } from '@/lib/prisma';
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(project);
}
