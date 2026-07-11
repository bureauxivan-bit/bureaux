import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { seoAlternates } from '@/i18n/seo';
import { Reveal } from '@/components/Reveal';
import { FinalCta } from '@/components/FinalCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

const COPY = {
  uk: {
    metaTitle: 'МУАС — Молодий Український Архітектурний Стиль: визначення, принципи · bureau X',
    metaDescription:
      "МУАС (Молодий Український Архітектурний Стиль) — авторська концепція bureau X: сучасна естетика + українські традиції, натуральні матеріали, ручна робота майстрів. Визначення, три принципи, зв'язок з українським модерном.",
    breadcrumbHome: 'Головна',
    breadcrumbSelf: 'МУАС',
    selfPath: '/muas',
    ldHeadline: 'МУАС — Молодий Український Архітектурний Стиль',
    ldDescription:
      "Визначення та принципи МУАС — авторського архітектурного й інтер'єрного стилю bureau X, що поєднує сучасну естетику з українськими традиціями.",
    ldTermName: 'МУАС',
    ldTermAlt: 'Молодий Український Архітектурний Стиль',
    ldTermDescription:
      "Сучасний український архітектурний та інтер'єрний стиль, створений bureau X: поєднання сучасної естетики з українськими традиціями — натуральні матеріали, чесна форма, ручна робота українських майстрів.",
    ldLanguage: 'uk',
    eyebrow: 'Стиль',
    h1: 'МУАС — Молодий Український Архітектурний Стиль',
    definition:
      "МУАС (Молодий Український Архітектурний Стиль) — сучасний український стиль в архітектурі та дизайні інтер'єру, створений київським бюро bureau X. Він поєднує сучасну естетику з українськими традиціями та символами: натуральні матеріали, чесна форма, ручна робота українських майстрів.",
    definition2:
      'Це не набір символів на стінах, а спосіб будувати: натуральне й ручне замість індустріального й шаблонного. Мета — зробити українську мову форми впізнаваною так само, як скандинавську чи японську.',
    principlesHeading: 'Три принципи МУАС',
    principles: [
      { t: 'Особистий', d: 'Простір — про вас: характер, звички та спосіб життя людини, а не каталожна картинка.' },
      { t: 'Функціональний', d: 'Простір — про місце: планування й матеріали працюють на функцію, а не проти неї.' },
      { t: 'Смисловий', d: 'Простір — про зміст: про що має бути це середовище, який код воно несе.' },
    ],
    modernHeading: 'Нова хвиля після українського модерну',
    modernText:
      'Свого часу український модерн змінив архітектуру цілої епохи — це була нова хвиля. МУАС — така ж хвиля сьогодні: не регіональна примха, а повноцінна мова форми. Не ностальгія за минулим, а нова мова, яка говорить про сьогоднішню Україну через матеріал і форму.',
    howHeading: 'Як МУАС проявляється',
    howArchTitle: 'В архітектурі',
    howArchText:
      "Не орнамент на фасаді, а натуральні матеріали, чесна форма й недосконалість, яка робить об'єкт живим: дерево з фактурою, місцевий камінь, ручна робота там, де це видно.",
    howArchLink: 'Архітектурне проєктування',
    howPrivTitle: "У приватних інтер'єрах",
    howPrivText:
      'Захисток через натуральне й ручне, а не виставка з орнаментами: дерево з недосконалістю, кераміка, тканина, символ як тихий акцент.',
    howPrivLink: 'Приватні простори',
    howComTitle: 'У комерційних просторах',
    howComText:
      "Тут МУАС розкривається найсміливіше: натуральні матеріали, ручна робота майстрів і сучасна трактовка українського — те, чого немає в мережевих інтер'єрах «під копірку».",
    howComLink: 'Комерційні приміщення',
    whoHeading: 'Хто створив МУАС',
    whoText:
      "МУАС створили засновники bureau X — подружжя архітекторів Іван Руденко та Дар'я Руденко-Фортуна. Бюро активно просуває новий стиль українського дизайну понад 5 років: 10 000+ м² реалізованих просторів у Києві, по всій Україні та за кордоном.",
    whoStudioLink: 'Про бюро',
    whoProjectsLink: 'Проєкти в стилі МУАС',
  },
  en: {
    metaTitle: 'MUAS — Young Ukrainian Architectural Style: Definition & Principles · bureau X',
    metaDescription:
      'MUAS (Young Ukrainian Architectural Style) — the signature concept by bureau X: contemporary aesthetics + Ukrainian traditions, natural materials, handcrafted work. Definition, three principles, and the link to Ukrainian Art Nouveau.',
    breadcrumbHome: 'Home',
    breadcrumbSelf: 'MUAS',
    selfPath: '/en/muas',
    ldHeadline: 'MUAS — Young Ukrainian Architectural Style',
    ldDescription:
      'Definition and principles of MUAS — the signature architectural and interior style by bureau X that blends contemporary aesthetics with Ukrainian traditions.',
    ldTermName: 'MUAS',
    ldTermAlt: 'Young Ukrainian Architectural Style',
    ldTermDescription:
      'A contemporary Ukrainian style in architecture and interior design created by bureau X: contemporary aesthetics combined with Ukrainian traditions — natural materials, honest form, handcrafted work by Ukrainian artisans.',
    ldLanguage: 'en',
    eyebrow: 'Style',
    h1: 'MUAS — Young Ukrainian Architectural Style',
    definition:
      'MUAS (Young Ukrainian Architectural Style) is a contemporary Ukrainian style in architecture and interior design created by the Kyiv studio bureau X. It blends contemporary aesthetics with Ukrainian traditions and symbols: natural materials, honest form, and handcrafted work by Ukrainian artisans.',
    definition2:
      'It is not a set of symbols on the walls but a way of building: natural and handmade instead of industrial and generic. The goal is to make the Ukrainian language of form as recognizable as the Scandinavian or Japanese one.',
    principlesHeading: 'The three principles of MUAS',
    principles: [
      { t: 'Personal', d: 'The space is about you: the character, habits and lifestyle of a person — not a catalogue picture.' },
      { t: 'Functional', d: 'The space is about the place: layout and materials work for the function, not against it.' },
      { t: 'Meaningful', d: 'The space is about meaning: what this environment should stand for, what code it carries.' },
    ],
    modernHeading: 'A new wave after Ukrainian Art Nouveau',
    modernText:
      'In its time, Ukrainian Art Nouveau changed the architecture of an entire era — it was a new wave. MUAS is the same kind of wave today: not a regional quirk but a fully-fledged language of form. Not nostalgia for the past, but a new language that speaks about today’s Ukraine through material and form.',
    howHeading: 'How MUAS shows up',
    howArchTitle: 'In architecture',
    howArchText:
      'Not ornament on a façade, but natural materials, honest form and the imperfection that makes a building feel alive: textured wood, local stone, handcraft where it can be seen.',
    howArchLink: 'Architectural design',
    howPrivTitle: 'In private interiors',
    howPrivText:
      'Shelter through the natural and the handmade, not an exhibition of ornaments: wood with its imperfections, ceramics, fabric, a symbol as a quiet accent.',
    howPrivLink: 'Private spaces',
    howComTitle: 'In commercial spaces',
    howComText:
      'Here MUAS unfolds most boldly: natural materials, artisan handcraft and a contemporary reading of the Ukrainian — everything chain-store copy-paste interiors lack.',
    howComLink: 'Commercial spaces',
    whoHeading: 'Who created MUAS',
    whoText:
      'MUAS was created by the founders of bureau X — the architect couple Ivan Rudenko and Daria Rudenko-Fortuna. The studio has been championing the new style of Ukrainian design for over 5 years: 10,000+ m² of completed spaces in Kyiv, across Ukraine and abroad.',
    whoStudioLink: 'About the studio',
    whoProjectsLink: 'MUAS-style projects',
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
    alternates: seoAlternates('/muas', locale),
  };
}

