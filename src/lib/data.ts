import 'server-only';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SETTINGS } from '@/lib/constants';

// ── English-content fallback ─────────────────────────────────────────────
// DB rows carry optional *En columns. For locale 'en' we overlay them onto
// the base (Ukrainian) fields when present, so components stay unaware of
// localization. Empty En fields fall back to Ukrainian.

const isEn = (locale?: string) => locale === 'en';

function pick(locale: string | undefined, base: string, en: string | null | undefined): string;
function pick(locale: string | undefined, base: string | null, en: string | null | undefined): string | null;
function pick(locale: string | undefined, base: string | null, en: string | null | undefined) {
  return isEn(locale) && en ? en : base;
}

type ProjectRow = {
  title: string;
  description: string | null;
  location: string | null;
  titleEn: string | null;
  descriptionEn: string | null;
  locationEn: string | null;
};

function locProject<T extends ProjectRow>(p: T, locale?: string): T {
  return {
    ...p,
    title: pick(locale, p.title, p.titleEn),
    description: pick(locale, p.description, p.descriptionEn),
    location: pick(locale, p.location, p.locationEn),
  };
}

export async function getSettings() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  return { ...DEFAULT_SETTINGS, ...(s ?? {}) };
}

export async function getServices(locale?: string) {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  return services.map((s) => ({
    ...s,
    // Keep the original uk title too: Services.tsx maps titles to hrefs by
    // Ukrainian keywords, so the link logic must see the uk value.
    ukTitle: s.title,
    title: pick(locale, s.title, s.titleEn),
    description: pick(locale, s.description, s.descriptionEn),
  }));
}

export async function getTeam(locale?: string, limit?: number) {
  const team = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
    ...(limit ? { take: limit } : {}),
  });
  return team.map((m) => ({
    ...m,
    name: pick(locale, m.name, m.nameEn),
    role: pick(locale, m.role, m.roleEn),
    quote: pick(locale, m.quote, m.quoteEn),
  }));
}

export async function getReviews(locale?: string) {
  const reviews = await prisma.review.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
  });
  return reviews.map((r) => ({
    ...r,
    author: pick(locale, r.author, r.authorEn),
    projectName: pick(locale, r.projectName, r.projectNameEn),
    text: pick(locale, r.text, r.textEn),
  }));
}

export async function getFaq(locale?: string) {
  const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } });
  return faqs.map((f) => ({
    ...f,
    question: pick(locale, f.question, f.questionEn),
    answer: pick(locale, f.answer, f.answerEn),
  }));
}

export async function getTopProjects(locale?: string) {
  const projects = await prisma.project.findMany({
    where: { isTop: true },
    orderBy: [{ order: 'asc' }, { year: 'desc' }],
    include: { images: { orderBy: { order: 'asc' } } },
    take: 6,
  });
  return projects.map((p) => locProject(p, locale));
}

export async function getAllProjects(locale?: string) {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { year: 'desc' }],
    include: { images: { orderBy: { order: 'asc' } } },
  });
  return projects.map((p) => locProject(p, locale));
}

export async function getProjectBySlug(slug: string, locale?: string) {
  const p = await prisma.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  return p ? locProject(p, locale) : p;
}

export async function getProjectsByCategory(
  category: 'PRIVATE' | 'COMMERCIAL' | 'ARCHITECTURE',
  take = 3,
  locale?: string,
) {
  const projects = await prisma.project.findMany({
    where: { category },
    orderBy: [{ order: 'asc' }, { year: 'desc' }],
    include: { images: { orderBy: { order: 'asc' } } },
    take,
  });
  return projects.map((p) => locProject(p, locale));
}

/** Returns the cover image URL for a project, falling back to first image. */
export function coverUrl(p: { coverId: string | null; images: { id: string; url: string }[] }) {
  if (p.coverId) {
    const found = p.images.find((i) => i.id === p.coverId);
    if (found) return found.url;
  }
  return p.images[0]?.url ?? null;
}
