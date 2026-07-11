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
    metaTitle: 'Дизайн комерційних приміщень у Києві — bureau X',
    metaDescription:
      'Дизайн ресторанів, кафе, офісів, магазинів та готелів у Києві від bureau X. Розуміємо бізнес-логіку простору, реалізуємо під ключ.',
    homePath: '',
    servicesPath: '/posluhy',
    selfPath: '/posluhy/komertsiini-prymishchennia',
    breadcrumbHome: 'Головна',
    breadcrumbServices: 'Послуги',
    breadcrumbSelf: 'Комерційні приміщення',
    eyebrow: 'Послуги',
    h1: 'Дизайн комерційних приміщень — ресторани, готелі, офіси',
    introMain:
      "Дизайн комерційних приміщень у bureau X — ресторани, кафе, готелі, офіси й шоуруми у Києві та по всій Україні. Повний проєкт під реалізацію — від $60/м². Терміни залежать від площі й складності — фіксуємо після брифу.",
    introMuted:
      "Комерційний інтер'єр має заробляти: приводити відвідувача, утримувати його й змушувати повертатися. Тут ми ставимо сміливі рішення, вау-зони й фотозони — з українським характером, який вирізняє вас із десятка однакових.",
    ctaButton: 'Обговорити комерційний проєкт',
    typesHeading: 'Типи просторів',
    typesSub: 'Простір, який працює на трафік і на впізнаваність, а не просто «гарний».',
    objectTypes: [
      {
        t: 'Ресторани й кафе',
        d: 'Атмосфера, за якою повертаються й фотографуються. Наш досвід — від сімейних ресторанів до закладів із характером.',
      },
      {
        t: 'Готелі й бази відпочинку',
        d: 'Комплекси в Карпатах та Закарпатті — простір, що продає враження, а не лише ночівлю.',
      },
      {
        t: 'Офіси й коворкінги',
        d: 'Простір, який працює на бренд і на людей усередині.',
      },
    ],
    positionP:
      'Відвідувач обирає очима за секунди. Ми проєктуємо ті секунди: точку входу, маршрут погляду, зони, які хочеться зняти й показати. Український код тут — не етнографія, а те, що робить вас впізнаваним, а не «ще одним лотком».',
    muasHeading: 'Український характер, який працює на бізнес',
    muasP1:
      "У комерції МУАС розкривається найсміливіше: натуральні матеріали, ручна робота майстрів і сучасна трактовка українського — те, чого немає в мережевих інтер'єрах «під копірку».",
    muasP2:
      'МУАС — Молодий Український Архітектурний Стиль. Ми його назвали й хочемо масштабувати: щоб простори з українським характером ставали нормою, а не виключенням — у ресторанах, готелях, офісах по всій країні.',
    projectsHeading: 'Проєкти',
    allProjects: 'Всі проєкти →',
    processSteps: [
      {
        title: 'Бриф',
        desc: 'Вивчаємо бізнес-задачу, цільову аудиторію, потік відвідувачів і операційні процеси.',
      },
      {
        title: 'Концепт і зонування',
        desc: 'Функціональний план, маршрут погляду, вау-зони — фіксуємо напрям до погодження.',
      },
      {
        title: 'Візуалізації',
        desc: '3D-рендери ключових зон. Ви бачите результат до початку будівництва.',
      },
      {
        title: 'Робочі креслення',
        desc: 'Повний пакет документації під реалізацію: розкладки, розрізи, специфікації.',
      },
      {
        title: 'Комплектація',
        desc: 'Підбір матеріалів, меблів, освітлення, предметів ручної роботи. Доставляємо.',
      },
      {
        title: 'Здача',
        desc: "Авторський нагляд на об'єкті — контролюємо відповідність проєкту до фінального результату.",
      },
    ],
    processNote:
      'Терміни та кошторис фіксуємо після брифу. Кардинальна зміна концепції після погодження — окрема домовленість.',
    faqs: [
      {
        id: 'kom-1',
        question: 'Скільки коштує дизайн комерційного приміщення?',
        answer:
          'Від $60/м² — повний проєкт під реалізацію. Комерція складніша за житло функціонально, тому точну цифру називаємо після брифу за обсягом і задачею.',
      },
      {
        id: 'kom-2',
        question: 'Ви робите проєкти, які приваблюють відвідувачів?',
        answer:
          "Так, це закладаємо свідомо: вау-зони, фотозони, маршрут погляду. Комерційний інтер'єр має повертати вкладене, а не лише подобатися.",
      },
      {
        id: 'kom-3',
        question: 'У вас є досвід у HoReCa?',
        answer:
          'Так — ресторани й комплекси відпочинку, зокрема в Карпатах та Закарпатті. Проєкти з людьми та фото — є в портфоліо.',
      },
      {
        id: 'kom-4',
        question: 'Скільки часу займає комерційний проєкт?',
        answer:
          'Залежить від площі й складності; фіксуємо терміни після брифу. Етапність прозора — ви не чекаєте в тиші.',
      },
      {
        id: 'kom-5',
        question: "Чи обов'язково робити «українським»?",
        answer:
          'Ні. Наш почерк — характер і натуральність; етнічні символи додаємо стільки, скільки треба бренду. Простір усе одно виходить нашим.',
      },
    ],
    serviceName: 'Дизайн комерційних приміщень',
    serviceDescription:
      'Дизайн та реалізація комерційних просторів у Києві: ресторани, офіси, магазини, готелі. Розуміємо бізнес-логіку простору.',
    areaServed: ['Київ', 'Україна'],
    unitText: 'за м²',
    offerDescription: 'Повний проєкт під реалізацію — від $60/м².',
  },
  en: {
    metaTitle: 'Commercial Space Design in Kyiv — bureau X',
    metaDescription:
      'Design of restaurants, cafés, offices, stores and hotels in Kyiv by bureau X. We understand the business logic of a space and deliver it turnkey.',
    homePath: '/en',
    servicesPath: '/en/services',
    selfPath: '/en/services/commercial-spaces',
    breadcrumbHome: 'Home',
    breadcrumbServices: 'Services',
    breadcrumbSelf: 'Commercial spaces',
    eyebrow: 'Services',
    h1: 'Commercial space design — restaurants, hotels, offices',
    introMain:
      'Commercial space design at bureau X — restaurants, cafés, hotels, offices and showrooms in Kyiv and across Ukraine. A complete build-ready project from $60/m². Timelines depend on area and complexity — we fix them after the brief.',
    introMuted:
      'A commercial interior has to earn: attract visitors, hold them and bring them back. This is where we go bold — statement solutions, wow zones and photo spots — with a Ukrainian character that sets you apart from a dozen identical places.',
    ctaButton: 'Discuss a commercial project',
    typesHeading: 'Types of spaces',
    typesSub: 'A space that works for traffic and recognition — not one that is merely “nice”.',
    objectTypes: [
      {
        t: 'Restaurants & cafés',
        d: 'An atmosphere people come back to and photograph. Our experience spans family restaurants to venues with real character.',
      },
      {
        t: 'Hotels & resorts',
        d: 'Complexes in the Carpathians and Zakarpattia — spaces that sell an experience, not just a night’s stay.',
      },
      {
        t: 'Offices & coworking',
        d: 'A space that works for the brand and for the people inside it.',
      },
    ],
    positionP:
      'Visitors choose with their eyes in seconds. We design those seconds: the entry point, the route the eye travels, the zones people want to shoot and share. The Ukrainian code here is not ethnography — it is what makes you recognizable instead of just another storefront.',
    muasHeading: 'Ukrainian character that works for business',
    muasP1:
      'Commercial projects are where MUAS gets boldest: natural materials, handcrafted work and a contemporary take on Ukrainian identity — everything cookie-cutter chain interiors lack.',
    muasP2:
      'MUAS stands for Young Ukrainian Architectural Style. We named it and want to scale it — so that spaces with Ukrainian character become the norm rather than the exception, in restaurants, hotels and offices across the country.',
    projectsHeading: 'Projects',
    allProjects: 'All projects →',
    processSteps: [
      {
        title: 'Brief',
        desc: 'We study the business goal, target audience, visitor flow and day-to-day operations.',
      },
      {
        title: 'Concept & zoning',
        desc: 'Functional plan, the route the eye travels, wow zones — the direction is fixed and approved.',
      },
      {
        title: 'Visualizations',
        desc: '3D renders of the key zones. You see the result before construction begins.',
      },
      {
        title: 'Working drawings',
        desc: 'A complete build-ready documentation package: layouts, sections, specifications.',
      },
      {
        title: 'Procurement',
        desc: 'Selection of materials, furniture, lighting and handcrafted pieces. Delivered to site.',
      },
      {
        title: 'Handover',
        desc: 'Author supervision on site — we keep the built result true to the project through to completion.',
      },
    ],
    processNote:
      'Timeline and budget are fixed after the brief. A fundamental concept change after approval is a separate agreement.',
    faqs: [
      {
        id: 'kom-1',
        question: 'How much does commercial space design cost?',
        answer:
          'From $60/m² for a complete build-ready project. Commercial spaces are functionally more complex than residential, so we quote an exact figure after the brief, based on scope and task.',
      },
      {
        id: 'kom-2',
        question: 'Do you design spaces that attract visitors?',
        answer:
          'Yes, deliberately: wow zones, photo spots, a designed route for the eye. A commercial interior should return the investment, not just look good.',
      },
      {
        id: 'kom-3',
        question: 'Do you have HoReCa experience?',
        answer:
          'Yes — restaurants and resort complexes, including in the Carpathians and Zakarpattia. Projects with people and photos are in our portfolio.',
      },
      {
        id: 'kom-4',
        question: 'How long does a commercial project take?',
        answer:
          'It depends on area and complexity; we fix the timeline after the brief. The stages are transparent — you are never left waiting in silence.',
      },
      {
        id: 'kom-5',
        question: 'Does it have to look “Ukrainian”?',
        answer:
          'No. Our signature is character and natural materials; we add exactly as much ethnic symbolism as the brand needs. The space still comes out unmistakably ours.',
      },
    ],
    serviceName: 'Commercial space design',
    serviceDescription:
      'Design and turnkey delivery of commercial spaces in Kyiv: restaurants, offices, stores, hotels. We understand the business logic of a space.',
    areaServed: ['Kyiv', 'Ukraine'],
    unitText: 'per m²',
    offerDescription: 'Complete build-ready project — from $60/m².',
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
    alternates: seoAlternates('/posluhy/komertsiini-prymishchennia', locale),
  };
}

export default async function KomertsiiniPrymishchennyaPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  const projects = await getProjectsByCategory('COMMERCIAL', 3, locale).catch(() => []);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: `${SITE_URL}${c.homePath}` },
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
        id="ld-bc-kom"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        id="ld-svc-kom"
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
          {c.introMain}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          {c.introMuted}
        </p>
        <div className="mt-8">
          <CtaButton
            kind="estimate"
            className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
          >
            <span>⟶</span> {c.ctaButton}
          </CtaButton>
        </div>
      </section>

      {/* Типи просторів */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.typesHeading}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {c.typesSub}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line sm:grid-cols-2">
          {c.objectTypes.map((o, i) => (
            <Reveal key={o.t} delay={i * 60}>
              <div className="py-4 pr-10">
                <h3 className="display-xl text-lg font-normal">{o.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.d}</p>
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
              {c.positionP}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-xl mt-12 text-[clamp(1.5rem,3vw,2.5rem)]">
              {c.muasHeading}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              {c.muasP1}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/50">
              {c.muasP2}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Проєкти */}
      {projects.length > 0 && (
        <section className="container-wide py-16 lg:py-24 border-t border-line">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.projectsHeading}</h2>
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
        <HowWeWork steps={[...c.processSteps]} note={c.processNote} />
      </div>

      {/* FAQ */}
      <div className="border-t border-line">
        <Faq faqs={[...c.faqs]} />
      </div>

      <FinalCta />
    </>
  );
}