export default function MuasPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  const selfUrl = `${SITE_URL}${c.selfPath}`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: locale === 'en' ? `${SITE_URL}/en` : SITE_URL },
      { '@type': 'ListItem', position: 2, name: c.breadcrumbSelf, item: selfUrl },
    ],
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ldHeadline,
    description: c.ldDescription,
    url: selfUrl,
    inLanguage: c.ldLanguage,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    about: {
      '@type': 'DefinedTerm',
      name: c.ldTermName,
      alternateName: c.ldTermAlt,
      description: c.ldTermDescription,
      url: selfUrl,
    },
  };

  return (
    <article>
      <script
        id="ld-bc-muas"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        id="ld-article-muas"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      {/* Breadcrumb */}
      <nav className="container-wide pt-28 pb-0 text-xs text-muted lg:pt-36" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-ink transition-colors">{c.breadcrumbHome}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">{c.breadcrumbSelf}</li>
        </ol>
      </nav>

      {/* Hero: визначення першим абзацом */}
      <section className="container-wide pt-8 pb-16 lg:pb-24">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="display-xl mt-5 max-w-4xl text-[clamp(2rem,5vw,4rem)]">
          {c.h1}
        </h1>
        {/* Прямий відповідь-абзац для AEO: визначення терміна */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed">
          {c.definition}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          {c.definition2}
        </p>
      </section>

      {/* Три принципи */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.principlesHeading}</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line lg:grid-cols-3">
          {c.principles.map((p, i) => (
            <Reveal key={p.t} delay={i * 60}>
              <div className="py-4 pr-10">
                <h3 className="display-xl text-lg font-normal">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Зв'язок з модерном */}
      <section className="bg-coal py-16 text-paper lg:py-24">
        <div className="container-wide">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">
              {c.modernHeading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              {c.modernText}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Як МУАС проявляється */}
      <section className="container-wide py-16 lg:py-24">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.howHeading}</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line lg:grid-cols-3">
          <Reveal>
            <div className="py-4 pr-10">
              <h3 className="display-xl text-lg font-normal">{c.howArchTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {c.howArchText}{' '}
                <Link href="/posluhy/arkhitektura" className="underline hover:text-ink">
                  {c.howArchLink} →
                </Link>
              </p>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="py-4 pr-10">
              <h3 className="display-xl text-lg font-normal">{c.howPrivTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {c.howPrivText}{' '}
                <Link href="/posluhy/pryvatni-prostory" className="underline hover:text-ink">
                  {c.howPrivLink} →
                </Link>
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="py-4 pr-10">
              <h3 className="display-xl text-lg font-normal">{c.howComTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {c.howComText}{' '}
                <Link href="/posluhy/komertsiini-prymishchennia" className="underline hover:text-ink">
                  {c.howComLink} →
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Хто створив */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">{c.whoHeading}</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
            {c.whoText}{' '}
            <Link href="/studio" className="underline hover:text-ink">{c.whoStudioLink} →</Link>{' '}
            <Link href="/projects" className="underline hover:text-ink">{c.whoProjectsLink} →</Link>
          </p>
        </Reveal>
      </section>

      <FinalCta />
    </article>
  );
}
