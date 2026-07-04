import { NextRequest } from 'next/server';
import { sendAnalytics } from '@/lib/telegram';
import { buildStatsReport, MONTH_NAMES, KYIV_OFFSET_MS } from '@/lib/stats';

export const dynamic = 'force-dynamic';

// Telegram webhook for the analytics bot. Registered via setWebhook with
// secret_token=CRON_SECRET — Telegram echoes it back in a header on every
// request, so nobody else can feed us fake updates.
//
// Supported (only inside the analytics group):
//   /stats          — current month so far
//   /stats week     — last 7 days   (also: тиждень, неделя)
//   /stats today    — today         (also: сьогодні, сегодня)
export async function POST(req: NextRequest) {
  if (req.headers.get('x-telegram-bot-api-secret-token') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let update: { message?: { text?: string; chat?: { id?: number } } };
  try {
    update = await req.json();
  } catch {
    return Response.json({ ok: true });
  }

  const text = update.message?.text ?? '';
  const chatId = String(update.message?.chat?.id ?? '');
  if (chatId !== (process.env.TELEGRAM_ANALYTICS_CHAT_ID ?? '').trim()) {
    return Response.json({ ok: true });
  }
  if (!/^\/stats(@\w+)?(\s|$)/.test(text)) return Response.json({ ok: true });

  const arg = text.split(/\s+/)[1]?.toLowerCase() ?? '';
  const now = Date.now();
  const kyivNow = new Date(now + KYIV_OFFSET_MS);

  let start: Date;
  let label: string;
  if (['today', 'сьогодні', 'сегодня'].includes(arg)) {
    start = new Date(Date.UTC(kyivNow.getUTCFullYear(), kyivNow.getUTCMonth(), kyivNow.getUTCDate()) - KYIV_OFFSET_MS);
    label = 'сьогодні';
  } else if (['week', 'тиждень', 'неделя'].includes(arg)) {
    start = new Date(now - 7 * 24 * 3600_000);
    label = 'останні 7 днів';
  } else {
    start = new Date(Date.UTC(kyivNow.getUTCFullYear(), kyivNow.getUTCMonth(), 1) - KYIV_OFFSET_MS);
    label = `${MONTH_NAMES[kyivNow.getUTCMonth()]} ${kyivNow.getUTCFullYear()} (поточний)`;
  }

  const { text: report } = await buildStatsReport(start, new Date(), label);
  await sendAnalytics(report);
  return Response.json({ ok: true });
}
