import { prisma } from '@/lib/prisma';

export const MONTH_NAMES = [
  'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень',
  'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень',
];

// Kyiv is UTC+2/+3 (DST); a fixed +02:00 keeps day boundaries close enough
// for visit reports without pulling in a timezone library.
export const KYIV_OFFSET_MS = 2 * 3600_000;

function esc(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
}

/** Human label for a referrer URL. */
function sourceLabel(referrer: string | null, siteHost: string): string {
  if (!referrer || referrer === 'Пряме відвідування') return 'прямі';
  if (referrer === 'Google Ads') return 'Google Ads';
  try {
    const host = new URL(referrer).hostname.replace(/^(www|l|lm|m)\./, '');
    if (host.includes(siteHost)) return 'внутрішні';
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('facebook') || host === 'fb.com') return 'Facebook';
    // AI assistants — checked before Google so gemini.google.com isn't
    // swallowed by the generic google match. Relevant for AEO tracking.
    if (host.includes('chatgpt') || host.includes('openai')) return 'ChatGPT';
    if (host.includes('claude') || host.includes('anthropic')) return 'Claude';
    if (host.includes('perplexity')) return 'Perplexity';
    if (host.includes('gemini')) return 'Gemini';
    if (host.includes('copilot')) return 'Copilot';
    if (host.includes('google')) return 'Google';
    if (host.includes('t.me') || host.includes('telegram')) return 'Telegram';
    if (host.includes('tiktok')) return 'TikTok';
    if (host.includes('bing')) return 'Bing';
    return host;
  } catch {
    return 'прямі';
  }
}

