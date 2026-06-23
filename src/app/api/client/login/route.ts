import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clientLoginSchema } from '@/lib/validation';
import { verifyPassword, createClientSession } from '@/lib/client-auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const limited = rateLimit(`client-login:${clientIp(req)}`, 8, 60_000);
  if (!limited.ok) return Response.json({ error: 'Забагато спроб' }, { status: 429 });

  const parsed = clientLoginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: 'Невірні дані' }, { status: 422 });

  const user = await prisma.clientUser.findUnique({ where: { email: parsed.data.email } });
  const ok = user && (await verifyPassword(parsed.data.password, user.passwordHash));
  if (!user || !ok) return Response.json({ error: 'Невірний email або пароль' }, { status: 401 });

  await createClientSession(user.id, user.email);
  return Response.json({ ok: true, status: user.status });
}
