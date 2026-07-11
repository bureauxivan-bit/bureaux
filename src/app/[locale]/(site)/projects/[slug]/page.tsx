import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { seoAlternates } from '@/i18n/seo';
import { getProjectBySlug, getAllProjects, coverUrl } from '@/lib/data';
import { CtaButton } from '@/components/CtaButton';
import { ProjectGallery } from '@/components/ProjectGallery';
import { ProjectHero } from '@/components/ProjectHero';

export const revalidate = 60;

const COPY = {
  uk: {
    notFoundTitle: 'Проєкт не знайдено',
    metaDescription: (title: string, category: string, year: number) =>
      `Проєкт ${title} — ${category}, ${year}.`,
    breadcrumbHome: 'Головна',
    breadcrumbProjects: 'Проєкти',
    projectsPath: '/projects',
    concept: 'Концепція',
    location: 'Локація',
    area: 'Площа',
    year: 'Рік',
    type: 'Тип',
    ctaHeading: 'Сподобався проєкт?',
    ctaText: 'Обговоримо ваш простір та зробимо безкоштовний прорахунок.',
    ctaButton: 'Прорахунок проєкту',
  },
  en: {
    notFoundTitle: 'Project not found',
    metaDescription: (title: string, category: string, year: number) =>
      `${title} — ${category}, ${year}. A bureau X project.`,
    breadcrumbHome: 'Home',
    breadcrumbProjects: 'Projects',
    projectsPath: '/en/projects',
    concept: 'Concept',
    location: 'Location',
    area: 'Area',
    year: 'Year',
    type: 'Type',
    ctaHeading: 'Like this project?',
    ctaText: "Let's discuss your space — the estimate is free.",
    ctaButton: 'Project estimate',
  },
};

function copyFor(locale: string) {
  return locale === 'en' ? COPY.en : COPY.uk;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const c = copyFor(params.locale);
  const p = await getProjectBySlug(params.slug, params.locale);
  if (!p) return { title: c.notFoundTitle };
  const tCat = await getTranslations({ locale: params.locale, namespace: 'categories' });
  const img = coverUrl(p);
  return {
    title: p.title,
    description: p.description ?? c.metaDescription(p.title, tCat(p.category), p.year),
    alternates: seoAlternates({ pathname: '/projects/[slug]', params: { slug: params.slug } }, params.locale),
    openGraph: { title: p.title, images: img ? [img] : [] },
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export default async function ProjectPage({ params }: { params: { locale: string; slug: string } }) {
  unstable_setRequestLocale(params.locale);
  const c = copyFor(params.locale);
  const p = await getProjectBySlug(params.slug, params.locale);
  if (!p) notFound();
  const tCat = await getTranslations({ locale: params.locale, namespace: 'categories' });

  const cover = coverUrl(p);
  const isEn = params.locale === 'en';

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: isEn ? `${SITE_URL}/en` : SITE_URL },
      { '@type': 'ListItem', position: 2, name: c.breadcrumbProjects, item: `${SITE_URL}${c.projectsPath}` },
      { '@type': 'ListItem', position: 3, name: p.title, item: `${SITE_URL}${isEn ? '/en' : ''}/projects/${p.slug}` },
    ],
  };

  const meta = [
    p.location && { label: c.location, value: p.location },
    p.areaM2   && { label: c.area,     value: `${p.areaM2} ${isEn ? 'm²' : 'м²'}` },
                  { label: c.year,     value: String(p.year) },
                  { label: c.type,     value: tCat(p.category) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article>
      <script
        id="ld-bc-project"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ── Hero with parallax ── */}
      {cover ? (
        <ProjectHero cover={cover} title={p.title} meta={meta} />
      ) : (
        /* fallback if no cover photo yet */
        <div className="flex h-64 items-end bg-coal px-5 pb-12 sm:px-8 lg:px-12">
          <h1 className="display-xl font-normal text-paper text-[clamp(2.4rem,6vw,6rem)]">
            {p.title}
          </h1>
        </div>
      )}

      {/* ── Description (optional) ── */}
      {p.description && (
        <div className="container-wide border-b border-line py-14 sm:py-20">
          <div className="grid max-w-5xl gap-10 sm:grid-cols-[140px_1fr] sm:gap-16">
            <p className="eyebrow pt-1">{c.concept}</p>
            <p className="text-[1rem] font-light leading-[1.9] text-ink/70">
              {p.description}
            </p>
          </div>
        </div>
      )}

      {/* ── Gallery — full bleed ── */}
      <div className={`w-full ${p.description ? '' : 'pt-0.5'}`}>
        <ProjectGallery
          images={p.images}
          altPrefix={`${tCat(p.category)} — ${p.title}${p.location ? `, ${p.location}` : ''} · bureau X`}
        />
      </div>

      {/* ── CTA ── */}
      <div className="container-wide mt-16 mb-24">
        <div className="bg-coal px-8 py-16 text-center text-paper sm:py-20">
          <p className="eyebrow justify-center text-paper/35 before:bg-paper/35">
            bureau <em>X</em>
          </p>
          <h2 className="display-xl mt-5 font-normal text-[clamp(1.8rem,4vw,3.2rem)]">
            {c.ctaHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm font-light leading-relaxed text-paper/50">
            {c.ctaText}
          </p>
          <div className="mt-10 flex justify-center">
            <CtaButton>{c.ctaButton}</CtaButton>
          </div>
        </div>
      </div>

    </article>
  );
}
