import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { kpProposalSchema } from '@/lib/validation';

export async function GET() {
  const unauth = await requireAdmin(); if (unauth) return unauth;

  const proposals = await prisma.kpProposal.findMany({ orderBy: { createdAt: 'desc' } });
  if (proposals.length === 0) return Response.json([]);

  const ids = proposals.map((p) => p.id);

  // Aggregate events per kpId in one query
  const events = await prisma.kpEvent.findMany({
    where: { kpId: { in: ids } },
    select: { kpId: true, eventType: true, value: true, createdAt: true },
  });

  type EventRow = { kpId: string; eventType: string; value: number | null; createdAt: Date };
  const byKp = events.reduce<Record<string, EventRow[]>>((acc, e) => {
    (acc[e.kpId] ??= []).push(e);
    return acc;
  }, {});

  const result = proposals.map((p) => {
    const evs = byKp[p.id] ?? [];
    const views = evs.filter((e) => e.eventType === 'view');
    const times = evs.filter((e) => e.eventType === 'time_on_page' && e.value !== null).map((e) => e.value as number);
    const lastViewedAt = views.length ? views.reduce((a, b) => (a.createdAt > b.createdAt ? a : b)).createdAt : null;
    const avgTime = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
    const maxTime = times.length ? Math.max(...times) : null;
    const scrolledToPrice = evs.some((e) => e.eventType === 'scroll_price');
    const scrolledToEnd = evs.some((e) => e.eventType === 'scroll_end');

    return {
      ...p,
      analytics: { lastViewedAt, avgTime, maxTime, scrolledToPrice, scrolledToEnd },
    };
  });

  return Response.json(result);
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const parsed = kpProposalSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 422 });

  let code = '';
  for (let i = 0; i < 10; i++) {
    const candidate = Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 6);
    const exists = await prisma.kpProposal.findUnique({ where: { code: candidate } });
    if (!exists) { code = candidate; break; }
  }
  if (!code) return Response.json({ error: 'Failed to generate unique code' }, { status: 500 });

  const proposal = await prisma.kpProposal.create({ data: { code, ...parsed.data } });
  return Response.json(proposal, { status: 201 });
}
