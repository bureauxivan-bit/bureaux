import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { FinalCta } from '@/components/FinalCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export const metadata: Metadata = {
  title: { absolute: "Послуги — дизайн інтер'єру, архітектура, ремонт під ключ · bureau X" },
  description:
    "Архітектурне бюро повного циклу у Києві. Дизайн інтер'єру, архітектурне проєктування, будівництво та ремонт під ключ, авторський стиль МУАС.",
};

const SERVICES = [
  {
    num: '01',
    title: "Дизайн інтер'єру",
    href: '/posluhy/dyzajn-intereru',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: "Повний авторський проєкт: від концепції та візуалізацій до робочих креслень і специфікацій — усе для реалізації ремонту.",
  },
  {
    num: '02',
    title: 'Архітектурне проєктування',
    href: '/posluhy/arkhitektura',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: "Проєктування приватних будинків, котеджів і комерційних об'єктів. Від ескізу та концепції до повного пакету дозвільної документації.",
  },
  {
    num: '03',
    title: 'Ремонт та будівництво під ключ',
    href: '/posluhy/remont-pid-klyuch',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: "Власна бригада, авторський нагляд, дизайн і ремонт в одних руках. Від проєкту до переїзду без зайвого стресу.",
  },
  {
    num: '04',
    title: 'Комерційні приміщення',
    href: '/posluhy/komertsiini-prymishchennia',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: "Ресторани, кафе, офіси, магазини, готелі. Розуміємо бізнес-логіку простору й реалізуємо під ключ.",
  },
  {
    num: '05',
    title: 'Приватні простори',
    href: '/posluhy/pryvatni-prostory',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: "Квартири, будинки, котеджі в авторському стилі МУАС. Індивідуальний підхід від першої консультації до ключів.",
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Послуги', item: `${SITE_URL}/posluhy` },
  ],
};

export default function PostluhyPage() {
  return (
    <>
      <Script
        id="ld-breadcrumb-posluhy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <section className="container-wide pt-36 pb-16 lg:pt-44 lg:pb-24">
        <p className="eyebrow">Послуги</p>
        <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
          Послуги bureau <em>X</em> — від концепції до ключів
        </h1>
        {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">
          Ми — архітектурне бюро повного циклу. Проєктуємо, дизайнуємо, будуємо та
          супроводжуємо — у власному авторському стилі МУАС. Кожен проєкт розробляємо
          індивідуально, з урахуванням особистості клієнта та функції простору.
        </p>
      </section>

      {/* Services list */}
      <section className="container-wide pb-24 lg:pb-36">
        <div className="border-t border-line">
          {SERVICES.map((s, i) => (
            <Reveal key={s.href} delay={i * 60}>
              <Link
                href={s.href}
                className="group flex flex-col gap-4 border-b border-line py-8 transition-colors duration-200 hover:bg-ink/[0.02] sm:flex-row sm:items-start sm:gap-10 sm:py-10"
              >
                <span className="shrink-0 text-[10px] font-normal uppercase tracking-[0.28em] text-muted pt-1">
                  {s.num}
                </span>

                <div className="flex-1">
                  <h2 className="display-xl text-xl font-normal sm:text-2xl">
                    {s.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {s.desc}
                  </p>
                </div>

                <span className="self-center text-2xl transition-transform duration-300 group-hover:translate-x-2 shrink-0">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
