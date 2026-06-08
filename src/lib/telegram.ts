// Structural type — decoupled from the generated Prisma client so this
// module type-checks regardless of generation state.
type Lead = {
  name: string;
  phone: string;
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
    lead.message ? `Повідомлення: ${escapeHtml(lead.message)}` : '',
    `🕒 ${lead.createdAt.toLocaleString('uk-UA')}`,
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
