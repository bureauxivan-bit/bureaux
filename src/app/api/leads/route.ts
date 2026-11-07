import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { leadSchema } from '@/lib/validation';
import { notifyTelegram, type LeadContext } from '@/lib/telegram';
import { lookupGeo } from '@/lib/geo';
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
  await notifyTelegram(lead, await leadContext(req, ip));

  return Response.json({ ok: true });
}

function cookieValue(req: NextRequest, name: string): string | undefined {
  const raw = req.cookies.get(name)?.value;
  if (!raw) return undefined;
  try { return decodeURIComponent(raw).slice(0, 200); } catch { return raw.slice(0, 200); }
}

function header(req: NextRequest, name: string): string | undefined {
  const v = req.headers.get(name);
  if (!v) return undefined;
  try { return decodeURIComponent(v); } catch { return v; }
}

/** City (Vercel edge geo headers, ipwho.is only as fallback — keeps the form
 *  fast), first-touch channel and last-touch campaign stamped by middleware,
 *  and the page the form was sent from. Never throws. */
async function leadContext(req: NextRequest, ip: string): Promise<LeadContext> {
  let city = header(req, 'x-vercel-ip-city');
  let country = header(req, 'x-vercel-ip-country');
  if (!city) {
    const geo = await lookupGeo(ip, { country });
    city = geo.city;
    country = geo.country;
  }

  let page: string | undefined;
  try {
    const ref = req.headers.get('referer');
    if (ref) page = new URL(ref).pathname;
  } catch {}

  return {
    city,
    country,
    channel: cookieValue(req, 'bx_src'),
    campaign: cookieValue(req, 'bx_cmp'),
    page,
  };
}
