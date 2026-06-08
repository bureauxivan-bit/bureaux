import { prisma } from '@/lib/prisma';
export async function GET() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  return Response.json(s ?? {});
}
