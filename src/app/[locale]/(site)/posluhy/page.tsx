import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { seoAlternates } from '@/i18n/seo';
import { Reveal } from '@/components/Reveal';
import { FinalCta } from '@/components/FinalCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

// Page-specific copy lives next to the page (shared UI strings live in
// src/messages). uk is the source text; en is the adapted translation.
const COPY = {
  uk: {
    metaTitle: "Послуги — дизайн інтер'єру, архітектура, ремонт під ключ · bureau X",
    metaDescription:
      "Архітектурне бюро повного циклу у Києві. Дизайн інтер'єру, архітектурне проєктування, будівництво та ремонт під ключ, авторський стиль МУАС.",
    breadcrumbHome: 'Головна',
    breadcrumbSelf: 'Послуги',
    selfPath: '/posluhy',
    eyebrow: 'Послуги',
    h1Start: 'Послуги bureau',
    h1End: '— від концепції до ключів',
    intro:
      'Ми — архітектурне бюро повного циклу. Проєктуємо, дизайнуємо, будуємо та супроводжуємо — у власному авторському стилі МУАС. Кожен проєкт розробляємо індивідуально, з урахуванням особистості клієнта та функції простору.',
    services: [
      {
        num: '01',
        title: "Дизайн інтер'єру",
        href: '/posluhy/dyzajn-intereru',
        desc: 'Повний авторський проєкт: від концепції та візуалізацій до робочих креслень і специфікацій — усе для реалізації ремонту.',
      },
      {
        num: '02',
        title: 'Архітектурне проєктування',
        href: '/posluhy/arkhitektura',
        desc: "Проєктування приватних будинків, котеджів і комерційних об'єктів. Від ескізу та концепції до повного пакету дозвільної документації.",
      },
      {
        num: '03',
        title: 'Ремонт та будівництво під ключ',
        href: '/posluhy/remont-pid-klyuch',
        desc: 'Власна бригада, авторський нагляд, дизайн і ремонт в одних руках. Від проєкту до переїзду без зайвого стресу.',
      },
      {
        num: '04',
        title: 'Комерційні приміщення',
        href: '/posluhy/komertsiini-prymishchennia',
        desc: 'Ресторани, кафе, офіси, магазини, готелі. Розуміємо бізнес-логіку простору й реалізуємо під ключ.',
      },
      {
        num: '05',
        title: 'Приватні простори',
        href: '/posluhy/pryvatni-prostory',
        desc: 'Квартири, будинки, котеджі в авторському стилі МУАС. Індивідуальний підхід від першої консультації до ключів.',
      },
    ],
  },
  en: {
    metaTitle: 'Services — Interior Design, Architecture, Turnkey Renovation · bureau X',
    metaDescription:
      'Full-cycle architecture studio in Kyiv, Ukraine. Interior design, architectural design, turnkey construction and renovation in the signature MUAS style.',
    breadcrumbHome: 'Home',
    breadcrumbSelf: 'Services',
    selfPath: '/en/services',
    eyebrow: 'Services',
    h1Start: 'bureau',
    h1End: 'services — from concept to keys',
    intro:
      'We are a full-cycle architecture studio. We design, build and supervise — in our own signature MUAS style. Every project is developed individually, around the client’s personality and the function of the space.',
    services: [
      {
        num: '01',
        title: 'Interior design',
        href: '/posluhy/dyzajn-intereru',
        desc: 'A complete signature project: from concept and visualizations to working drawings and specifications — everything needed to build.',
      },
      {
        num: '02',
        title: 'Architectural design',
        href: '/posluhy/arkhitektura',
        desc: 'Design of private houses, cottages and commercial buildings. From sketch and concept to a full permit documentation package.',
      },
      {
        num: '03',
        title: 'Turnkey renovation & construction',
        href: '/posluhy/remont-pid-klyuch',
        desc: 'Our own crew, author supervision, design and construction in one hands. From project to move-in without the stress.',
      },
      {
        num: '04',
        title: 'Commercial spaces',
        href: '/posluhy/komertsiini-prymishchennia',
        desc: 'Restaurants, cafés, offices, stores, hotels. We understand the business logic of a space and deliver it turnkey.',
      },
      {
        num: '05',
        title: 'Private spaces',
        href: '/posluhy/pryvatni-prostory',
        desc: 'Apartments, houses and cottages in the signature MUAS style. An individual approach from the first consultation to the keys.',
      },
    ],
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
    alternates: seoAlternates('/posluhy', locale),
  };
}

export default function PostluhyPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: locale === 'en' ? `${SITE_URL}/en` : SITE_URL },
      { '@type': 'ListItem', position: 2, name: c.breadcrumbSelf, item: `${SITE_URL}${c.selfPath}` },
    ],
  };

  return (
    <>
      <script
        id="ld-breadcrumb-posluhy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <section className="container-wide pt-36 pb-16 lg:pt-44 lg:pb-24">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
          {c.h1Start} <em>X</em> {c.h1End}
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">
          {c.intro}
        </p>
      </section>

      {/* Services list */}
      <section className="container-wide pb-24 lg:pb-36">
        <div className="border-t border-line">
          {c.services.map((s, i) => (
            <Reveal key={s.href} delay={i * 60}>
              <Link
                href={s.href}
                className="group flex flex-col gap-4 border-b border-line py-8 transition-colors duration-200 hover:bg-ink/[0.02] sm:flex-row sm:items-start sm:gap-10 sm:py-10"
              >
                <span className="shrink-0 text-[10px] font-normal uppercase tracking-[0.28em] text-muted pt-1">
                  {s.num}
                </span>

                <div className="flex-1">
                  <h2 className="display-xl text-xl font-normal sm:text-2xl">
                    {s.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {s.desc}
                  </p>
                </div>

                <span className="self-center text-2xl transition-transform duration-300 group-hover:translate-x-2 shrink-0">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
