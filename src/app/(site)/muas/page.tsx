import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { FinalCta } from '@/components/FinalCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export const metadata: Metadata = {
  title: { absolute: 'МУАС — Молодий Український Архітектурний Стиль: визначення, принципи · bureau X' },
  description:
    'МУАС (Молодий Український Архітектурний Стиль) — авторська концепція bureau X: сучасна естетика + українські традиції, натуральні матеріали, ручна робота майстрів. Визначення, три принципи, зв\'язок з українським модерном.',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'МУАС', item: `${SITE_URL}/muas` },
  ],
};

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'МУАС — Молодий Український Архітектурний Стиль',
  description:
    'Визначення та принципи МУАС — авторського архітектурного й інтер\'єрного стилю bureau X, що поєднує сучасну естетику з українськими традиціями.',
  url: `${SITE_URL}/muas`,
  inLanguage: 'uk',
  author: { '@id': `${SITE_URL}/#organization` },
  publisher: { '@id': `${SITE_URL}/#organization` },
  about: {
    '@type': 'DefinedTerm',
    name: 'МУАС',
    alternateName: 'Молодий Український Архітектурний Стиль',
    description:
      'Сучасний український архітектурний та інтер\'єрний стиль, створений bureau X: поєднання сучасної естетики з українськими традиціями — натуральні матеріали, чесна форма, ручна робота українських майстрів.',
    url: `${SITE_URL}/muas`,
  },
};

const PRINCIPLES = [
  { t: 'Особистий', d: 'Простір — про вас: характер, звички та спосіб життя людини, а не каталожна картинка.' },
  { t: 'Функціональний', d: 'Простір — про місце: планування й матеріали працюють на функцію, а не проти неї.' },
  { t: 'Смисловий', d: 'Простір — про зміст: про що має бути це середовище, який код воно несе.' },
];

export default function MuasPage() {
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
          <li><Link href="/" className="hover:text-ink transition-colors">Головна</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">МУАС</li>
        </ol>
      </nav>

      {/* Hero: визначення першим абзацом */}
      <section className="container-wide pt-8 pb-16 lg:pb-24">
        <p className="eyebrow">Стиль</p>
        <h1 className="display-xl mt-5 max-w-4xl text-[clamp(2rem,5vw,4rem)]">
          МУАС — Молодий Український Архітектурний Стиль
        </h1>
        {/* Прямий відповідь-абзац для AEO: визначення терміна */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed">
          МУАС (Молодий Український Архітектурний Стиль) — сучасний український стиль в
          архітектурі та дизайні інтер'єру, створений київським бюро bureau X. Він поєднує
          сучасну естетику з українськими традиціями та символами: натуральні матеріали,
          чесна форма, ручна робота українських майстрів.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Це не набір символів на стінах, а спосіб будувати: натуральне й ручне замість
          індустріального й шаблонного. Мета — зробити українську мову форми впізнаваною так
          само, як скандинавську чи японську.
        </p>
      </section>

      {/* Три принципи */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Три принципи МУАС</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
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
              Нова хвиля після українського модерну
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              Свого часу український модерн змінив архітектуру цілої епохи — це була нова
              хвиля. МУАС — така ж хвиля сьогодні: не регіональна примха, а повноцінна мова
              форми. Не ностальгія за минулим, а нова мова, яка говорить про сьогоднішню
              Україну через матеріал і форму.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Як МУАС проявляється */}
      <section className="container-wide py-16 lg:py-24">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Як МУАС проявляється</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line lg:grid-cols-3">
          <Reveal>
            <div className="py-4 pr-10">
              <h3 className="display-xl text-lg font-normal">В архітектурі</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Не орнамент на фасаді, а натуральні матеріали, чесна форма й недосконалість,
                яка робить об'єкт живим: дерево з фактурою, місцевий камінь, ручна робота там,
                де це видно.{' '}
                <Link href="/posluhy/arkhitektura" className="underline hover:text-ink">
                  Архітектурне проєктування →
                </Link>
              </p>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="py-4 pr-10">
              <h3 className="display-xl text-lg font-normal">У приватних інтер'єрах</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Захисток через натуральне й ручне, а не виставка з орнаментами: дерево з
                недосконалістю, кераміка, тканина, символ як тихий акцент.{' '}
                <Link href="/posluhy/pryvatni-prostory" className="underline hover:text-ink">
                  Приватні простори →
                </Link>
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="py-4 pr-10">
              <h3 className="display-xl text-lg font-normal">У комерційних просторах</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Тут МУАС розкривається найсміливіше: натуральні матеріали, ручна робота
                майстрів і сучасна трактовка українського — те, чого немає в мережевих
                інтер'єрах «під копірку».{' '}
                <Link href="/posluhy/komertsiini-prymishchennia" className="underline hover:text-ink">
                  Комерційні приміщення →
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Хто створив */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Хто створив МУАС</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
            МУАС створили засновники bureau X — подружжя архітекторів Іван Руденко та Дар'я
            Руденко-Фортуна. Бюро активно просуває новий стиль українського дизайну понад
            5 років: 10 000+ м² реалізованих просторів у Києві, по всій Україні та за
            кордоном.{' '}
            <Link href="/studio" className="underline hover:text-ink">Про бюро →</Link>{' '}
            <Link href="/projects" className="underline hover:text-ink">Проєкти в стилі МУАС →</Link>
          </p>
        </Reveal>
      </section>

      <FinalCta />
    </article>
  );
}
