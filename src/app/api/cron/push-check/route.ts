import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { recordStatusChange } from '@/lib/leads';

const PUSH_DELAY_H = 5;
const WINDOW_H = 24;
const NIGHT_START = 22;
const NIGHT_END = 9;

function ukraineHour(): number {
  return Number(new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', hour: 'numeric', hour12: false }).format(new Date()));
}

async function sendManychatPush(subscriberId: string, text: string): Promise<boolean> {
  const key = process.env.MANYCHAT_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch('https://api.manychat.com/fb/subscriber/sendContent', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscriber_id: subscriberId,
        data: { version: 'v2', content: { messages: [{ type: 'text', text }] } },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function pushText(clientName: string | null): string {
  const name = clientName?.trim();
  const greeting = name ? `${name}, нагадую про себе.` : 'Нагадую про себе.';
  return `${greeting} Чи актуальне це питання дизайну — буду рада допомогти з розрахунком.`;
}

// Called by Maria's APScheduler every 15 min, or manually
export async function GET(req: NextRequest) {
  if (req.headers.get('x-api-key') !== process.env.MARIA_API_KEY)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date();
  const pushThreshold = new Date(now.getTime() - PUSH_DELAY_H * 3600_000);
  const windowThreshold = new Date(now.getTime() - WINDOW_H * 3600_000);

  const ACTIVE_STATUSES = ['new', 'qualified', 'kp_sent', 'kp_viewed'];

  // 1. Mark lost: window expired (regardless of push status)
  const expired = await prisma.lead.findMany({
    where: {
      source: 'instagram',
      status: { in: ACTIVE_STATUSES },
      lastClientMsgAt: { lt: windowThreshold },
    },
    select: { id: true },
  });
  if (expired.length) {
    await prisma.lead.updateMany({
      where: { id: { in: expired.map((l) => l.id) } },
      data: { status: 'lost', lostReason: 'не відповів' },
    });
    for (const l of expired) await recordStatusChange(l.id, 'lost');
  }

  // 2. Find leads eligible for push
  const eligible = await prisma.lead.findMany({
    where: {
      source: 'instagram',
      pushSentAt: null,
      status: { in: ACTIVE_STATUSES },
      lastClientMsgAt: { lt: pushThreshold, gt: windowThreshold },
    },
    select: { id: true, externalId: true, clientName: true },
  });

  if (!eligible.length) return Response.json({ sent: 0, markedLost: expired.length });

  const hour = ukraineHour();
  const isNight = hour < NIGHT_END || hour >= NIGHT_START;

  if (isNight) {
    return Response.json({ sent: 0, markedLost: expired.length, deferred: eligible.length, reason: 'night' });
  }

  let sent = 0;
  for (const lead of eligible) {
    if (!lead.externalId) continue;
    const ok = await sendManychatPush(lead.externalId, pushText(lead.clientName));
    if (ok) {
      await prisma.lead.update({ where: { id: lead.id }, data: { pushSentAt: now } });
      sent++;
    }
  }

  return Response.json({ sent, markedLost: expired.length });
}
