import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { seoAlternates } from '@/i18n/seo';
import { Reveal } from '@/components/Reveal';
import { PricingBlock } from '@/components/PricingBlock';
import { HowWeWork, type WorkStep } from '@/components/HowWeWork';
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
    metaTitle: 'Ремонт та будівництво під ключ у Києві — bureau X',
    metaDescription:
      'Ремонт квартири та будинку під ключ у Києві від архітектурного бюро bureau X. Власна бригада, авторський нагляд, дизайн і ремонт — в одних руках.',
    breadcrumbHome: 'Головна',
    breadcrumbServices: 'Послуги',
    breadcrumbSelf: 'Ремонт під ключ',
    servicesPath: '/posluhy',
    selfPath: '/posluhy/remont-pid-klyuch',
    faqs: [
      {
        id: 'rem-1',
        question: 'Скільки коштує ремонт під ключ?',
        answer:
          'Вартість проєктування — від $60/м². Орієнтовний бюджет реалізації «під ключ» — від $1&nbsp;400/м²; фінальна цифра залежить від матеріалів і обсягу. Точний кошторис — після проєкту.',
      },
      {
        id: 'rem-2',
        question: 'Ви робите ремонт без свого проєкту?',
        answer:
          'Пріоритет — об\'єкти, де ми вели проєкт: так ми відповідаємо за результат повністю. Ремонт за чужим проєктом розглядаємо окремо.',
      },
      {
        id: 'rem-3',
        question: 'Хто контролює якість на об\'єкті?',
        answer:
          'Авторський нагляд — $800/міс (Київ; інша локація — переговорок). Це не формальність: саме нагляд не дає реалізації «поплисти» від проєкту.',
      },
      {
        id: 'rem-4',
        question: 'Скільки триває ремонт під ключ?',
        answer:
          'Залежить від площі й обсягу; терміни фіксуємо в договорі після проєкту. Не називаємо цифру «зі стелі» до того, як бачимо об\'єм.',
      },
      {
        id: 'rem-5',
        question: 'Ви працюєте з ручними речами українських майстрів?',
        answer:
          'Так, це наша фішка. Кераміка, різьба, ткані речі — маємо свою мережу ремісників і доводимо ці предмети до об\'єкта. Якщо у вас є свої майстри — підключаємо їх.',
      },
    ],
    includes: [
      'Проєкт і специфікація — те, за чим будують, без імпровізації на місці.',
      'Чорнові роботи — стяжка, електрика, сантехніка, вирівнювання; те, що приховано, але вирішує.',
      'Чистові роботи — за проєктом, а не «як вийде».',
      'Комплектація — матеріали, меблі, декор; підбираємо й доставляємо.',
      'Ручна робота українських майстрів — кераміка, різьба, ткані речі зі своєї мережі ремісників.',
      'Авторський нагляд — тримаємо якість реалізації, щоб на об\'єкті було як у проєкті.',
    ],
    processSteps: [
      {
        title: 'Бриф',
        desc: 'Знайомство, обговорення задачі, побажань і бюджету. Виїзд на об\'єкт або відеозустріч.',
      },
      {
        title: 'Проєкт і специфікація',
        desc: 'Планування, візуалізації, робочі креслення, специфікація матеріалів — до початку робіт.',
      },
      {
        title: 'Чорнові роботи',
        desc: 'Стяжка, електрика, сантехніка, вирівнювання. Те, що потім не видно, але від чого все залежить.',
      },
      {
        title: 'Чистові роботи',
        desc: 'Реалізація за проєктом: покриття, стіни, двері, деталі — без відступів від специфікації.',
      },
      {
        title: 'Комплектація',
        desc: 'Підбір і замовлення меблів, світла, текстилю, предметів ручної роботи. Доставляємо.',
      },
      {
        title: 'Авторський нагляд',
        desc: 'Контроль реалізації на майданчику. Відповідаємо за відповідність результату проєкту.',
      },
    ],
    serviceName: 'Ремонт та будівництво під ключ',
    serviceDescription:
      'Ремонт квартири та будинку під ключ у Києві. Власна бригада, авторський нагляд, дизайн і реалізація в одних руках.',
    areaServed: ['Київ', 'Київська область'],
    offerTurnkeyName: 'Реалізація «під ключ» (проєкт + ремонт)',
    offerTurnkeyUnit: 'за м²',
    offerSupervisionName: 'Авторський нагляд',
    offerSupervisionUnit: 'на місяць',
    offerSupervisionDesc: 'Київ; інші міста та країни — перерахунок за запитом.',
    eyebrow: 'Послуги',
    h1: 'Ремонт під ключ у Києві — від проєкту до готового простору',
    heroAnswer:
      'Ремонт під ключ у bureau X — це проєкт і реалізація в одних руках: від креслень до комплектації та авторського нагляду. Орієнтовний бюджет «під ключ» (проєкт + ремонт) — від $1 400/м², авторський нагляд — $800/міс. Працюємо у Києві та Київській області.',
    heroSecondary:
      'Дизайн і ремонт в одних руках — нікому нічого не потрібно пояснювати двічі. Ми доводимо проєкт до реалізації: матеріали, майстри, ручна мережа українських ремісників — все під нашим контролем, а не «підберете самі».',
    ctaLabel: 'Обговорити ремонт під ключ',
    includesTitle: 'Що входить',
    includesSub: 'Одна команда відповідає за все — від креслення до останнього плінтуса.',
    positionText:
      'Найдорожче в ремонті — переробки. Вони виникають там, де проєкт і бригада — різні люди, які одне одного не чують. У нас проєкт і реалізація — одні руки, тому переробок менше, а терміни чіткі.',
    muasTitle: 'Український стиль, доведений до реалізації',
    muasText1:
      'Стиль легко намалювати й важко збудувати. Ми доводимо український код до готового простору: недосконале дерево, мазанка, солома, барельєфи, ручні речі майстрів — не рендер, а матеріал під рукою.',
    muasText2:
      'МУАС — Молодий Український Архітектурний Стиль. Не набір символів на стінах, а спосіб будувати: натуральне й ручне замість індустріального й шаблонного. Ми хочемо, щоб цю мову говорили не лише ми — і щоб вона стала впізнаваною так само, як скандинавська чи японська.',
    worksTitle: 'Реалізовані роботи',
    worksAll: 'Всі проєкти →',
    howWeWorkNote:
      'Терміни та кошторис фіксуємо в договорі після проєкту. Зміни в процесі — окрема домовленість.',
  },
  en: {
    metaTitle: 'Turnkey Renovation & Construction in Kyiv — bureau X',
    metaDescription:
      'Turnkey apartment and house renovation in Kyiv by architecture studio bureau X. Our own crew, architect supervision, design and construction in one team.',
    breadcrumbHome: 'Home',
    breadcrumbServices: 'Services',
    breadcrumbSelf: 'Turnkey renovation',
    servicesPath: '/en/services',
    selfPath: '/en/services/turnkey-renovation',
    faqs: [
      {
        id: 'rem-1',
        question: 'How much does a turnkey renovation cost?',
        answer:
          'Design starts at $60/m². A ballpark turnkey budget (design + build) starts at $1,400/m²; the final figure depends on materials and scope. An exact estimate follows the design stage.',
      },
      {
        id: 'rem-2',
        question: 'Do you build without your own design project?',
        answer:
          'We prioritize projects we designed ourselves — that is how we take full responsibility for the result. Building to someone else\'s design is considered case by case.',
      },
      {
        id: 'rem-3',
        question: 'Who controls quality on site?',
        answer:
          'Architect supervision — $800/month (Kyiv; other locations negotiable). It is no formality: supervision is what keeps the build from drifting away from the design.',
      },
      {
        id: 'rem-4',
        question: 'How long does a turnkey renovation take?',
        answer:
          'It depends on the area and scope; timelines are fixed in the contract after the design stage. We never quote a number out of thin air before we see the actual volume of work.',
      },
      {
        id: 'rem-5',
        question: 'Do you work with handmade pieces by Ukrainian artisans?',
        answer:
          'Yes — it is our signature. Ceramics, wood carving, woven textiles: we have our own network of artisans and bring these pieces all the way to the site. If you have your own makers, we bring them on board.',
      },
    ],
    includes: [
      'Design and specification — the documents the build follows, with no on-site improvisation.',
      'Rough works — screed, wiring, plumbing, leveling; hidden from view, yet decisive.',
      'Finishing works — built to the design, not "however it turns out".',
      'Procurement — materials, furniture, decor; we source and deliver.',
      'Handmade work by Ukrainian artisans — ceramics, carving, woven pieces from our own network of makers.',
      'Architect supervision — we keep the build true to the design, so the site matches the drawings.',
    ],
    processSteps: [
      {
        title: 'Brief',
        desc: 'Introductions, the task, your wishes and budget. A site visit or a video call.',
      },
      {
        title: 'Design & specification',
        desc: 'Layouts, visualizations, working drawings and a material specification — before work begins.',
      },
      {
        title: 'Rough works',
        desc: 'Screed, wiring, plumbing, leveling. Invisible later, yet everything depends on it.',
      },
      {
        title: 'Finishing works',
        desc: 'Built to the design: finishes, walls, doors, details — no deviations from the specification.',
      },
      {
        title: 'Procurement',
        desc: 'Selecting and ordering furniture, lighting, textiles and handmade pieces. Delivered to site.',
      },
      {
        title: 'Architect supervision',
        desc: 'Quality control on site. We answer for the result matching the design.',
      },
    ],
    serviceName: 'Turnkey renovation & construction',
    serviceDescription:
      'Turnkey apartment and house renovation in Kyiv. Our own crew, architect supervision, design and delivery in one team.',
    areaServed: ['Kyiv', 'Kyiv region'],
    offerTurnkeyName: 'Turnkey delivery (design + renovation)',
    offerTurnkeyUnit: 'per m²',
    offerSupervisionName: 'Architect supervision',
    offerSupervisionUnit: 'per month',
    offerSupervisionDesc: 'Kyiv; other cities and countries — recalculated on request.',
    eyebrow: 'Services',
    h1: 'Turnkey renovation in Kyiv — from design to a finished space',
    heroAnswer:
      'A turnkey renovation at bureau X means design and delivery in one team: from drawings to procurement and architect supervision. A ballpark turnkey budget (design + renovation) starts at $1,400/m²; architect supervision is $800/month. We work in Kyiv and the Kyiv region.',
    heroSecondary:
      'Design and construction in one team — nothing has to be explained twice. We take the project all the way to reality: materials, craftsmen, our own network of Ukrainian artisans — everything under our control, never "source it yourself".',
    ctaLabel: 'Discuss a turnkey renovation',
    includesTitle: 'What is included',
    includesSub: 'One team is responsible for everything — from the drawing to the last skirting board.',
    positionText:
      'The most expensive part of any renovation is rework. It happens where the designers and the crew are different people who do not hear each other. With us, design and delivery are one team — less rework, clear timelines.',
    muasTitle: 'Ukrainian style, built for real',
    muasText1:
      'A style is easy to render and hard to build. We take the Ukrainian code all the way to a finished space: imperfect wood, clay plaster, straw, bas-reliefs, handmade pieces by artisans — not a render, but material at hand.',
    muasText2:
      'MUAS — the Young Ukrainian Architectural Style. Not a set of symbols on the walls, but a way of building: natural and handmade instead of industrial and generic. We want this language to be spoken beyond our studio — and to become as recognizable as Scandinavian or Japanese.',
    worksTitle: 'Completed projects',
    worksAll: 'All projects →',
    howWeWorkNote:
      'Timelines and budget are fixed in the contract after the design stage. Changes along the way are agreed separately.',
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
    alternates: seoAlternates('/posluhy/remont-pid-klyuch', locale),
  };
}

