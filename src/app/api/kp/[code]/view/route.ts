import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyKpViewed } from '@/lib/telegram';

export async function POST(_req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const proposal = await prisma.kpProposal.findUnique({ where: { code: params.code } });
    if (!proposal) return new Response(null, { status: 204 });

    const isFirstView = proposal.firstViewedAt === null;
    const now = new Date();

    await prisma.$transaction([
      prisma.kpProposal.update({
        where: { id: proposal.id },
        data: {
          viewCount: { increment: 1 },
          ...(isFirstView && {
            firstViewedAt: now,
            // only upgrade draft→sent→viewed, never downgrade meeting/contract/declined
            ...(proposal.status === 'sent' && { status: 'viewed', viewedAt: now }),
          }),
        },
      }),
      prisma.kpEvent.create({
        data: { kpId: proposal.id, eventType: 'view' },
      }),
    ]);

    if (isFirstView) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
      await notifyKpViewed({
        clientName: proposal.clientName,
        objectType: proposal.objectType,
        areaM2: proposal.areaM2,
        publicUrl: `${siteUrl}/kp/${proposal.code}`,
      });
    }
  } catch {}

  return new Response(null, { status: 204 });
}
