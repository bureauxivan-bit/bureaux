// Structural type — decoupled from the generated Prisma client so this
// module type-checks regardless of generation state.
type Lead = {
  name: string | null;
  phone: string | null;
  email?: string | null;
  message: string | null;
  type: string;
  createdAt: Date;
};

const TYPE_LABEL: Record<string, string> = {
  ESTIMATE: 'Прорахунок проєкту',
  CONSULT: 'Консультація',
  GENERAL: 'Загальна заявка',
};

/** Sends a lead notification to the bureau's Telegram chat. Best-effort. */
export async function notifyTelegram(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // notifications disabled — silently skip

  const lines = [
    '🆕 <b>Нова заявка — BUREAUX</b>',
    `Тип: <b>${TYPE_LABEL[lead.type] ?? lead.type}</b>`,
    lead.name ? `Ім'я: <b>${escapeHtml(lead.name)}</b>` : '',
    lead.phone ? `Телефон: <b>${escapeHtml(lead.phone)}</b>` : '',
    lead.email ? `Email: <b>${escapeHtml(lead.email)}</b>` : '',
    lead.message ? `Повідомлення: ${escapeHtml(lead.message)}` : '',
    `🕒 ${lead.createdAt.toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`,
  ].filter(Boolean);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML' }),
    });
  } catch {
    // swallow — never block the lead from being saved
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
}

/** Sends to the analytics chat (falls back to the lead bot's token, kept in a separate chat).
 *  Best-effort, but logs failures so `vercel logs` shows why a message didn't arrive. */
async function sendAnalytics(text: string): Promise<void> {
  const token = (process.env.TELEGRAM_ANALYTICS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim();
  const chatId = process.env.TELEGRAM_ANALYTICS_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.warn('[analytics] skipped: env missing', { hasToken: !!token, hasChatId: !!chatId });
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    if (!res.ok) {
      console.error('[analytics] telegram rejected:', res.status, await res.text());
    } else {
      console.log('[analytics] sent ok');
    }
  } catch (err) {
    console.error('[analytics] telegram fetch failed:', err);
  }
}

type VisitPayload = {
  timestamp: Date;
  ip: string;
  country: string;
  city: string;
  isp: string;
  device: string;
  os: string;
  browser: string;
  language: string;
  referrer: string;
  url: string;
  /** utm_source / utm_medium / utm_content, e.g. "ig / social / link_in_bio" */
  utm?: string;
  isNewVisitor: boolean;
};

/** Sends a site-visit notification to the analytics Telegram chat. Best-effort. */
export async function notifyVisit(v: VisitPayload): Promise<void> {
  const lines = [
    `${v.isNewVisitor ? '🟢 <b>Новий відвідувач</b>' : '🔵 <b>Повторний візит</b>'} — BUREAUX`,
    `🕒 ${v.timestamp.toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`,
    `🌐 IP: <code>${escapeHtml(v.ip)}</code>`,
    `📍 ${escapeHtml(v.city)}, ${escapeHtml(v.country)}`,
    `📡 Провайдер: ${escapeHtml(v.isp)}`,
    `📱 Пристрій: ${escapeHtml(v.device)}`,
    `💻 ОС: ${escapeHtml(v.os)}`,
    `🧭 Браузер: ${escapeHtml(v.browser)}`,
    `🗣 Мова: ${escapeHtml(v.language)}`,
    `↩️ Джерело: ${escapeHtml(v.referrer)}`,
    v.utm ? `📣 Кампанія: ${escapeHtml(v.utm)}` : '',
    `🔗 Сторінка: ${escapeHtml(v.url)}`,
  ].filter(Boolean);
  await sendAnalytics(lines.join('\n'));
}

type ServerErrorPayload = {
  timestamp: Date;
  message: string;
  stack?: string;
  url?: string;
};

/** Sends a server-error alert to the analytics Telegram chat. Best-effort. */
export async function notifyServerError(e: ServerErrorPayload): Promise<void> {
  const lines = [
    '🚨 <b>Помилка сервера — BUREAUX</b>',
    `🕒 ${e.timestamp.toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`,
    e.url ? `🔗 ${escapeHtml(e.url)}` : '',
    `⚠️ ${escapeHtml(e.message).slice(0, 500)}`,
    e.stack ? `<pre>${escapeHtml(e.stack).slice(0, 800)}</pre>` : '',
  ].filter(Boolean);
  await sendAnalytics(lines.join('\n'));
}

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
  } catch {}
}

type KpDraftPayload = {
  clientName: string;
  objectType?: string | null;
  areaM2?: number | null;
  location?: string | null;
  service?: string | null;
  priceDesign?: number | null;
  adminUrl: string;
};

/** Тип 1 — новий бриф від Manychat, чернетка КП створена */
export async function notifyKpDraft(p: KpDraftPayload): Promise<void> {
  const lines = [
    '📋 <b>Новий бриф від Manychat</b>',
    `Клієнт: <b>${escapeHtml(p.clientName)}</b>`,
    [p.objectType, p.areaM2 ? `${p.areaM2} м²` : null, p.location]
      .filter(Boolean).map(s => escapeHtml(s!)).join(', '),
    p.service ? `Послуга: ${escapeHtml(p.service)}` : '',
    p.priceDesign ? `Ціна-підказка: <b>${p.priceDesign}$</b>` : '',
    `👉 <a href="${p.adminUrl}">Обери проекти в адмінці</a>`,
  ].filter(Boolean);
  await sendTelegram(lines.join('\n'));
}

type KpViewedPayload = {
  clientName: string;
  objectType?: string | null;
  areaM2?: number | null;
  publicUrl: string;
};

/** Тип 2 — КП переглянуто вперше */
export async function notifyKpViewed(p: KpViewedPayload): Promise<void> {
  const meta = [p.objectType, p.areaM2 ? `${p.areaM2} м²` : null]
    .filter(Boolean).map(s => escapeHtml(s!)).join(', ');
  const lines = [
    '👁 <b>КП переглянуто</b>',
    `${escapeHtml(p.clientName)} вперше відкрив пропозицію${meta ? ` (${meta})` : ''}`,
    p.publicUrl,
  ];
  await sendTelegram(lines.join('\n'));
}

type KpCtaPayload = {
  clientName: string;
  objectType?: string | null;
  areaM2?: number | null;
  location?: string | null;
  publicUrl: string;
};

/** Тип 3 — клік на CTA «зустрітись» */
export async function notifyKpCta(p: KpCtaPayload): Promise<void> {
  const meta = [p.objectType, p.areaM2 ? `${p.areaM2} м²` : null, p.location]
    .filter(Boolean).map(s => escapeHtml(s!)).join(', ');
  const lines = [
    '🔥 <b>Гарячий лід</b>',
    `${escapeHtml(p.clientName)} натиснув «Обрати час зустрічі»`,
    meta ? `${meta} — підключайтесь` : '',
    p.publicUrl,
  ].filter(Boolean);
  await sendTelegram(lines.join('\n'));
}
