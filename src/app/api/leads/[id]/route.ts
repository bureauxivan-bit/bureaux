import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { recordStatusChange } from '@/lib/leads';

const ALLOWED_STATUSES = new Set([
  'new', 'qualified', 'kp_sent', 'kp_viewed', 'meeting', 'contract', 'postponed', 'lost', 'not_client',
]);
const LOST_REASONS = new Set(['дорого', 'знайшли інших', 'передумали', 'не відповів', 'інше']);

// PATCH — Maria updates lead status/fields
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (req.headers.get('x-api-key') !== process.env.MARIA_API_KEY)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return Response.json({ error: 'Bad request' }, { status: 400 }); }

  const { status, lostReason, kpId, clientName, objectType, areaM2, location, service } = body as Record<string, string | number | null>;

  if (status !== undefined && !ALLOWED_STATUSES.has(status as string))
    return Response.json({ error: 'Invalid status' }, { status: 422 });
  if (lostReason !== undefined && lostReason !== null && !LOST_REASONS.has(lostReason as string))
    return Response.json({ error: 'Invalid lostReason' }, { status: 422 });

  const data: Record<string, unknown> = {};
  if (status !== undefined) data.status = status;
  if (lostReason !== undefined) data.lostReason = lostReason;
  if (kpId !== undefined) data.kpId = kpId;
  if (clientName !== undefined) data.clientName = clientName;
  if (objectType !== undefined) data.objectType = objectType;
  if (areaM2 !== undefined) data.areaM2 = areaM2 ? Number(areaM2) : null;
  if (location !== undefined) data.location = location;
  if (service !== undefined) data.service = service;

  const lead = await prisma.lead.update({ where: { id: params.id }, data });
  if (typeof data.status === 'string') recordStatusChange(lead.id, data.status).catch(() => {});
  return Response.json(lead);
}
