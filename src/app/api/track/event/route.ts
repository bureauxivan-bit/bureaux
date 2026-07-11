import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, clientIp } from '@/lib/rate-limit';

// Only known event names are stored, so a public beacon endpoint can't be
// used to flood the table with arbitrary strings.
const ALLOWED = new Set([
  'cta_estimate', 'cta_consult', 'cta_projects', 'lead_submitted',
  'contact_open', 'contact_telegram', 'contact_instagram', 'contact_phone',
  'popup_shown', 'popup_start', 'popup_lead',
]);

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limited = rateLimit(`event:${ip}`, 40, 60_000);
  if (!limited.ok) return Response.json({ ok: true });

  let body: { name?: unknown; page?: unknown };
  try {
    body = JSON.parse(await req.text());
  } catch {
    return Response.json({ ok: true });
  }

  const name = String(body.name ?? '');
  if (!ALLOWED.has(name)) return Response.json({ ok: true });

  const page = typeof body.page === 'string' && body.page.startsWith('/')
    ? body.page.slice(0, 200)
    : null;

  // First-touch acquisition channel, stamped by middleware at landing.
  let source: string | null = null;
  const raw = req.cookies.get('bx_src')?.value;
  if (raw) {
    try { source = decodeURIComponent(raw).slice(0, 40); } catch { source = raw.slice(0, 40); }
  }

  await prisma.event.create({ data: { name, page, source } });
  return Response.json({ ok: true });
}
