import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { seoAlternates } from '@/i18n/seo';
import { getAllProjects } from '@/lib/data';
import { ProjectsGrid } from '@/components/ProjectsGrid';

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

const COPY = {
  uk: {
    metaTitle: "Портфоліо — реалізовані проєкти дизайну інтер'єру та архітектури · bureau X",
    metaDescription:
      "Портфоліо реалізованих проєктів bureau X — дизайн інтер'єру квартир і будинків, архітектура, комерційні об'єкти. Київ та Україна.",
    breadcrumbHome: 'Головна',
    breadcrumbSelf: 'Проєкти',
    selfPath: '/projects',
    eyebrow: 'Портфоліо',
    h1: 'Проєкти',
  },
  en: {
    metaTitle: 'Portfolio — Completed Interior Design & Architecture Projects · bureau X',
    metaDescription:
      'Portfolio of completed bureau X projects — interior design for apartments and houses, architecture, commercial spaces. Kyiv, Ukraine and worldwide.',
    breadcrumbHome: 'Home',
    breadcrumbSelf: 'Projects',
    selfPath: '/en/projects',
    eyebrow: 'Portfolio',
    h1: 'Projects',
  },
} as const;

function copyFor(locale: string) {
  return locale === 'en' ? COPY.en : COPY.uk;
}

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const c = copyFor(locale);
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDescription,
    alternates: seoAlternates('/projects', locale),
  };
}

export default async function ProjectsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  const projects = await getAllProjects(locale);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: locale === 'en' ? `${SITE_URL}/en` : SITE_URL },
      { '@type': 'ListItem', position: 2, name: c.breadcrumbSelf, item: `${SITE_URL}${c.selfPath}` },
    ],
  };

  return (
    <div className="container-wide pb-28 pt-36">
      <script
        id="ld-bc-projects"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <p className="eyebrow">{c.eyebrow}</p>
      <h1 className="display-xl mt-5 text-[clamp(2.4rem,7vw,6rem)]">{c.h1}</h1>
      <ProjectsGrid projects={projects} />
    </div>
  );
}
