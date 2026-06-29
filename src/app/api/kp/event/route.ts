import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyKpCta } from '@/lib/telegram';
import { recordStatusChange } from '@/lib/leads';

const VALID_EVENTS = new Set([
  'view', 'time_on_page', 'scroll_price', 'scroll_end',
  'click_cta', 'click_projects', 'click_contact',
]);

// In-memory rate limit: max 20 events per kpId per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(kpId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(kpId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(kpId, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 20) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return new Response(null, { status: 400 });
  }

  const { kpId, eventType, value } = body as Record<string, unknown>;

  if (typeof kpId !== 'string' || !kpId) return new Response(null, { status: 400 });
  if (typeof eventType !== 'string' || !VALID_EVENTS.has(eventType)) return new Response(null, { status: 400 });
  if (isRateLimited(kpId)) return new Response(null, { status: 429 });

  try {
    await prisma.kpEvent.create({
      data: {
        kpId,
        eventType,
        value: typeof value === 'number' ? Math.round(value) : null,
      },
    });

    if (eventType === 'view') {
      const toUpdate = await prisma.lead.findMany({
        where: { kpId, status: 'kp_sent' },
        select: { id: true },
      });
      if (toUpdate.length) {
        await prisma.lead.updateMany({ where: { kpId, status: 'kp_sent' }, data: { status: 'kp_viewed' } });
        for (const l of toUpdate) await recordStatusChange(l.id, 'kp_viewed');
      }
    }

    if (eventType === 'click_cta') {
      const proposal = await prisma.kpProposal.findUnique({ where: { id: kpId } });
      if (proposal && proposal.ctaClickedAt === null) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
        await prisma.kpProposal.update({
          where: { id: kpId },
          data: { ctaClickedAt: new Date() },
        });
        await notifyKpCta({
          clientName: proposal.clientName,
          objectType: proposal.objectType,
          areaM2: proposal.areaM2,
          location: proposal.location,
          publicUrl: `${siteUrl}/kp/${proposal.code}`,
        });
      }
    }
  } catch {}

  return new Response(null, { status: 204 });
}
