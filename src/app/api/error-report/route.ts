import { NextRequest } from 'next/server';
import { notifyServerError } from '@/lib/telegram';
import { rateLimit, clientIp } from '@/lib/rate-limit';

// Reports client-side render crashes caught by global-error.tsx.
// Rate-limited per IP so a broken page can't be used to spam the chat.
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limited = rateLimit(`error-report:${ip}`, 10, 60_000);
  if (!limited.ok) return Response.json({ ok: true });

  let body: { message?: string; stack?: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: true });
  }

  await notifyServerError({
    timestamp: new Date(),
    message: body.message || 'Невідома помилка на клієнті',
    stack: body.stack,
    url: body.url,
  });

  return Response.json({ ok: true });
}
