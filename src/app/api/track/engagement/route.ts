import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Public beacon endpoint (sendBeacon can't attach auth headers), so the
// payload is validated hard and writes are rate-limited per IP.
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limited = rateLimit(`engagement:${ip}`, 30, 60_000);
  if (!limited.ok) return Response.json({ ok: true });

  let body: { id?: unknown; page?: unknown; seconds?: unknown; scroll?: unknown };
  try {
    body = JSON.parse(await req.text());
  } catch {
    return Response.json({ ok: true });
  }

  const id = String(body.id ?? '');
  const page = String(body.page ?? '');
  const seconds = Math.round(Number(body.seconds));
  const scroll = Math.round(Number(body.scroll));

  if (
    !UUID_RE.test(id) ||
    !page.startsWith('/') || page.length > 200 ||
    !Number.isFinite(seconds) || seconds < 1 || seconds > 4 * 3600 ||
    !Number.isFinite(scroll) || scroll < 0 || scroll > 100
  ) {
    return Response.json({ ok: true });
  }

  await prisma.pageStat.upsert({
    where: { id },
    create: { id, page, seconds, scroll },
    update: { seconds, scroll },
  });

  return Response.json({ ok: true });
}
