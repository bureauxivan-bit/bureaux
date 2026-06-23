import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyKpDraft } from '@/lib/telegram';

const PRICE_RATES: Record<string, number> = {
  'Дизайн інтер\'єру': 60,
  'Дизайн + супровід': 60,
  'Архпроєкт': 40,
};

function calcPrice(service: string, areaM2: number): number | null {
  const rate = PRICE_RATES[service];
  return rate ? areaM2 * rate : null;
}

function calcSupervision(service: string): number | null {
  return service === 'Дизайн + супровід' ? 800 : null;
}

function generateIntro(clientName: string, service?: string, objectType?: string, areaM2?: number, location?: string): string {
  const parts = [service, objectType, areaM2 ? `${areaM2} м²` : null, location ? `у ${location}` : null]
    .filter(Boolean).join(' ');
  return `${clientName}, на Ваш запит ми сформували комерційну пропозицію для ${parts} — з релевантними проектами, прозорим розрахунком вартості та термінами, врахованими під Ваш графік.`;
}

function generateCode(): string {
  return Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 6);
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.KP_API_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { clientName, objectType, areaM2, location, service } = body as Record<string, unknown>;

  if (!clientName || typeof clientName !== 'string' || !clientName.trim()) {
    return Response.json({ error: 'clientName is required' }, { status: 400 });
  }

  const areaNum = typeof areaM2 === 'number' ? areaM2 : (areaM2 ? Number(areaM2) : undefined);
  const serviceStr = typeof service === 'string' ? service : undefined;
  const objectTypeStr = typeof objectType === 'string' ? objectType : undefined;
  const locationStr = typeof location === 'string' ? location : undefined;

  const priceDesign = (serviceStr && areaNum) ? calcPrice(serviceStr, areaNum) : null;
  const supervisionMonthly = serviceStr ? calcSupervision(serviceStr) : null;
  const introText = generateIntro(clientName.trim(), serviceStr, objectTypeStr, areaNum, locationStr);

  let code = '';
  for (let i = 0; i < 10; i++) {
    const candidate = generateCode();
    const exists = await prisma.kpProposal.findUnique({ where: { code: candidate } });
    if (!exists) { code = candidate; break; }
  }
  if (!code) return Response.json({ error: 'Failed to generate unique code' }, { status: 500 });

  const proposal = await prisma.kpProposal.create({
    data: {
      code,
      clientName: clientName.trim(),
      objectType: objectTypeStr ?? null,
      areaM2: areaNum ?? null,
      location: locationStr ?? null,
      service: serviceStr ?? null,
      priceDesign,
      supervisionMonthly,
      introText,
      projectIds: [],
      status: 'draft',
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const adminUrl = `${siteUrl}/admin/kp`;

  await notifyKpDraft({
    clientName: proposal.clientName,
    objectType: proposal.objectType,
    areaM2: proposal.areaM2,
    location: proposal.location,
    service: proposal.service,
    priceDesign: proposal.priceDesign,
    adminUrl,
  });

  return Response.json({ ok: true, code: proposal.code, adminUrl }, { status: 201 });
}
