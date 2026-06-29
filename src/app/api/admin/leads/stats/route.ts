import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const FUNNEL = ['new', 'qualified', 'kp_sent', 'kp_viewed', 'meeting', 'contract'] as const;

export async function GET(req: NextRequest) {
  const unauth = await requireAdmin(); if (unauth) return unauth;

  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get('month'); // '2026-06'

  let start: Date, end: Date;
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [year, month] = monthParam.split('-').map(Number);
    start = new Date(year, month - 1, 1);
    end = new Date(year, month, 1);
  } else {
    const now = new Date();
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  const leads = await prisma.lead.findMany({
    where: { createdAt: { gte: start, lt: end } },
    select: { id: true, source: true, status: true, lostReason: true },
  });

  // Counts by current status
  const funnel: Record<string, number> = {};
  for (const s of [...FUNNEL, 'postponed', 'lost', 'not_client']) funnel[s] = 0;

  const bySource: Record<string, Record<string, number>> = { instagram: {}, site: {} };
  const lostReasons: Record<string, number> = {};

  for (const lead of leads) {
    funnel[lead.status] = (funnel[lead.status] ?? 0) + 1;

    const src = lead.source === 'instagram' ? 'instagram' : 'site';
    bySource[src][lead.status] = (bySource[src][lead.status] ?? 0) + 1;

    if (lead.status === 'lost' && lead.lostReason) {
      lostReasons[lead.lostReason] = (lostReasons[lead.lostReason] ?? 0) + 1;
    }
  }

  // Step conversions within funnel
  const conversions: Record<string, number | null> = {};
  for (let i = 1; i < FUNNEL.length; i++) {
    const prev = FUNNEL[i - 1];
    const curr = FUNNEL[i];
    const prevCount = funnel[prev];
    conversions[`${prev}_to_${curr}`] = prevCount > 0 ? Math.round((funnel[curr] / prevCount) * 100) : null;
  }

  return Response.json({
    period: { start: start.toISOString(), end: end.toISOString() },
    total: leads.length,
    funnel,
    conversions,
    bySource,
    lostReasons,
  });
}
