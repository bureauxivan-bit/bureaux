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
  title: { absolute: 'Архітектурне проєктування у Києві — bureau X' },
  description:
    'Проєктування приватних будинків, котеджів, комерційних об\'єктів у Київській та інших областях. bureau X — авторський підхід, досвід 5+ котеджних містечок.',
  alternates: { canonical: '/posluhy/arkhitektura' },
};

const FAQS = [
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
];

const PROJECT_TYPES = [
  { t: 'Приватні будинки', d: 'Від невеликих дачних до великих заміських резиденцій — форма, що працює на краєвид і на спосіб життя.' },
  { t: 'Котеджні містечка', d: 'Досвід 5+ комплексів: генплан, посадка, типові проєкти, єдина архітектурна мова на все містечко.' },
  { t: 'Комерційні об\'єкти', d: 'Ресторани, готелі, торгові й офісні будівлі — архітектура, що працює на бізнес із першого погляду.' },
  { t: 'Реконструкція', d: 'Перепланування, надбудови, реставрація фасадів та інтер\'єрів — друге життя об\'єкта без втрати характеру.' },
];

const INCLUDES = [
  'Ескізний проєкт — концепція та планування, зафіксований напрям.',
  'Архітектурні рішення — фасади, розрізи, вузли; те, як об\'єкт виглядає й тримається.',
  'Конструктивні рішення та розрахунки — щоб красиве стояло, а не тріщало.',
  'Робочі креслення для будівництва — комплект, готовий до дозволу й до бригади.',
];

const PROCESS_STEPS: WorkStep[] = [
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
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Послуги', item: `${SITE_URL}/posluhy` },
    { '@type': 'ListItem', position: 3, name: 'Архітектурне проєктування', item: `${SITE_URL}/posluhy/arkhitektura` },
  ],
};

const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Архітектурне проєктування',
  description:
    'Проєктування приватних будинків, котеджів і комерційних об\'єктів. Від ескізу до повного пакету дозвільної документації. Авторський стиль МУАС.',
  provider: { '@type': 'LocalBusiness', name: 'bureau X', url: SITE_URL },
  areaServed: ['Київ', 'Україна'],
  url: `${SITE_URL}/posluhy/arkhitektura`,
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      minPrice: 40,
      priceCurrency: 'USD',
      unitText: 'за м²',
    },
    description: 'Повний архітектурний проєкт — від $40/м². Мінімальний проєкт 120 м² (від $4 800).',
  },
};

export default async function ArkhitekturaPage() {
  const projects = await getProjectsByCategory('ARCHITECTURE').catch(() => []);

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
          <li><Link href="/" className="hover:text-ink transition-colors">Головна</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/posluhy" className="hover:text-ink transition-colors">Послуги</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">Архітектурне проєктування</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-wide pt-8 pb-16 lg:pb-24">
        <p className="eyebrow">Послуги</p>
        <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
          Архітектурне проєктування — від ескізу до дозволу на будівництво
        </h1>
        {/* Прямий відповідь-абзац для AEO: що це, для кого, скільки коштує */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed">
          Архітектурне проєктування у bureau X — повний проєкт від ескізу до дозволу на
          будівництво: приватні будинки, котеджі, комерційні об'єкти та котеджні містечка.
          Вартість — від $40/м², мінімальний проєкт — 120 м² (від $4 800), строк — від 1 місяця.
          Проєктуємо дистанційно по всій Україні та за кордоном.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Проєктуємо будинки, котеджі та комерційні об'єкти, у яких український код закладено з
          фундаменту, а не наклеєно оздобленням. Натуральні матеріали, чесна форма, характер —
          від генплану до робочих креслень. Досвід 5+ котеджних містечок і 10&nbsp;000+&nbsp;м²
          реалізованого.
        </p>
        <div className="mt-8">
          <CtaButton
            kind="estimate"
            className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
          >
            <span>⟶</span> Замовити архітектурний проєкт
          </CtaButton>
        </div>
      </section>

      {/* Що ми проєктуємо */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Що ми проєктуємо</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Беремося за об'єкти, де архітектура вирішує, а не лише прикриває коробку.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line sm:grid-cols-2">
          {PROJECT_TYPES.map((o, i) => (
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
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Склад проєкту</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Повний пакет, за яким будують, а не «щось узгодимо на місці».
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

      {/* МУАС в архітектурі */}
      <section className="bg-coal py-16 text-paper lg:py-24">
        <div className="container-wide">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Український код — з фундаменту</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              МУАС в архітектурі — це не орнамент на фасаді. Це натуральні матеріали, чесна форма
              й недосконалість, яка робить об'єкт живим: дерево з фактурою, місцевий камінь, ручна
              робота там, де це видно.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/50">
              МУАС — Молодий Український Архітектурний Стиль. Свого часу український модерн змінив
              архітектуру цілої епохи — це була нова хвиля. МУАС — така ж хвиля сьогодні: не
              регіональна примха, а повноцінна мова форми, яку ми хочемо зробити впізнаваною так
              само, як скандинавську чи японську.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Реалізовані об'єкти */}
      {projects.length > 0 && (
        <section className="container-wide py-16 lg:py-24 border-t border-line">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Реалізовані об'єкти</h2>
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
        <HowWeWork steps={PROCESS_STEPS} note="Кожен етап фіксується в договорі. Зміна завдання після затвердження ескізу — окрема домовленість." />
      </div>

      {/* FAQ */}
      <div className="border-t border-line">
        <Faq faqs={FAQS} />
      </div>

      <FinalCta />
    </>
  );
}
