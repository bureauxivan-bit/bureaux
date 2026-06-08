import 'server-only';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export async function getSettings() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  return { ...DEFAULT_SETTINGS, ...(s ?? {}) };
}

export async function getServices() {
  return prisma.service.findMany({ orderBy: { order: 'asc' } });
}

export async function getTeam() {
  return prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
}

export async function getReviews() {
  return prisma.review.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } });
}

export async function getFaq() {
  return prisma.faq.findMany({ orderBy: { order: 'asc' } });
}

export async function getTopProjects() {
  return prisma.project.findMany({
    where: { isTop: true },
    orderBy: [{ order: 'asc' }, { year: 'desc' }],
    include: { images: { orderBy: { order: 'asc' } } },
    take: 6,
  });
}

export async function getAllProjects() {
  return prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { year: 'desc' }],
    include: { images: { orderBy: { order: 'asc' } } },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: 'asc' } } },
  });
}

/** Returns the cover image URL for a project, falling back to first image. */
export function coverUrl(p: { coverId: string | null; images: { id: string; url: string }[] }) {
  if (p.coverId) {
    const found = p.images.find((i) => i.id === p.coverId);
    if (found) return found.url;
  }
  return p.images[0]?.url ?? null;
}
