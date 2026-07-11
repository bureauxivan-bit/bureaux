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

type FaqItem = { id: string; question: string; answer: string };

// Page-specific copy lives next to the page (shared UI strings live in
// src/messages). uk is the source text; en is the adapted translation.
const COPY = {
  uk: {
    metaTitle: 'Архітектурне проєктування у Києві — bureau X',
    metaDescription:
      'Проєктування приватних будинків, котеджів, комерційних об\'єктів у Київській та інших областях. bureau X — авторський підхід, досвід 5+ котеджних містечок.',
    breadcrumbHome: 'Головна',
    breadcrumbServices: 'Послуги',
    breadcrumbSelf: 'Архітектурне проєктування',
    servicesPath: '/posluhy',
    selfPath: '/posluhy/arkhitektura',
    faqs: [
      {
        id: 'arh-1',
        question: 'Що входить в архітектурний проєкт?',
        answer:
          'Ескіз, архітектурні та конструктивні рішення, робочі креслення для будівництва й дозволу. Комплект, з яким заходять на майданчик без перепитувань.',
      },
      {
        id: 'arh-2',
        question: 'Скільки коштує архітектурне проєктування?',
        answer:
          'Від $40/м² — повний проєкт від концепції до дозволу на будівництво. Точну цифру називаємо після брифу: залежить від типу об\'єкта, площі й складності.',
      },
      {
        id: 'arh-3',
        question: 'Скільки часу займає архітектурний проєкт?',
        answer:
          'Від 1 місяця залежно від об\'єкта. Етапи зафіксовані — ви бачите проміжний результат, а не чекаєте наосліп.',
      },
      {
        id: 'arh-4',
        question: 'Ви проєктуєте по всій Україні?',
        answer:
          'Так, і за кордоном. Маємо досвід котеджних містечок і комплексів у Карпатах та Закарпатті. Проєктування дистанційне; авторський нагляд поза Києвом — переговорок за запитом.',
      },
      {
        id: 'arh-5',
        question: 'Можна замовити тільки архітектуру без дизайну інтер\'єру?',
        answer:
          'Так. Але коли архітектуру й інтер\'єр веде одне бюро, об\'єкт виходить цілісним, а ви не пояснюєте двом командам те саме двічі.',
      },
    ] as FaqItem[],
    projectTypes: [
      { t: 'Приватні будинки', d: 'Від невеликих дачних до великих заміських резиденцій — форма, що працює на краєвид і на спосіб життя.' },
      { t: 'Котеджні містечка', d: 'Досвід 5+ комплексів: генплан, посадка, типові проєкти, єдина архітектурна мова на все містечко.' },
      { t: 'Комерційні об\'єкти', d: 'Ресторани, готелі, торгові й офісні будівлі — архітектура, що працює на бізнес із першого погляду.' },
      { t: 'Реконструкція', d: 'Перепланування, надбудови, реставрація фасадів та інтер\'єрів — друге життя об\'єкта без втрати характеру.' },
    ],
    includes: [
      'Ескізний проєкт — концепція та планування, зафіксований напрям.',
      'Архітектурні рішення — фасади, розрізи, вузли; те, як об\'єкт виглядає й тримається.',
      'Конструктивні рішення та розрахунки — щоб красиве стояло, а не тріщало.',
      'Робочі креслення для будівництва — комплект, готовий до дозволу й до бригади.',
    ],
    processSteps: [
      {
        title: 'Бриф',
        desc: 'Знайомство з ділянкою, об\'єктом і задачею. Виїзд або відеозустріч — фіксуємо вихідні дані.',
      },
      {
        title: 'Ескізний проєкт',
        desc: 'Концепція та планування, зафіксований напрям до погодження.',
      },
      {
        title: 'Архітектурні рішення',
        desc: 'Фасади, розрізи, вузли; те, як об\'єкт виглядає й тримається.',
      },
      {
        title: 'Робочі креслення',
        desc: 'Повний комплект для отримання дозволу й початку будівництва. Бригада заходить із документом, а не з питаннями.',
      },
      {
        title: 'Авторський нагляд',
        desc: 'Контроль реалізації на майданчику. Відповідаємо за відповідність проєкту.',
      },
    ] as WorkStep[],
    processNote:
      'Кожен етап фіксується в договорі. Зміна завдання після затвердження ескізу — окрема домовленість.',
    eyebrow: 'Послуги',
    h1: 'Архітектурне проєктування — від ескізу до дозволу на будівництво',
    introAnswer:
      'Архітектурне проєктування у bureau X — повний проєкт від ескізу до дозволу на будівництво: приватні будинки, котеджі, комерційні об\'єкти та котеджні містечка. Вартість — від $40/м², мінімальний проєкт — 120 м² (від $4 800), термін — від 1 місяця. Проєктуємо дистанційно по всій Україні та за кордоном.',
    introMuted:
      'Проєктуємо будинки, котеджі та комерційні об\'єкти, у яких український код закладено з фундаменту, а не наклеєно оздобленням. Натуральні матеріали, чесна форма, характер — від генплану до робочих креслень. Досвід 5+ котеджних містечок і 10 000+ м² реалізованого.',
    ctaLabel: 'Замовити архітектурний проєкт',
    whatWeDesignTitle: 'Що ми проєктуємо',
    whatWeDesignDesc: 'Беремося за об\'єкти, де архітектура вирішує, а не лише прикриває коробку.',
    includesTitle: 'Склад проєкту',
    includesDesc: 'Повний пакет, за яким будують, а не «щось узгодимо на місці».',
    muasTitle: 'Український код — з фундаменту',
    muasP1:
      'МУАС в архітектурі — це не орнамент на фасаді. Це натуральні матеріали, чесна форма й недосконалість, яка робить об\'єкт живим: дерево з фактурою, місцевий камінь, ручна робота там, де це видно.',
    muasP2:
      'МУАС — Молодий Український Архітектурний Стиль. Свого часу український модерн змінив архітектуру цілої епохи — це була нова хвиля. МУАС — така ж хвиля сьогодні: не регіональна примха, а повноцінна мова форми, яку ми хочемо зробити впізнаваною так само, як скандинавську чи японську.',
    builtTitle: 'Реалізовані об\'єкти',
    allProjects: 'Всі проєкти →',
    serviceLdName: 'Архітектурне проєктування',
    serviceLdDescription:
      'Проєктування приватних будинків, котеджів і комерційних об\'єктів. Від ескізу до повного пакету дозвільної документації. Авторський стиль МУАС.',
    serviceLdAreaServed: ['Київ', 'Україна'],
    serviceLdUnitText: 'за м²',
    serviceLdOfferDescription:
      'Повний архітектурний проєкт — від $40/м². Мінімальний проєкт 120 м² (від $4 800).',
  },
  en: {
    metaTitle: 'Architectural Design in Kyiv — bureau X',
    metaDescription:
      'Design of private houses, cottages and commercial buildings in the Kyiv region and across Ukraine. bureau X — a signature approach and 5+ cottage communities delivered.',
    breadcrumbHome: 'Home',
    breadcrumbServices: 'Services',
    breadcrumbSelf: 'Architectural design',
    servicesPath: '/en/services',
    selfPath: '/en/services/architecture',
    faqs: [
      {
        id: 'arh-1',
        question: 'What does an architectural project include?',
        answer:
          'Concept sketch, architectural and structural solutions, working drawings for construction and permits. A package the crew can start building from without follow-up questions.',
      },
      {
        id: 'arh-2',
        question: 'How much does architectural design cost?',
        answer:
          'From $40/m² for a complete project — from concept to construction permit. We quote the exact figure after the brief: it depends on the building type, area and complexity.',
      },
      {
        id: 'arh-3',
        question: 'How long does an architectural project take?',
        answer:
          'From 1 month, depending on the building. Milestones are fixed — you see intermediate results instead of waiting in the dark.',
      },
      {
        id: 'arh-4',
        question: 'Do you design across Ukraine?',
        answer:
          'Yes, and abroad. We have designed cottage communities and complexes in the Carpathians and Zakarpattia. Design work is remote; author supervision outside Kyiv is arranged on request.',
      },
      {
        id: 'arh-5',
        question: 'Can I order architecture only, without interior design?',
        answer:
          'Yes. But when one studio handles both the architecture and the interior, the building comes out coherent — and you don’t explain the same brief to two teams twice.',
      },
    ] as FaqItem[],
    projectTypes: [
      { t: 'Private houses', d: 'From compact country homes to large suburban residences — form that works for the view and for the way you live.' },
      { t: 'Cottage communities', d: '5+ complexes delivered: master plan, siting, standard house designs, one architectural language across the whole community.' },
      { t: 'Commercial buildings', d: 'Restaurants, hotels, retail and office buildings — architecture that works for the business at first sight.' },
      { t: 'Reconstruction', d: 'Replanning, extensions, restoration of facades and interiors — a second life for a building without losing its character.' },
    ],
    includes: [
      'Concept design — layout and planning, a direction fixed on paper.',
      'Architectural solutions — facades, sections, details; how the building looks and holds together.',
      'Structural solutions and calculations — so the beautiful stands rather than cracks.',
      'Working drawings for construction — a package ready for the permit and for the crew.',
    ],
    processSteps: [
      {
        title: 'Brief',
        desc: 'We get to know the site, the building and the task. A site visit or video call — we record the initial data.',
      },
      {
        title: 'Concept design',
        desc: 'Concept and planning, a fixed direction for approval.',
      },
      {
        title: 'Architectural solutions',
        desc: 'Facades, sections, details; how the building looks and holds together.',
      },
      {
        title: 'Working drawings',
        desc: 'A complete package for obtaining the permit and starting construction. The crew arrives with a document, not with questions.',
      },
      {
        title: 'Author supervision',
        desc: 'On-site control of the build. We answer for compliance with the project.',
      },
    ] as WorkStep[],
    processNote:
      'Every stage is fixed in the contract. Changing the task after the concept is approved is a separate agreement.',
    eyebrow: 'Services',
    h1: 'Architectural design — from sketch to construction permit',
    introAnswer:
      'Architectural design at bureau X is a complete project from sketch to construction permit: private houses, cottages, commercial buildings and cottage communities. Pricing from $40/m², minimum project 120 m² (from $4,800), timeline from 1 month. We design remotely across Ukraine and abroad.',
    introMuted:
      'We design houses, cottages and commercial buildings where the Ukrainian code is built into the foundation — not glued on as decoration. Natural materials, honest form, character — from master plan to working drawings. 5+ cottage communities and 10,000+ m² delivered.',
    ctaLabel: 'Order an architectural project',
    whatWeDesignTitle: 'What we design',
    whatWeDesignDesc: 'We take on buildings where architecture makes the difference — not just dresses up a box.',
    includesTitle: 'What the project includes',
    includesDesc: 'A complete package to build from — not “we’ll sort it out on site”.',
    muasTitle: 'Ukrainian code — from the foundation up',
    muasP1:
      'MUAS in architecture is not ornament on a facade. It is natural materials, honest form and the imperfection that makes a building feel alive: wood with visible grain, local stone, handwork where it shows.',
    muasP2:
      'MUAS stands for Young Ukrainian Architectural Style. Ukrainian modernism once changed the architecture of an entire era — it was a new wave. MUAS is that wave today: not a regional quirk but a full-fledged language of form we want to make as recognizable as Scandinavian or Japanese.',
    builtTitle: 'Completed projects',
    allProjects: 'All projects →',
    serviceLdName: 'Architectural design',
    serviceLdDescription:
      'Design of private houses, cottages and commercial buildings. From sketch to a complete permit documentation package. Signature MUAS style.',
    serviceLdAreaServed: ['Kyiv', 'Ukraine'],
    serviceLdUnitText: 'per m²',
    serviceLdOfferDescription:
      'Complete architectural project — from $40/m². Minimum project 120 m² (from $4,800).',
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
    alternates: seoAlternates('/posluhy/arkhitektura', locale),
  };
}

