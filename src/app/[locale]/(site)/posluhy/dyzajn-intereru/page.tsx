import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { seoAlternates } from '@/i18n/seo';
import { Reveal } from '@/components/Reveal';
import { PricingBlock } from '@/components/PricingBlock';
import { HowWeWork } from '@/components/HowWeWork';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/FinalCta';
import { CtaButton } from '@/components/CtaButton';
import { ProjectCard } from '@/components/ProjectCard';
import { getProjectsByCategory } from '@/lib/data';

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

// Page-specific copy lives next to the page (shared UI strings live in
// src/messages). uk is the source text; en is the adapted translation.
const COPY = {
  uk: {
    metaTitle: "Дизайн інтер'єру під ключ у Києві — bureau X",
    metaDescription:
      "Замовити дизайн інтер'єру квартири, будинку або комерційного приміщення у Києві. bureau X — авторський підхід, стиль МУАС, повний супровід від ескізу до реалізації.",
    breadcrumbHome: 'Головна',
    breadcrumbServices: 'Послуги',
    breadcrumbSelf: "Дизайн інтер'єру",
    servicesPath: '/posluhy',
    selfPath: '/posluhy/dyzajn-intereru',
    eyebrow: 'Послуги',
    h1: "Дизайн інтер'єру під ключ у Києві",
    introP1:
      "Дизайн інтер'єру у bureau X — це повний проєкт під реалізацію: планування, 3D-візуалізації, робочі креслення та специфікації. Для квартир, будинків і комерційних приміщень — у Києві та дистанційно по всій Україні. Вартість — від $60/м², мінімальний проєкт — 120 м² (від $7 200), термін для квартири 60–100 м² — 8–12 тижнів.",
    introP2:
      'Авторський підхід, стиль МУАС — від першого брифу до специфікацій під ремонт. Кожен проєкт розробляємо індивідуально: під особистість, функцію простору та спосіб життя клієнта.',
    ctaLabel: "Обговорити ваш інтер'єр",
    includesTitle: 'Що входить у дизайн-проєкт',
    includes: [
      'Вимірювання та обмірний план',
      'Планувальне рішення та зонування',
      "Концепт: настрійний борд, кольорова палітра",
      '3D-візуалізації ключових зон',
      'Робочі креслення (розкладки, розрізи, схеми)',
      'Специфікації матеріалів, меблів і декору',
    ],
    muasTitle: 'Авторський стиль МУАС',
    muasStart: 'МУАС — Молодий Український Архітектурний Стиль — це авторська концепція bureau',
    muasEnd:
      '. Поєднуємо сучасну естетику з українськими традиціями та символами. Три принципи: особистий — про вас, функціональний — про місце, смисловий — про що має бути цей простір.',
    objectsTitle: "Для яких об'єктів",
    objects: [
      { t: 'Квартири', d: 'Від студій до великих апартаментів. Оптимізуємо планування під спосіб життя.' },
      { t: 'Приватні будинки', d: 'Просторові й багаторівневі рішення. Узгоджуємо з архітектурним проєктом.' },
      { t: 'Котеджі', d: 'Комплексний підхід — від фасаду до кімнати відпочинку.' },
      { t: 'Комерційні приміщення', d: 'Ресторани, офіси, шоуруми — де дизайн прямо впливає на бізнес.' },
    ],
    projectsTitle: "Реалізовані інтер'єри",
    allProjects: 'Всі проєкти →',
    faqs: [
      {
        id: 'di-1',
        question: "Що входить у дизайн-проєкт інтер'єру?",
        answer:
          "Повний проєкт включає: обмірний план, зонування, концепт (борд та палітра), 3D-візуалізації ключових зон, робочі креслення (розкладки підлоги й стін, схеми освітлення, розрізи), специфікації матеріалів та меблів. Авторський нагляд і комплектація — за бажанням.",
      },
      {
        id: 'di-2',
        question: "Скільки коштує дизайн інтер'єру в Києві у 2026 році?",
        answer:
          "Дизайн інтер'єру у bureau X коштує від $60/м². Мінімальний проєкт рахуємо як 120 м² (від $7 200). Авторський нагляд реалізації — $800/міс окремо від проєкту. Точну вартість називаємо після короткого брифу.",
      },
      {
        id: 'di-3',
        question: 'Скільки триває розробка дизайн-проєкту квартири чи будинку?',
        answer:
          'Дизайн-проєкт квартири 60–100 м² займає орієнтовно 8–12 тижнів. Терміни залежать від площі та складності. Фіксуємо дедлайни у договорі.',
      },
      {
        id: 'di-4',
        question: 'Що таке авторський нагляд і навіщо він потрібен?',
        answer:
          'Авторський нагляд — це контроль реалізації проєкту на об\'єкті: бюро стежить, щоб результат відповідав кресленням і специфікаціям. Коштує $800/міс (Київ; інші міста — за домовленістю), окремо від вартості проєкту. Саме нагляд не дає реалізації «поплисти» від проєкту.',
      },
      {
        id: 'di-5',
        question: 'Чи можна замовити дизайн-проєкт дистанційно?',
        answer:
          'Так, проєктуємо дистанційно по всій Україні та за кордоном. Авторський нагляд в інших містах обговорюємо окремо.',
      },
      {
        id: 'di-6',
        question: 'Чи можна замовити тільки планування без 3D?',
        answer:
          'Так, склад проєкту обговорюємо індивідуально. Розкажіть про своє завдання на зустрічі — разом сформуємо оптимальний пакет.',
      },
    ],
    serviceName: "Дизайн інтер'єру під ключ",
    serviceDescription:
      "Авторський дизайн інтер'єру квартир, будинків та комерційних приміщень у Києві. Стиль МУАС. Повний проєкт від концепції до специфікацій.",
    areaServed: ['Київ', 'Україна'],
    unitText: 'за м²',
    offerDescription: "Повний дизайн-проєкт — від $60/м². Мінімальний проєкт 120 м² (від $7 200).",
  },
  en: {
    metaTitle: 'Turnkey Interior Design in Kyiv — bureau X',
    metaDescription:
      'Commission an interior design project for an apartment, house or commercial space in Kyiv. bureau X — a signature approach, the MUAS style, full support from sketch to build.',
    breadcrumbHome: 'Home',
    breadcrumbServices: 'Services',
    breadcrumbSelf: 'Interior design',
    servicesPath: '/en/services',
    selfPath: '/en/services/interior-design',
    eyebrow: 'Services',
    h1: 'Turnkey interior design in Kyiv',
    introP1:
      'Interior design at bureau X is a complete, build-ready project: space planning, 3D visualizations, working drawings and specifications. For apartments, houses and commercial spaces — in Kyiv and remotely across Ukraine. Fees start at $60/m², the minimum project is 120 m² (from $7,200), and a 60–100 m² apartment takes 8–12 weeks.',
    introP2:
      'A signature approach in the MUAS style — from the first brief to renovation-ready specifications. Every project is developed individually: around the client’s personality, the function of the space and their way of living.',
    ctaLabel: 'Discuss your interior',
    includesTitle: 'What the design project includes',
    includes: [
      'Site survey and measured plan',
      'Space planning and zoning',
      'Concept: moodboard and color palette',
      '3D visualizations of key zones',
      'Working drawings (layouts, sections, diagrams)',
      'Specifications for materials, furniture and decor',
    ],
    muasTitle: 'The signature MUAS style',
    muasStart: 'MUAS — the Young Ukrainian Architectural Style — is the signature concept of bureau',
    muasEnd:
      '. We combine contemporary aesthetics with Ukrainian traditions and symbols. Three principles: personal — about you, functional — about the place, meaningful — about what the space should stand for.',
    objectsTitle: 'What we design for',
    objects: [
      { t: 'Apartments', d: 'From studios to large apartments. We optimize the layout around your way of living.' },
      { t: 'Private houses', d: 'Spatial and multi-level solutions, coordinated with the architectural project.' },
      { t: 'Cottages', d: 'A comprehensive approach — from the facade to the lounge.' },
      { t: 'Commercial spaces', d: 'Restaurants, offices, showrooms — where design directly drives the business.' },
    ],
    projectsTitle: 'Completed interiors',
    allProjects: 'All projects →',
    faqs: [
      {
        id: 'di-1',
        question: 'What does an interior design project include?',
        answer:
          'A complete project includes: a measured plan, zoning, a concept (moodboard and palette), 3D visualizations of key zones, working drawings (floor and wall layouts, lighting diagrams, sections) and specifications for materials and furniture. Author supervision and procurement are available on request.',
      },
      {
        id: 'di-2',
        question: 'How much does interior design cost in Kyiv in 2026?',
        answer:
          'Interior design at bureau X starts at $60/m². The minimum project is calculated as 120 m² (from $7,200). Author supervision of the build is $800/month, billed separately from the project. We quote the exact fee after a short brief.',
      },
      {
        id: 'di-3',
        question: 'How long does a design project for an apartment or house take?',
        answer:
          'A design project for a 60–100 m² apartment takes roughly 8–12 weeks. Timelines depend on the area and complexity; deadlines are fixed in the contract.',
      },
      {
        id: 'di-4',
        question: 'What is author supervision and why is it needed?',
        answer:
          'Author supervision means controlling the build on site: the studio makes sure the result matches the drawings and specifications. It costs $800/month (Kyiv; other cities by arrangement), separate from the project fee. Supervision is what keeps the build from drifting away from the design.',
      },
      {
        id: 'di-5',
        question: 'Can a design project be done remotely?',
        answer:
          'Yes, we design remotely across Ukraine and abroad. Author supervision in other cities is discussed individually.',
      },
      {
        id: 'di-6',
        question: 'Can I order just the space planning without 3D?',
        answer:
          'Yes, the project scope is tailored individually. Tell us about your task at the first meeting — together we will shape the right package.',
      },
    ],
    serviceName: 'Turnkey interior design',
    serviceDescription:
      'Signature interior design for apartments, houses and commercial spaces in Kyiv. The MUAS style. A complete project from concept to specifications.',
    areaServed: ['Kyiv', 'Ukraine'],
    unitText: 'per m²',
    offerDescription: 'Complete design project — from $60/m². Minimum project 120 m² (from $7,200).',
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
    alternates: seoAlternates('/posluhy/dyzajn-intereru', locale),
  };
}

