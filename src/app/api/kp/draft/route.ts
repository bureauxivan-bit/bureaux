import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyKpDraft } from '@/lib/telegram';
import { servicesFromString, type KpServices } from '@/lib/kp-services';

function generateIntro(clientName: string, services: KpServices, objectType?: string, areaM2?: number, location?: string): string {
  const parts: string[] = [];
  if (services.architecture?.enabled) parts.push('архітектурне проєктування');
  if (services.design?.enabled) parts.push('дизайн інтер\'єру');
  if (services.supervision?.enabled) parts.push('авторський супровід');
  const svcStr = parts.join(' + ');
  const meta = [svcStr || null, objectType, areaM2 ? `${areaM2} м²` : null, location ? `у ${location}` : null]
    .filter(Boolean).join(' ');
  return `${clientName}, на Ваш запит ми сформували комерційну пропозицію для ${meta} — з релевантними проектами, прозорим розрахунком вартості та термінами, врахованими під Ваш графік.`;
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

  const services = servicesFromString(serviceStr, areaNum);
  const introText = generateIntro(clientName.trim(), services, objectTypeStr, areaNum, locationStr);

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
      services: Object.keys(services).length > 0 ? (services as object) : undefined,
      // Keep legacy fields null — deriveServices handles old→new mapping on read
      service: null,
      priceDesign: null,
      supervisionMonthly: null,
      introText,
      projectIds: [],
      status: 'draft',
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const adminUrl = `${siteUrl}/admin/kp`;

  const archPrice = proposal.areaM2 && (services.architecture?.price ?? null);
  const designPrice = proposal.areaM2 && (services.design?.price ?? null);
  const firstPrice = archPrice || designPrice || null;

  await notifyKpDraft({
    clientName: proposal.clientName,
    objectType: proposal.objectType,
    areaM2: proposal.areaM2,
    location: proposal.location,
    service: serviceStr ?? null,
    priceDesign: typeof firstPrice === 'number' ? firstPrice : null,
    adminUrl,
  });

  return Response.json({ ok: true, code: proposal.code, adminUrl }, { status: 201 });
}