export default async function RemontPidKlyuchPage({ params: { locale } }: { params: { locale: string } }) {
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
    offers: [
      {
        '@type': 'Offer',
        name: c.offerTurnkeyName,
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          minPrice: 1400,
          priceCurrency: 'USD',
          unitText: c.offerTurnkeyUnit,
        },
      },
      {
        '@type': 'Offer',
        name: c.offerSupervisionName,
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 800,
          priceCurrency: 'USD',
          unitText: c.offerSupervisionUnit,
        },
        description: c.offerSupervisionDesc,
      },
    ],
  };

  return (
    <>
      <script
        id="ld-bc-rem"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        id="ld-svc-rem"
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
          {c.heroAnswer}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          {c.heroSecondary}
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
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {c.includesSub}
          </p>
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

      {/* Позиція + МУАС */}
      <section className="bg-coal py-16 text-paper lg:py-24">
        <div className="container-wide">
          <Reveal>
            <p className="max-w-2xl text-base leading-relaxed text-paper/70">
              {c.positionText}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-xl mt-12 text-[clamp(1.5rem,3vw,2.5rem)]">
              {c.muasTitle}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              {c.muasText1}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/50">
              {c.muasText2}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Реалізовані роботи */}
      {projects.length > 0 && (
        <section className="container-wide py-16 lg:py-24 border-t border-line">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.worksTitle}</h2>
              <Link
                href="/projects"
                className="hidden text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink sm:block"
              >
                {c.worksAll}
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
        </section>
      )}

      {/* Pricing */}
      <PricingBlock />

      {/* Process */}
      <div className="border-t border-line">
        <HowWeWork steps={[...c.processSteps] as WorkStep[]} note={c.howWeWorkNote} />
      </div>

      {/* FAQ */}
      <div className="border-t border-line">
        <Faq faqs={[...c.faqs]} />
      </div>

      <FinalCta />
    </>
  );
}