export default async function DyzajnInteruruPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  const projects = await getProjectsByCategory('PRIVATE', 3, locale).catch(() => []);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: locale === 'en' ? `${SITE_URL}/en` : SITE_URL },
      { '@type': 'ListItem', position: 2, name: c.breadcrumbServices, item: `${SITE_URL}${c.servicesPath}` },
      { '@type': 'ListItem', position: 3, name: c.breadcrumbSelf, item: `${SITE_URL}${c.selfPath}` },
    ],
  };

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: c.serviceName,
    description: c.serviceDescription,
    provider: { '@type': 'LocalBusiness', name: 'bureau X', url: SITE_URL },
    areaServed: [...c.areaServed],
    url: `${SITE_URL}${c.selfPath}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        minPrice: 60,
        priceCurrency: 'USD',
        unitText: c.unitText,
      },
      description: c.offerDescription,
    },
  };

  return (
    <>
      <script
        id="ld-bc-di"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        id="ld-svc-di"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />

      {/* Breadcrumb */}
      <nav className="container-wide pt-28 pb-0 text-xs text-muted lg:pt-36" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-ink transition-colors">{c.breadcrumbHome}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/posluhy" className="hover:text-ink transition-colors">{c.breadcrumbServices}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">{c.breadcrumbSelf}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-wide pt-8 pb-16 lg:pb-24">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
          {c.h1}
        </h1>
        {/* Прямий відповідь-абзац для AEO: що це, для кого, скільки коштує */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed">
          {c.introP1}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          {c.introP2}
        </p>
        <div className="mt-8">
          <CtaButton
            kind="estimate"
            className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
          >
            <span>⟶</span> {c.ctaLabel}
          </CtaButton>
        </div>
      </section>

      {/* Що входить */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.includesTitle}</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 pt-8 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {c.includes.map((item, i) => (
            <Reveal key={item} delay={i * 50}>
              <div className="flex items-start gap-4 py-3 pr-6">
                <span className="mt-0.5 shrink-0 text-[10px] uppercase tracking-[0.28em] text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* МУАС */}
      <section className="bg-coal py-16 text-paper lg:py-24">
        <div className="container-wide">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.muasTitle}</h2>
          </Reveal>
          <Reveal delay={120}>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              {c.muasStart} <em>X</em>{c.muasEnd}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Для яких об'єктів */}
      <section className="container-wide py-16 lg:py-24">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.objectsTitle}</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line sm:grid-cols-2">
          {c.objects.map((o, i) => (
            <Reveal key={o.t} delay={i * 60}>
              <div className="py-4 pr-10">
                <h3 className="display-xl text-lg font-normal">{o.t}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{o.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Реалізовані інтер'єри */}
      {projects.length > 0 && (
        <section className="container-wide py-16 lg:py-24 border-t border-line">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.projectsTitle}</h2>
              <Link
                href="/projects"
                className="hidden text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink sm:block"
              >
                {c.allProjects}
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8 sm:hidden">
            <Link href="/projects" className="text-xs uppercase tracking-widest text-muted hover:text-ink">
              {c.allProjects}
            </Link>
          </div>
        </section>
      )}

      {/* Pricing */}
      <PricingBlock />

      {/* Process */}
      <div className="border-t border-line">
        <HowWeWork />
      </div>

      {/* FAQ */}
      <div className="border-t border-line">
        <Faq faqs={[...c.faqs]} />
      </div>

      <FinalCta />
    </>
  );
}
