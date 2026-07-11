import { unstable_setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { seoAlternates } from '@/i18n/seo';
import { getTeam } from '@/lib/data';
import { StudioTeamList } from '@/components/StudioTeamList';
import { CtaButton } from '@/components/CtaButton';
import type { Metadata } from 'next';

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

const COPY = {
  uk: {
    metaTitle: 'Про бюро — авторський стиль МУАС · bureau X Київ',
    metaDescription:
      'Молоде подружжя архітекторів, що створили Молодий Український Архітектурний Стиль (МУАС). Понад 5 років та 10 000+ м² реалізованих просторів у Києві та Україні.',
    breadcrumbHome: 'Головна',
    breadcrumbSelf: 'Про бюро',
    selfPath: '/studio',
    h1: 'АВТОРИ ПРОСТОРУ',
    eyebrow: 'Студія',
    p1: 'Ми бюро архітектури та дизайну, засновниками якого є молоде подружжя архітекторів за освітою та захопленням. Вже понад 5 років даруємо людям приємні емоції під час розробки дизайну та ремонту.',
    p2Strong: 'Молодий Український Архітектурний Стиль (МУАС)',
    p2Start: 'Ми створили',
    p2End: '— активно просуваємо новий стиль українського дизайну, поєднуючи сучасні тенденції та українські традиції.',
    p3: "Реалізуємо проєкти по всій Україні та за кордоном — від приватних інтер'єрів до комерційних просторів та архітектурних об'єктів.",
    teamEmpty: 'Команда скоро буде додана.',
    ctaHeading: 'Створімо щось разом',
    ctaText: 'Реалізуємо проєкти по всій Україні та світу.',
    ctaProjects: 'Переглянути проєкти',
    ctaCreate: 'Створити разом',
  },
  en: {
    metaTitle: 'About the Studio — Signature MUAS Style · bureau X Kyiv',
    metaDescription:
      'A young married couple of architects who created the Young Ukrainian Architectural Style (MUAS). Over 5 years and 10,000+ m² of completed spaces in Kyiv, Ukraine and beyond.',
    breadcrumbHome: 'Home',
    breadcrumbSelf: 'About the studio',
    selfPath: '/en/studio',
    h1: 'AUTHORS OF SPACE',
    eyebrow: 'Studio',
    p1: 'We are an architecture and design studio founded by a young married couple — architects by education and by passion. For over 5 years we have been bringing people joy throughout the design and renovation journey.',
    p2Strong: 'Young Ukrainian Architectural Style (MUAS)',
    p2Start: 'We created the',
    p2End: '— actively promoting a new style of Ukrainian design that blends contemporary trends with Ukrainian traditions.',
    p3: 'We deliver projects across Ukraine and abroad — from private interiors to commercial spaces and architecture.',
    teamEmpty: 'The team will be added soon.',
    ctaHeading: "Let's create something together",
    ctaText: 'We deliver projects across Ukraine and worldwide.',
    ctaProjects: 'View projects',
    ctaCreate: 'Create together',
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
    alternates: seoAlternates('/studio', locale),
  };
}

export default async function StudioPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  const team = await getTeam(locale);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: locale === 'en' ? `${SITE_URL}/en` : SITE_URL },
      { '@type': 'ListItem', position: 2, name: c.breadcrumbSelf, item: `${SITE_URL}${c.selfPath}` },
    ],
  };

  return (
    <div className="pt-20 lg:pt-24">
      <script
        id="ld-bc-studio"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero heading */}
      <div className="container-wide py-12 lg:py-20">
        <h1 className="display-xl text-[clamp(1.8rem,9vw,9rem)] leading-none tracking-tight">
          {c.h1}
        </h1>
      </div>

      {/* About text */}
      <div className="container-wide grid gap-12 pb-16 lg:grid-cols-[1fr_1.2fr] lg:pb-24">
        <div>
          <p className="eyebrow">{c.eyebrow}</p>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">
            {c.p1}
          </p>
        </div>
        <div className="flex flex-col justify-center space-y-5 text-base leading-relaxed text-ink/65">
          <p className="border-l-2 border-ink pl-6 text-ink/80">
            {c.p2Start} <strong className="text-ink">{c.p2Strong}</strong> {c.p2End}
          </p>
          <p>
            {c.p3}
          </p>
        </div>
      </div>

      {/* Interactive team list */}
      {team.length > 0 ? (
        <StudioTeamList team={team} />
      ) : (
        <p className="container-wide py-16 text-muted">{c.teamEmpty}</p>
      )}

      {/* CTA */}
      <div className="container-wide py-24 text-center lg:py-32">
        <h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">{c.ctaHeading}</h2>
        <p className="mt-4 text-base text-muted">{c.ctaText}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href={{ pathname: '/', hash: '#projects' }} className="btn-terra">{c.ctaProjects}</Link>
          <CtaButton
            kind="estimate"
            className="inline-flex items-center justify-center gap-2 border border-terra px-7 py-3.5 text-xs font-light uppercase tracking-widest text-terra transition-colors duration-200 hover:bg-terra hover:text-paper"
          >
            {c.ctaCreate}
          </CtaButton>
        </div>
      </div>

    </div>
  );
}