export default async function ArkhitekturaPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  const projects = await getProjectsByCategory('ARCHITECTURE', 3, locale).catch(() => []);

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
    name: c.serviceLdName,
    description: c.serviceLdDescription,
    provider: { '@type': 'LocalBusiness', name: 'bureau X', url: SITE_URL },
    areaServed: c.serviceLdAreaServed,
    url: `${SITE_URL}${c.selfPath}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        minPrice: 40,
        priceCurrency: 'USD',
        unitText: c.serviceLdUnitText,
      },
      description: c.serviceLdOfferDescription,
    },
  };

  return (
    <>
      <script
        id="ld-bc-arh"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        id="ld-svc-arh"
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
          {c.introAnswer}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          {c.introMuted}
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

      {/* Що ми проєктуємо */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.whatWeDesignTitle}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {c.whatWeDesignDesc}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line sm:grid-cols-2">
          {c.projectTypes.map((o, i) => (
            <Reveal key={o.t} delay={i * 60}>
              <div className="py-4 pr-10">
                <h3 className="display-xl text-lg font-normal">{o.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Склад проєкту */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.includesTitle}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {c.includesDesc}
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

      {/* МУАС в архітектурі */}
      <section className="bg-coal py-16 text-paper lg:py-24">
        <div className="container-wide">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.muasTitle}</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              {c.muasP1}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/50">
              {c.muasP2}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Реалізовані об'єкти */}
      {projects.length > 0 && (
        <section className="container-wide py-16 lg:py-24 border-t border-line">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.builtTitle}</h2>
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
        </section>
      )}

      {/* Pricing */}
      <PricingBlock />

      {/* Process */}
      <div className="border-t border-line">
        <HowWeWork steps={c.processSteps} note={c.processNote} />
      </div>

      {/* FAQ */}
      <div className="border-t border-line">
        <Faq faqs={c.faqs} />
      </div>

      <FinalCta />
    </>
  );
}
