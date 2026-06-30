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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export const metadata: Metadata = {
  title: { absolute: 'Ремонт та будівництво під ключ у Києві — Bureau X' },
  description:
    'Ремонт квартири та будинку під ключ у Києві від архітектурного бюро Bureau X. Власна бригада, авторський нагляд, дизайн і ремонт — в одних руках.',
};

// DRAFT: переписати під голос МУАС, не публікувати як є
const FAQS = [
  {
    id: 'rem-1',
    question: 'Що входить у ремонт під ключ?',
    answer:
      'Повний цикл: дизайн-проєкт, підготовка приміщення, чорнові та чистові роботи, монтаж інженерних систем, постачання матеріалів, меблювання та декор. Від порожніх стін до готового до переїзду простору.',
  },
  {
    id: 'rem-2',
    question: 'Чому краще замовити ремонт у бюро, а не шукати бригаду окремо?',
    answer:
      'У Bureau X дизайнер і бригада — одна команда. Ніяких розбіжностей між проєктом і реалізацією. Авторський нагляд гарантує відповідність результату задуму.',
  },
  {
    id: 'rem-3',
    question: 'Скільки коштує ремонт під ключ?',
    answer:
      'Орієнтовний бюджет реалізації «під ключ» (проєкт + ремонт) — від $1 400/м². Це орієнтир для планування загального бюджету. Точну вартість визначаємо після брифу та огляду об\'єкта.',
  },
  {
    id: 'rem-4',
    question: 'Чи можна замовити ремонт без дизайн-проєкту?',
    answer:
      'Ні, ремонт під ключ від Bureau X завжди йде разом із дизайн-проєктом. Це гарантія якості результату та контролю кожного кроку реалізації.',
  },
  {
    id: 'rem-5',
    question: 'Ви працюєте лише в Києві?',
    answer:
      'Основна зона — Київ та Київська область. Проєкти в інших містах обговорюємо індивідуально.',
  },
];

// DRAFT: переписати під голос МУАС, не публікувати як є
const INCLUDES = [
  'Дизайн-проєкт (планування, візуалізації, креслення)',
  'Демонтаж та підготовка приміщення',
  'Чорнові роботи (стяжки, штукатурка, стіни)',
  'Монтаж інженерних систем (електрика, сантехніка)',
  'Чистові роботи та оздоблення',
  'Меблювання, освітлення, декор',
];

// DRAFT: переписати під голос МУАС, не публікувати як є
const ADVANTAGES = [
  {
    t: 'Дизайн і ремонт в одних руках',
    d: 'Не потрібно шукати бригаду окремо і пояснювати проєкт. Ми відповідаємо за все.',
  },
  {
    t: 'Власна бригада',
    d: 'Не субпідрядники — власні майстри, з якими ми відпрацювали десятки об\'єктів.',
  },
  {
    t: 'Авторський нагляд',
    d: 'Архітектор на майданчику контролює відповідність результату проєкту.',
  },
  {
    t: 'Фіксована вартість',
    d: 'Підписуємо кошторис до початку робіт. Без прихованих доплат.',
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
  provider: { '@type': 'LocalBusiness', name: 'Bureau X', url: SITE_URL },
  areaServed: ['Київ', 'Київська область'],
  url: `${SITE_URL}/posluhy/remont-pid-klyuch`,
};

export default async function RemontPidKlyuchPage() {
  const projects = await getProjectsByCategory('PRIVATE').catch(() => []);

  return (
    <>
      <Script
        id="ld-bc-rem"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
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
        <Reveal>
          <p className="eyebrow">Послуги</p>
          <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
            Ремонт та будівництво під ключ — від проєкту до переїзду
          </h1>
        </Reveal>
        <Reveal delay={120}>
          {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">
            Власна бригада, авторський нагляд і дизайн — в одних руках. Від чистового ремонту
            квартири до будівництва будинку. Ви отримуєте ключі від готового простору.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-8">
            <CtaButton
              kind="estimate"
              className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
            >
              <span>⟶</span> Розрахувати вартість ремонту
            </CtaButton>
          </div>
        </Reveal>
      </section>

      {/* Що входить */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Що входить</h2>
        </Reveal>
        <div className="mt-10 grid gap-0 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {INCLUDES.map((item, i) => (
            <Reveal key={item} delay={i * 50}>
              <div className="flex items-start gap-4 border-b border-line py-5 pr-6">
                <span className="mt-0.5 shrink-0 text-[10px] uppercase tracking-[0.28em] text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Чому краще ніж окремі підрядники */}
      <section className="bg-coal py-16 text-paper lg:py-24">
        <div className="container-wide">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">
              Чому краще ніж окремі підрядники
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-0 border-t border-paper/10 sm:grid-cols-2">
            {ADVANTAGES.map((a, i) => (
              <Reveal key={a.t} delay={i * 60}>
                <div className="border-b border-paper/10 py-7 pr-10 sm:border-r sm:[&:nth-child(2n)]:border-r-0">
                  <h3 className="display-xl text-base font-normal">{a.t}</h3>
                  {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
                  <p className="mt-2 text-sm leading-relaxed text-paper/55">{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
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
