import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/client-auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const limited = rateLimit(`register:${clientIp(req)}`, 5, 60_000);
  if (!limited.ok) return Response.json({ error: 'Забагато спроб' }, { status: 429 });

  const parsed = registerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Невірні дані';
    return Response.json({ error: message }, { status: 422 });
  }

  const { name, email, phone, password, projectType, projectDetails } = parsed.data;

  const existing = await prisma.clientUser.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: 'Цей email вже зареєстровано' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  await prisma.clientUser.create({
    data: { name, email, phone, passwordHash, projectType, projectDetails: projectDetails || null },
  });

  return Response.json({ ok: true }, { status: 201 });
}
