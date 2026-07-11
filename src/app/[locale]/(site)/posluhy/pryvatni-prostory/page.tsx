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
    metaTitle: 'Дизайн приватних просторів — квартири, будинки, котеджі · bureau X Київ',
    metaDescription:
      "Дизайн інтер'єру квартири, приватного будинку або котеджу у Києві. bureau X — авторський стиль МУАС, повний цикл: концепція, проєкт, реалізація.",
    breadcrumbHome: 'Головна',
    breadcrumbServices: 'Послуги',
    breadcrumbSelf: 'Приватні простори',
    servicesPath: '/posluhy',
    selfPath: '/posluhy/pryvatni-prostory',
    serviceLdName: 'Дизайн приватних просторів',
    serviceLdDescription:
      "Дизайн інтер'єру квартир, будинків і котеджів у Києві. Авторський стиль МУАС, повний цикл від концепції до реалізації.",
    serviceLdAreaServed: ['Київ', 'Україна'],
    serviceLdUnitText: 'за м²',
    serviceLdOfferDescription:
      'Повний проєкт під реалізацію — від $60/м². Мінімальний проєкт 120 м² (від $7 200).',
    eyebrow: 'Послуги',
    h1: 'Дизайн приватних просторів — квартири, будинки, резиденції',
    answer:
      'Дизайн приватних просторів у bureau X — квартири, будинки та резиденції з натуральних матеріалів і ручної роботи українських майстрів. Повний проєкт під реалізацію — від $60/м², мінімальний проєкт — 120 м². Термін — 1,5–3 місяці залежно від площі.',
    intro:
      "Дім, який схожий на вас, а не на каталог. Робимо характерні інтер'єри з натуральних матеріалів і ручної роботи українських майстрів — для тих, хто хоче не «як у всіх», а своє. Український код лишається, навіть коли символів у проєкті немає.",
    cta: 'Обговорити ваш простір',
    spacesTitle: 'Для яких просторів',
    spacesIntro:
      'Для тих, хто хоче простір із характером і готовий на щось сміливіше за «сучасну класику».',
    spaceTypes: [
      {
        t: 'Квартири та апартаменти',
        d: 'Небанальний інтер\'єр без етнографії — натуральність, фактура, ручна робота. Символи — стільки, скільки готові ви.',
      },
      {
        t: 'Приватні будинки',
        d: 'Простір, де український код розкривається повністю — від матеріалу до світла.',
      },
      {
        t: 'Резиденції та колекційні інтер\'єри',
        d: 'Для тих, хто збирає авторські речі й хоче простір, що звучить як ціле. Тут експериментуємо найглибше.',
      },
    ],
    positionP1:
      '«Сміливо» для нас — не про епатаж, а про чесність матеріалу й ручну роботу. Недосконале дерево, кераміка майстрів, ткані речі — те, що робить дім теплим і не схожим на студійний. Ми не малюємо вигаданий декор — ми доводимо реальні ручні речі до вашого простору.',
    positionH2: 'Український дім, а не музей',
    positionP2:
      'МУАС у приватному просторі — це захисток через натуральне й ручне, а не виставка з орнаментами. Дерево з недосконалістю, кераміка, тканина, символ як тихий акцент.',
    positionP3:
      "МУАС — Молодий Український Архітектурний Стиль. Свого часу модерн змінив те, як виглядали будинки й інтер'єри цілого покоління. МУАС — сучасна відповідь: не ностальгія за минулим, а нова мова, яка говорить про сьогоднішню Україну через матеріал і форму.",
    projectsTitle: 'Реалізовані проєкти',
    projectsAll: 'Всі проєкти →',
    faqs: [
      {
        id: 'priv-1',
        question: 'Скільки коштує дизайн квартири чи будинку?',
        answer:
          'Від $60/м² — повний проєкт під реалізацію (планування, візуалізація, креслення, специфікація). Точну цифру називаємо після короткого брифу.',
      },
      {
        id: 'priv-2',
        question: 'Я хочу сміливо, але без «українськості» — так можна?',
        answer:
          'Так. Більшість тих, хто так каже, не хоче орнаментів і символів — і це нормально. Натуральність, ручна робота й характер лишаються; простір виходить нашим, просто чистим у символах.',
      },
      {
        id: 'priv-3',
        question: 'Ви працюєте з ручними речами майстрів для дому?',
        answer:
          'Так. Кераміка, різьба, ткані речі — маємо свою мережу українських ремісників і закладаємо їхні предмети у проєкт. Ваших майстрів теж підключаємо.',
      },
      {
        id: 'priv-4',
        question: 'Скільки часу займає проєкт приватного інтер\'єру?',
        answer:
          '1,5–3 місяці залежно від площі. Етапи зафіксовані, ви бачите проміжний результат.',
      },
      {
        id: 'priv-5',
        question: 'Ви ведете проєкт до реалізації?',
        answer:
          'Так — можемо довести до ремонту під ключ і авторського нагляду. Дизайн і реалізація в одних руках означає менше переробок і чіткі терміни.',
      },
    ],
  },
  en: {
    metaTitle: 'Private Space Design — Apartments, Houses, Cottages · bureau X Kyiv',
    metaDescription:
      'Interior design for apartments, private houses and cottages in Kyiv. bureau X — the signature MUAS style, full cycle: concept, design project, realization.',
    breadcrumbHome: 'Home',
    breadcrumbServices: 'Services',
    breadcrumbSelf: 'Private spaces',
    servicesPath: '/en/services',
    selfPath: '/en/services/private-spaces',
    serviceLdName: 'Private space design',
    serviceLdDescription:
      'Interior design for apartments, houses and cottages in Kyiv. The signature MUAS style, full cycle from concept to realization.',
    serviceLdAreaServed: ['Kyiv', 'Ukraine'],
    serviceLdUnitText: 'per m²',
    serviceLdOfferDescription:
      'Complete build-ready project — from $60/m². Minimum project 120 m² (from $7 200).',
    eyebrow: 'Services',
    h1: 'Private space design — apartments, houses, residences',
    answer:
      'Private space design at bureau X — apartments, houses and residences built with natural materials and the handcraft of Ukrainian artisans. A complete build-ready project from $60/m², minimum project size — 120 m². Timeline — 1.5–3 months depending on the area.',
    intro:
      'A home that looks like you, not like a catalog. We create interiors with character from natural materials and the handwork of Ukrainian artisans — for those who want their own, not “like everyone else’s”. The Ukrainian code remains even when the project carries no symbols.',
    cta: 'Discuss your space',
    spacesTitle: 'Spaces we design',
    spacesIntro:
      'For those who want a space with character and are ready for something bolder than “modern classic”.',
    spaceTypes: [
      {
        t: 'Apartments',
        d: 'A distinctive interior without ethnography — natural materials, texture, handcraft. Symbols — only as many as you are ready for.',
      },
      {
        t: 'Private houses',
        d: 'A space where the Ukrainian code unfolds fully — from material to light.',
      },
      {
        t: 'Residences and collectors’ interiors',
        d: 'For those who collect signature pieces and want a space that reads as a whole. This is where we experiment the deepest.',
      },
    ],
    positionP1:
      '“Bold” for us is not about shock value — it is about honest materials and handcraft. Imperfect wood, artisan ceramics, woven textiles — the things that make a home feel warm rather than staged. We don’t draw invented decor — we bring real handcrafted pieces into your space.',
    positionH2: 'A Ukrainian home, not a museum',
    positionP2:
      'MUAS in a private space is shelter through the natural and the handmade, not an exhibition of ornaments. Wood with its imperfections, ceramics, textiles, a symbol as a quiet accent.',
    positionP3:
      'MUAS — Young Ukrainian Architectural Style. In its day, Art Nouveau changed how the houses and interiors of an entire generation looked. MUAS is the contemporary answer: not nostalgia for the past, but a new language that speaks of today’s Ukraine through material and form.',
    projectsTitle: 'Completed projects',
    projectsAll: 'All projects →',
    faqs: [
      {
        id: 'priv-1',
        question: 'How much does apartment or house design cost?',
        answer:
          'From $60/m² for a complete build-ready project (layouts, visualizations, drawings, specifications). We give an exact figure after a short brief.',
      },
      {
        id: 'priv-2',
        question: 'I want something bold, but without the “Ukrainian look” — is that possible?',
        answer:
          'Yes. Most people who say this simply don’t want ornaments and symbols — and that’s fine. The natural materials, handcraft and character stay; the space is still ours in spirit, just clean of symbols.',
      },
      {
        id: 'priv-3',
        question: 'Do you work with handcrafted pieces for the home?',
        answer:
          'Yes. Ceramics, wood carving, woven textiles — we have our own network of Ukrainian artisans and build their pieces into the project. We can bring in your makers too.',
      },
      {
        id: 'priv-4',
        question: 'How long does a private interior project take?',
        answer:
          '1.5–3 months depending on the area. The stages are fixed, and you see intermediate results along the way.',
      },
      {
        id: 'priv-5',
        question: 'Do you take the project through to realization?',
        answer:
          'Yes — we can take it all the way to turnkey renovation with author supervision. Design and construction in one hands means fewer reworks and clear timelines.',
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
    alternates: seoAlternates('/posluhy/pryvatni-prostory', locale),
  };
}

export default async function PryvatniProstoryPage({ params: { locale } }: { params: { locale: string } }) {
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
        minPrice: 60,
        priceCurrency: 'USD',
        unitText: c.serviceLdUnitText,
      },
      description: c.serviceLdOfferDescription,
    },
  };

  return (
    <>
      <script
        id="ld-bc-priv"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        id="ld-svc-priv"
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
          {c.answer}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          {c.intro}
        </p>
        <div className="mt-8">
          <CtaButton
            kind="estimate"
            className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
          >
            <span>⟶</span> {c.cta}
          </CtaButton>
        </div>
      </section>

      {/* Типи просторів */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.spacesTitle}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {c.spacesIntro}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line lg:grid-cols-3">
          {c.spaceTypes.map((s, i) => (
            <Reveal key={s.t} delay={i * 60}>
              <div className="py-4 pr-10">
                <h3 className="display-xl text-lg font-normal">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
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
              {c.positionP1}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-xl mt-12 text-[clamp(1.5rem,3vw,2.5rem)]">
              {c.positionH2}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              {c.positionP2}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/50">
              {c.positionP3}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Реалізовані проєкти */}
      {projects.length > 0 && (
        <section className="container-wide py-16 lg:py-24 border-t border-line">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.projectsTitle}</h2>
              <Link
                href="/projects"
                className="hidden text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink sm:block"
              >
                {c.projectsAll}
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