function top(counter: Map<string, number>, n: number): [string, number][] {
  return [...counter.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

function fmtDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  if (s < 60) return `${s} с`;
  return `${Math.floor(s / 60)} хв ${String(s % 60).padStart(2, '0')} с`;
}

/** Conversion funnel: visits → CTA clicks → submitted leads, in one window. */
async function buildFunnel(start: Date, end: Date, visits: number): Promise<string> {
  const [events, leads] = await Promise.all([
    prisma.event.groupBy({
      by: ['name'],
      where: { createdAt: { gte: start, lt: end } },
      _count: true,
    }),
    prisma.lead.count({ where: { source: 'site', createdAt: { gte: start, lt: end } } }),
  ]);
  const byName = new Map(events.map((e) => [e.name, e._count]));
  const g = (n: string) => byName.get(n) ?? 0;
  const ctaTotal = g('cta_estimate') + g('cta_consult');
  const projects = g('cta_projects');
  const messenger = g('contact_telegram') + g('contact_instagram') + g('contact_phone');
  const popupShown = g('popup_shown');
  const popupLead = g('popup_lead');

  // Nothing wired yet in this window — skip the block entirely.
  if (ctaTotal === 0 && projects === 0 && messenger === 0 && popupShown === 0 && leads === 0) return '';

  const pct = (n: number) => (visits > 0 ? ` (${Math.round((n / visits) * 100)}%)` : '');
  // Built from the code point at runtime: as a source literal this emoji gets
  // escaped to a broken "🎯" string by the Vercel build minifier.
  const target = String.fromCodePoint(0x1f3af);
  const lines = [
    '',
    `${target} <b>Конверсія:</b>`,
    `Кліки «Прорахунок»: ${ctaTotal}${pct(ctaTotal)}`,
    `Кліки «Переглянути проєкти»: ${projects}${pct(projects)}`,
  ];
  if (messenger > 0) lines.push(`Кліки в месенджер: ${messenger}${pct(messenger)}`);
  if (popupShown > 0) lines.push(`Спливне вікно: показів ${popupShown} → заявок ${popupLead}`);
  lines.push(`Заявки: <b>${leads}</b>${pct(leads)}`);
  return lines.join('\n');
}

/** Engagement block from PageStat beacons (time on page, scroll depth). */
async function buildEngagement(start: Date, end: Date): Promise<string> {
  const stats = await prisma.pageStat.findMany({
    where: { createdAt: { gte: start, lt: end } },
    select: { page: true, seconds: true, scroll: true },
  });
  if (stats.length === 0) return '';

  const avgSeconds = stats.reduce((a, s) => a + s.seconds, 0) / stats.length;
  const avgScroll = stats.reduce((a, s) => a + s.scroll, 0) / stats.length;

  // Pages people actually read: highest average time, needs 2+ views to count.
  const perPage = new Map<string, { sec: number; n: number }>();
  for (const s of stats) {
    const e = perPage.get(s.page) ?? { sec: 0, n: 0 };
    e.sec += s.seconds;
    e.n += 1;
    perPage.set(s.page, e);
  }
  const readable = [...perPage.entries()]
    .filter(([, e]) => e.n >= 2)
    .map(([page, e]) => [page, e.sec / e.n] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return [
    '',
    '⏱ <b>Залученість:</b>',
    `Середній час на сторінці: ${fmtDuration(avgSeconds)} · Прокрутка: ${Math.round(avgScroll)}%`,
    readable.length
      ? `Найдовше читають:\n${readable.map(([p, s], i) => `${i + 1}. ${esc(p)} — ${fmtDuration(s)}`).join('\n')}`
      : '',
  ].filter((l) => l !== '').join('\n');
}

function count(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

/** Aggregates visits in [start, end) into an HTML report for Telegram. */
export async function buildStatsReport(
  start: Date,
  end: Date,
  label: string,
): Promise<{ text: string; visits: number }> {
  const visits = await prisma.visit.findMany({
    where: { createdAt: { gte: start, lt: end } },
    select: {
      ip: true, city: true, country: true, device: true, browser: true,
      referrer: true, utm: true, page: true, isNew: true, createdAt: true,
    },
  });

  const header = `📊 <b>Статистика за ${esc(label)} — BUREAUX</b>`;
  if (visits.length === 0) {
    return { text: `${header}\n\nВізитів не зафіксовано.`, visits: 0 };
  }

  const siteHost = (() => {
    try { return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? '').hostname.replace(/^www\./, ''); }
    catch { return 'bureaux.com.ua'; }
  })();

  const uniqueIps = new Set<string>();
  const pages = new Map<string, number>();
  const sources = new Map<string, number>();
  const campaigns = new Map<string, number>();
  const cities = new Map<string, number>();
  const devices = new Map<string, number>();
  const browsers = new Map<string, number>();
  const days = new Map<string, number>();
  let newCount = 0;

  for (const v of visits) {
    uniqueIps.add(v.ip);
    if (v.isNew) newCount++;
    count(pages, v.page.split('?')[0]);
    count(sources, sourceLabel(v.referrer, siteHost));
    if (v.utm) count(campaigns, v.utm);
    if (v.city && v.city !== 'Невідомо') count(cities, v.city);
    if (v.device) count(devices, v.device);
    if (v.browser) count(browsers, v.browser.replace(/ [\d.]+$/, ''));
    const kyiv = new Date(v.createdAt.getTime() + KYIV_OFFSET_MS);
    count(days, `${String(kyiv.getUTCDate()).padStart(2, '0')}.${String(kyiv.getUTCMonth() + 1).padStart(2, '0')}`);
  }

  const busiest = top(days, 1)[0];
  const line = (pairs: [string, number][]) =>
    pairs.map(([k, n]) => `${esc(k)} — ${n}`).join(' · ');
  const list = (pairs: [string, number][]) =>
    pairs.map(([k, n], i) => `${i + 1}. ${esc(k)} — ${n}`).join('\n');

  const text = [
    header,
    '',
    `👥 Візити: <b>${visits.length}</b> (унікальних IP: ${uniqueIps.size})`,
    `🆕 Нових: ${newCount} · 🔵 Повторних: ${visits.length - newCount}`,
    busiest && days.size > 1 ? `📈 Найактивніший день: ${busiest[0]} (${busiest[1]} візитів)` : '',
    '',
    '📄 <b>Топ сторінок:</b>',
    list(top(pages, 5)),
    '',
    '↩️ <b>Джерела:</b>',
    list(top(sources, 5)),
    campaigns.size ? `\n📣 <b>Кампанії:</b>\n${list(top(campaigns, 5))}` : '',
    '',
    `🌆 Міста: ${line(top(cities, 5))}`,
    `📱 Пристрої: ${line(top(devices, 3))}`,
    `🧭 Браузери: ${line(top(browsers, 3))}`,
    await buildFunnel(start, end, visits.length),
    await buildEngagement(start, end),
  ].filter((l) => l !== '').join('\n');

  return { text, visits: visits.length };
}
