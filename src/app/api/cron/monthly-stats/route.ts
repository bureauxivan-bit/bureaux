import { NextRequest } from 'next/server';
import { sendAnalytics } from '@/lib/telegram';
import { buildStatsReport, MONTH_NAMES, KYIV_OFFSET_MS } from '@/lib/stats';

export const dynamic = 'force-dynamic';

// Vercel Cron: 1st of each month (see vercel.json). Reports the previous
// calendar month. ?month=YYYY-MM overrides for manual runs.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const monthParam = req.nextUrl.searchParams.get('month');
  let year: number, month: number; // month: 0-11
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    year = Number(monthParam.slice(0, 4));
    month = Number(monthParam.slice(5)) - 1;
  } else {
    const kyivNow = new Date(Date.now() + KYIV_OFFSET_MS);
    year = kyivNow.getUTCFullYear();
    month = kyivNow.getUTCMonth() - 1;
    if (month < 0) { month = 11; year -= 1; }
  }
  const start = new Date(Date.UTC(year, month, 1) - KYIV_OFFSET_MS);
  const end = new Date(Date.UTC(year, month + 1, 1) - KYIV_OFFSET_MS);

  const { text, visits } = await buildStatsReport(start, end, `${MONTH_NAMES[month]} ${year}`);
  await sendAnalytics(text);
  return Response.json({ ok: true, month: `${MONTH_NAMES[month]} ${year}`, visits });
}
