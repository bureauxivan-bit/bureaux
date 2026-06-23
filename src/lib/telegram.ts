// Structural type — decoupled from the generated Prisma client so this
// module type-checks regardless of generation state.
type Lead = {
  name: string;
  phone: string;
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
    `Ім'я: <b>${escapeHtml(lead.name)}</b>`,
    `Телефон: <b>${escapeHtml(lead.phone)}</b>`,
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
    `👉 Обери проекти: ${p.adminUrl}`,
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
