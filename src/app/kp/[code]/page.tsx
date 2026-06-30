import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { coverUrl } from '@/lib/data';
import { CATEGORY_LABELS } from '@/lib/constants';
import { KpTemplate } from '@/components/kp/KpTemplate';
import { deriveServices } from '@/lib/kp-services';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const p = await prisma.kpProposal.findUnique({ where: { code: params.code } });
  if (!p) return { title: 'Пропозиція не знайдена' };
  return {
    title: `КП для ${p.clientName} · bureau X`,
    robots: { index: false, follow: false },
  };
}

export default async function KpPage({ params }: { params: { code: string } }) {
  const proposal = await prisma.kpProposal.findUnique({ where: { code: params.code } });
  if (!proposal) notFound();

  const projects = proposal.projectIds.length
    ? await prisma.project.findMany({
        where: { id: { in: proposal.projectIds } },
        include: { images: { orderBy: { order: 'asc' } } },
      })
    : [];

  const orderedProjects = proposal.projectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean) as typeof projects;

  const cases = orderedProjects.map((p) => ({
    title: p.title,
    tags: [CATEGORY_LABELS[p.category], p.areaM2 ? `${p.areaM2} м²` : null, p.location]
      .filter(Boolean)
      .join(' · '),
    description: p.description ?? null,
    coverUrl: coverUrl(p),
    projectUrl: `/projects/${p.slug}`,
  }));

  const telegramUrl =
    process.env.NEXT_PUBLIC_TELEGRAM_URL ?? 'https://t.me/bureau_x_arch';

  const services = deriveServices({
    services: proposal.services,
    service: proposal.service,
    priceDesign: proposal.priceDesign,
    supervisionMonthly: proposal.supervisionMonthly,
    areaM2: proposal.areaM2,
  });

  return (
    <KpTemplate
      code={proposal.code}
      kpId={proposal.id}
      clientName={proposal.clientName}
      objectType={proposal.objectType}
      areaM2={proposal.areaM2}
      location={proposal.location}
      services={services}
      startDate={proposal.startDate}
      durationWeeks={proposal.durationWeeks}
      introText={proposal.introText}
      validDays={proposal.validDays}
      createdAt={proposal.createdAt.toISOString()}
      cases={cases}
      telegramUrl={telegramUrl}
    />
  );
}
