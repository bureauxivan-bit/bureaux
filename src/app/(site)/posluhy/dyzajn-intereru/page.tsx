import type { Metadata } from 'next';
import Link from 'next/link';
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

export const metadata: Metadata = {
  title: { absolute: "Дизайн інтер'єру під ключ у Києві — bureau X" },
  description:
    "Замовити дизайн інтер'єру квартири, будинку або комерційного приміщення у Києві. bureau X — авторський підхід, стиль МУАС, повний супровід від ескізу до реалізації.",
  alternates: { canonical: '/posluhy/dyzajn-intereru' },
};

const FAQS = [
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
];

const INCLUDES = [
  'Вимірювання та обмірний план',
  'Планувальне рішення та зонування',
  "Концепт: настрійний борд, кольорова палітра",
  '3D-візуалізації ключових зон',
  'Робочі креслення (розкладки, розрізи, схеми)',
  'Специфікації матеріалів, меблів і декору',
];

const OBJECTS = [
  { t: 'Квартири', d: 'Від студій до великих апартаментів. Оптимізуємо планування під спосіб життя.' },
  { t: 'Приватні будинки', d: 'Просторові й багаторівневі рішення. Узгоджуємо з архітектурним проєктом.' },
  { t: 'Котеджі', d: 'Комплексний підхід — від фасаду до кімнати відпочинку.' },
  { t: 'Комерційні приміщення', d: 'Ресторани, офіси, шоуруми — де дизайн прямо впливає на бізнес.' },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Послуги', item: `${SITE_URL}/posluhy` },
    { '@type': 'ListItem', position: 3, name: "Дизайн інтер'єру", item: `${SITE_URL}/posluhy/dyzajn-intereru` },
  ],
};

const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: "Дизайн інтер'єру під ключ",
  description:
    "Авторський дизайн інтер'єру квартир, будинків та комерційних приміщень у Києві. Стиль МУАС. Повний проєкт від концепції до специфікацій.",
  provider: { '@type': 'LocalBusiness', name: 'bureau X', url: SITE_URL },
  areaServed: ['Київ', 'Україна'],
  url: `${SITE_URL}/posluhy/dyzajn-intereru`,
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      minPrice: 60,
      priceCurrency: 'USD',
      unitText: 'за м²',
    },
    description: "Повний дизайн-проєкт — від $60/м². Мінімальний проєкт 120 м² (від $7 200).",
  },
};

export default async function DyzajnInteruruPage() {
  const projects = await getProjectsByCategory('PRIVATE').catch(() => []);

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
          <li><Link href="/" className="hover:text-ink transition-colors">Головна</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/posluhy" className="hover:text-ink transition-colors">Послуги</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">Дизайн інтер'єру</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-wide pt-8 pb-16 lg:pb-24">
        <p className="eyebrow">Послуги</p>
        <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
          Дизайн інтер'єру під ключ у Києві
        </h1>
        {/* Прямий відповідь-абзац для AEO: що це, для кого, скільки коштує */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed">
          Дизайн інтер'єру у bureau X — це повний проєкт під реалізацію: планування,
          3D-візуалізації, робочі креслення та специфікації. Для квартир, будинків і комерційних
          приміщень — у Києві та дистанційно по всій Україні. Вартість — від $60/м², мінімальний
          проєкт — 120 м² (від $7 200), строк для квартири 60–100 м² — 8–12 тижнів.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Авторський підхід, стиль МУАС — від першого брифу до специфікацій під ремонт. Кожен
          проєкт розробляємо індивідуально: під особистість, функцію простору та спосіб життя
          клієнта.
        </p>
        <div className="mt-8">
          <CtaButton
            kind="estimate"
            className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
          >
            <span>⟶</span> Обговорити ваш інтер'єр
          </CtaButton>
        </div>
      </section>

      {/* Що входить */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Що входить у дизайн-проєкт</h2>
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

      {/* МУАС */}
      <section className="bg-coal py-16 text-paper lg:py-24">
        <div className="container-wide">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Авторський стиль МУАС</h2>
          </Reveal>
          <Reveal delay={120}>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              МУАС — Молодий Український Архітектурний Стиль — це авторська концепція bureau <em>X</em>.
              Поєднуємо сучасну естетику з українськими традиціями та символами. Три принципи:
              особистий — про вас, функціональний — про місце, смисловий — про що має бути цей
              простір.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Для яких об'єктів */}
      <section className="container-wide py-16 lg:py-24">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Для яких об'єктів</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line sm:grid-cols-2">
          {OBJECTS.map((o, i) => (
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
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Реалізовані інтер'єри</h2>
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
          <div className="mt-8 sm:hidden">
            <Link href="/projects" className="text-xs uppercase tracking-widest text-muted hover:text-ink">
              Всі проєкти →
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
        <Faq faqs={FAQS} />
      </div>

      <FinalCta />
    </>
  );
}
