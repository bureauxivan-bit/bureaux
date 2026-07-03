import type { Metadata } from 'next';
import Link from 'next/link';
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

export const metadata: Metadata = {
  title: { absolute: 'Ремонт та будівництво під ключ у Києві — bureau X' },
  description:
    'Ремонт квартири та будинку під ключ у Києві від архітектурного бюро bureau X. Власна бригада, авторський нагляд, дизайн і ремонт — в одних руках.',
};

const FAQS = [
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
      'Залежить від площі й обсягу; строки фіксуємо в договорі після проєкту. Не називаємо цифру «зі стелі» до того, як бачимо об\'єм.',
  },
  {
    id: 'rem-5',
    question: 'Ви працюєте з ручними речами українських майстрів?',
    answer:
      'Так, це наша фішка. Кераміка, різьба, ткані речі — маємо свою мережу ремісників і доводимо ці предмети до об\'єкта. Якщо у вас є свої майстри — підключаємо їх.',
  },
];

const INCLUDES = [
  'Проєкт і специфікація — те, за чим будують, без імпровізації на місці.',
  'Чорнові роботи — стяжка, електрика, сантехніка, вирівнювання; те, що приховано, але вирішує.',
  'Чистові роботи — за проєктом, а не «як вийде».',
  'Комплектація — матеріали, меблі, декор; підбираємо й доставляємо.',
  'Ручна робота українських майстрів — кераміка, різьба, ткані речі зі своєї мережі ремісників.',
  'Авторський нагляд — тримаємо якість реалізації, щоб на об\'єкті було як у проєкті.',
];

const PROCESS_STEPS: WorkStep[] = [
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
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Послуги', item: `${SITE_URL}/posluhy` },
    { '@type': 'ListItem', position: 3, name: 'Ремонт під ключ', item: `${SITE_URL}/posluhy/remont-pid-klyuch` },
  ],
};

const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ремонт та будівництво під ключ',
  description:
    'Ремонт квартири та будинку під ключ у Києві. Власна бригада, авторський нагляд, дизайн і реалізація в одних руках.',
  provider: { '@type': 'LocalBusiness', name: 'bureau X', url: SITE_URL },
  areaServed: ['Київ', 'Київська область'],
  url: `${SITE_URL}/posluhy/remont-pid-klyuch`,
  offers: [
    {
      '@type': 'Offer',
      name: 'Реалізація «під ключ» (проєкт + ремонт)',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        minPrice: 1400,
        priceCurrency: 'USD',
        unitText: 'за м²',
      },
    },
    {
      '@type': 'Offer',
      name: 'Авторський нагляд',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: 800,
        priceCurrency: 'USD',
        unitText: 'на місяць',
      },
      description: 'Київ; інші міста та країни — перерахунок за запитом.',
    },
  ],
};

export default async function RemontPidKlyuchPage() {
  const projects = await getProjectsByCategory('PRIVATE').catch(() => []);

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
          <li><Link href="/" className="hover:text-ink transition-colors">Головна</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/posluhy" className="hover:text-ink transition-colors">Послуги</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">Ремонт під ключ</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-wide pt-8 pb-16 lg:pb-24">
        <p className="eyebrow">Послуги</p>
        <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
          Ремонт під ключ у Києві — від проєкту до готового простору
        </h1>
        {/* Прямий відповідь-абзац для AEO: що це, для кого, скільки коштує */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed">
          Ремонт під ключ у bureau X — це проєкт і реалізація в одних руках: від креслень до
          комплектації та авторського нагляду. Орієнтовний бюджет «під ключ» (проєкт + ремонт) —
          від $1 400/м², авторський нагляд — $800/міс. Працюємо у Києві та Київській області.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Дизайн і ремонт в одних руках — нікому нічого не потрібно пояснювати двічі. Ми доводимо
          проєкт до реалізації: матеріали, майстри, ручна мережа українських ремісників — все під
          нашим контролем, а не «підберете самі».
        </p>
        <div className="mt-8">
          <CtaButton
            kind="estimate"
            className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
          >
            <span>⟶</span> Обговорити ремонт під ключ
          </CtaButton>
        </div>
      </section>

      {/* Що входить */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Що входить</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Одна команда відповідає за все — від креслення до останнього плінтуса.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 pt-8 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {INCLUDES.map((item, i) => (
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
              Найдорожче в ремонті — переробки. Вони виникають там, де проєкт і бригада — різні
              люди, які одне одного не чують. У нас проєкт і реалізація — одні руки, тому
              переробок менше, а строки чіткі.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-xl mt-12 text-[clamp(1.5rem,3vw,2.5rem)]">
              Український стиль, доведений до реалізації
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              Стиль легко намалювати й важко збудувати. Ми доводимо український код до готового
              простору: недосконале дерево, мазанка, солома, барельєфи, ручні речі майстрів —
              не рендер, а матеріал під рукою.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/50">
              МУАС — Молодий Український Архітектурний Стиль. Не набір символів на стінах, а
              спосіб будувати: натуральне й ручне замість індустріального й шаблонного. Ми
              хочемо, щоб цю мову говорили не лише ми — і щоб вона стала впізнаваною так само,
              як скандинавська чи японська.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Реалізовані роботи */}
      {projects.length > 0 && (
        <section className="container-wide py-16 lg:py-24 border-t border-line">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Реалізовані роботи</h2>
              <Link
                href="/projects"
                className="hidden text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink sm:block"
              >
                Всі проєкти →
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
        <HowWeWork steps={PROCESS_STEPS} note="Строки та кошторис фіксуємо в договорі після проєкту. Зміни в процесі — окрема домовленість." />
      </div>

      {/* FAQ */}
      <div className="border-t border-line">
        <Faq faqs={FAQS} />
      </div>

      <FinalCta />
    </>
  );
}
