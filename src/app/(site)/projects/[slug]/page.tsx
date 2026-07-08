import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjects, coverUrl } from '@/lib/data';
import { CATEGORY_LABELS } from '@/lib/constants';
import { CtaButton } from '@/components/CtaButton';
import { ProjectGallery } from '@/components/ProjectGallery';
import { ProjectHero } from '@/components/ProjectHero';

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProjectBySlug(params.slug);
  if (!p) return { title: 'Проєкт не знайдено' };
  const img = coverUrl(p);
  return {
    title: p.title,
    description: p.description ?? `Проєкт ${p.title} — ${CATEGORY_LABELS[p.category]}, ${p.year}.`,
    alternates: { canonical: `/projects/${params.slug}` },
    openGraph: { title: p.title, images: img ? [img] : [] },
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const p = await getProjectBySlug(params.slug);
  if (!p) notFound();

  const cover = coverUrl(p);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Проєкти', item: `${SITE_URL}/projects` },
      { '@type': 'ListItem', position: 3, name: p.title, item: `${SITE_URL}/projects/${p.slug}` },
    ],
  };

  const meta = [
    p.location && { label: 'Локація',  value: p.location },
    p.areaM2   && { label: 'Площа',    value: `${p.areaM2} м²` },
                  { label: 'Рік',       value: String(p.year) },
                  { label: 'Тип',       value: CATEGORY_LABELS[p.category] },
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
            <p className="eyebrow pt-1">Концепція</p>
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
          altPrefix={`${CATEGORY_LABELS[p.category]} — ${p.title}${p.location ? `, ${p.location}` : ''} · bureau X`}
        />
      </div>

      {/* ── CTA ── */}
      <div className="container-wide mt-16 mb-24">
        <div className="bg-coal px-8 py-16 text-center text-paper sm:py-20">
          <p className="eyebrow justify-center text-paper/35 before:bg-paper/35">
            bureau <em>X</em>
          </p>
          <h2 className="display-xl mt-5 font-normal text-[clamp(1.8rem,4vw,3.2rem)]">
            Сподобався проєкт?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm font-light leading-relaxed text-paper/50">
            Обговоримо ваш простір та зробимо безкоштовний прорахунок.
          </p>
          <div className="mt-10 flex justify-center">
            <CtaButton>Прорахунок проєкту</CtaButton>
          </div>
        </div>
      </div>

    </article>
  );
}
