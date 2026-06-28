import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { kpProposalSchema } from '@/lib/validation';

const STATUS_DATE_FIELDS: Record<string, string> = {
  sent: 'sentAt',
  viewed: 'viewedAt',
  meeting: 'meetingAt',
  contract: 'contractAt',
  declined: 'declinedAt',
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const parsed = kpProposalSchema.partial().safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 422 });

  const current = await prisma.kpProposal.findUnique({ where: { id: params.id }, select: { status: true } });

  const statusDateUpdate: Record<string, Date> = {};
  if (parsed.data.status && parsed.data.status !== current?.status) {
    const dateField = STATUS_DATE_FIELDS[parsed.data.status];
    if (dateField) statusDateUpdate[dateField] = new Date();
  }

  const proposal = await prisma.kpProposal.update({
    where: { id: params.id },
    data: { ...parsed.data, ...statusDateUpdate },
  });

  // Sync lead funnel status when KP is marked as sent
  if (parsed.data.status === 'sent' && current?.status !== 'sent') {
    await prisma.lead.updateMany({
      where: { kpId: params.id, status: { in: ['new', 'qualified'] } },
      data: { status: 'kp_sent' },
    });
  }

  return Response.json(proposal);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  await prisma.kpProposal.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
