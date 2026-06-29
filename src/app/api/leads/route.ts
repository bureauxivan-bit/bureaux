import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { leadSchema } from '@/lib/validation';
import { notifyTelegram } from '@/lib/telegram';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { recordStatusChange } from '@/lib/leads';

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limited = rateLimit(`lead:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return Response.json({ error: 'Забагато запитів. Спробуйте за хвилину.' }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ error: 'Bad request' }, { status: 400 }); }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Перевірте поля форми', issues: parsed.error.flatten() }, { status: 422 });
  }

  // Honeypot: silently accept but do nothing (do not tip off bots).
  if (parsed.data.company) return Response.json({ ok: true });

  const lead = await prisma.lead.create({
    data: {
      source: 'site',
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      message: parsed.data.message || null,
      type: parsed.data.type,
      clientName: parsed.data.name,
      status: 'new',
    },
  });

  await recordStatusChange(lead.id, 'new');
  await notifyTelegram(lead);

  return Response.json({ ok: true });
}
