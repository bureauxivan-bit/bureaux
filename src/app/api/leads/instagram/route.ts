import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

function authOk(req: NextRequest) {
  return req.headers.get('x-api-key') === process.env.MARIA_API_KEY;
}

// POST — upsert lead by subscriberId; update lastClientMsgAt on each client message
export async function POST(req: NextRequest) {
  if (!authOk(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { subscriberId?: string; clientName?: string; lastClientMsgAt?: string };
  try { body = await req.json(); } catch { return Response.json({ error: 'Bad request' }, { status: 400 }); }

  const { subscriberId, clientName, lastClientMsgAt } = body;
  if (!subscriberId) return Response.json({ error: 'subscriberId required' }, { status: 422 });

  const msgAt = lastClientMsgAt ? new Date(lastClientMsgAt) : new Date();

  const existing = await prisma.lead.findUnique({ where: { externalId: subscriberId } });

  if (existing) {
    const data: Record<string, unknown> = { lastClientMsgAt: msgAt };
    if (clientName) data.clientName = clientName;
    // Re-activate a lost lead that messages again
    if (existing.status === 'lost') {
      data.status = 'new';
      data.pushSentAt = null;
    }
    const lead = await prisma.lead.update({ where: { id: existing.id }, data });
    return Response.json({ id: lead.id, isNew: false });
  }

  const lead = await prisma.lead.create({
    data: {
      source: 'instagram',
      externalId: subscriberId,
      clientName: clientName ?? null,
      status: 'new',
      lastClientMsgAt: msgAt,
    },
  });
  return Response.json({ id: lead.id, isNew: true }, { status: 201 });
}
