import type { Metadata } from 'next';
import Script from 'next/script';
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
  title: { absolute: 'Архітектурне проєктування у Києві — Bureau X' },
  description:
    'Проєктування приватних будинків, котеджів, комерційних об\'єктів у Київській та інших областях. Bureau X — авторський підхід, досвід 5+ котеджних містечок.',
  robots: { index: false, follow: true },
};

// DRAFT: переписати під голос МУАС, не публікувати як є
const FAQS = [
  {
    id: 'arh-1',
    question: 'Що входить у повний архітектурний проєкт?',
    answer:
      'Повний пакет: ескізний проєкт (концепція та планування), архітектурні рішення, конструктивні рішення, робочі креслення, специфікації. Також готуємо документи для отримання дозволу на будівництво.',
  },
  {
    id: 'arh-2',
    question: 'Скільки коштує архітектурне проєктування?',
    answer:
      'Від $40/м². Мінімальний проєкт рахуємо як 120 м² (від $4 800). Точну вартість визначаємо після брифу та виміру ділянки.',
  },
  {
    id: 'arh-3',
    question: 'Чи отримаєте ви дозвіл на будівництво за вашим проєктом?',
    answer:
      'Так, повний архітектурний проєкт Bureau X включає комплект документів, необхідних для отримання дозволу на будівництво в Україні.',
  },
  {
    id: 'arh-4',
    question: 'Ви проєктуєте тільки в Київській області?',
    answer:
      'Проєктуємо по всій Україні. Маємо досвід об\'єктів у Київській, Вінницькій, Львівській та інших областях.',
  },
  {
    id: 'arh-5',
    question: 'Чи можна замовити архітектурний проєкт разом із дизайном інтер\'єру?',
    answer:
      'Так, це наш оптимальний пакет: єдине бюро веде і архітектуру, і інтер\'єр, що гарантує узгодженість рішень і економію часу.',
  },
];

// DRAFT: переписати під голос МУАС, не публікувати як є
const PROJECT_TYPES = [
  { t: 'Приватні будинки', d: 'Від невеликих дачних будиночків до великих заміських резиденцій.' },
  { t: 'Котеджні містечка', d: 'Досвід 5+ котеджних містечок від генплану до типових проєктів.' },
  { t: 'Комерційні об\'єкти', d: 'Ресторани, готелі, торговельні центри, офісні будівлі.' },
  { t: 'Реконструкція', d: 'Перепланування, надбудови, реставрація фасадів та інтер\'єрів.' },
];

// DRAFT: переписати під голос МУАС, не публікувати як є
const INCLUDES = [
  'Ескізний проєкт (концепція та планування)',
  'Архітектурні рішення',
  'Конструктивні рішення та розрахунки',
  'Робочі креслення для будівництва',
  'Специфікації матеріалів',
  'Документи для дозволу на будівництво',
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
  provider: { '@type': 'LocalBusiness', name: 'Bureau X', url: SITE_URL },
  areaServed: ['Київ', 'Україна'],
  url: `${SITE_URL}/posluhy/arkhitektura`,
};

export default async function ArkhitekturaPage() {
  const projects = await getProjectsByCategory('ARCHITECTURE').catch(() => []);

  return (
    <>
      <Script
        id="ld-bc-arh"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
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
        {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">
          Проєктуємо приватні будинки, котеджі та комерційні об'єкти по всій Україні. Маємо
          досвід 5+ котеджних містечок та 10 000+ м² реалізованих просторів. Авторська концепція
          МУАС — у кожному об'єкті.
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
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line sm:grid-cols-2">
          {PROJECT_TYPES.map((o, i) => (
            <Reveal key={o.t} delay={i * 60}>
              <div className="py-4 pr-10">
                <h3 className="display-xl text-lg font-normal">{o.t}</h3>
                {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
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
            <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">МУАС в архітектурі</h2>
          </Reveal>
          <Reveal delay={120}>
            {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              МУАС — Молодий Український Архітектурний Стиль — виходить за межі інтер'єру.
              В архітектурі це читається у виборі матеріалів, пропорціях, ставленні до ландшафту
              та вписуванні будівлі в контекст місця. Сучасна естетика з глибоким локальним
              смислом.
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
