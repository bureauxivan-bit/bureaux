import { prisma } from '@/lib/prisma';
import { getClientSession } from '@/lib/client-auth';

export async function GET() {
  const session = await getClientSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.clientUser.findUnique({
    where: { id: session.clientId },
    select: { id: true, name: true, email: true, phone: true, projectType: true, projectDetails: true, status: true, adminNote: true, createdAt: true },
  });
  if (!user) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json(user);
}
