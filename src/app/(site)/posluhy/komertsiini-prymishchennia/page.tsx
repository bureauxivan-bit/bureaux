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
  title: { absolute: 'Дизайн комерційних приміщень у Києві — Bureau X' },
  description:
    'Дизайн ресторанів, кафе, офісів, магазинів та готелів у Києві від Bureau X. Розуміємо бізнес-логіку простору, реалізуємо під ключ.',
  robots: { index: false, follow: true },
};

// DRAFT: переписати під голос МУАС, не публікувати як є
const FAQS = [
  {
    id: 'kom-1',
    question: 'Які комерційні об\'єкти ви проєктуєте?',
    answer:
      'Ресторани та кафе, офіси та коворкінги, магазини та шоуруми, готелі та апарт-готелі, медичні та wellness-простори. Кожен проєкт починається з вивчення бізнес-задачі та цільової аудиторії.',
  },
  {
    id: 'kom-2',
    question: 'Скільки коштує дизайн комерційного приміщення?',
    answer:
      'Вартість — від $60/м² (дизайн-проєкт). Реалізація під ключ — від $1 400/м² (проєкт + ремонт). Мінімальний проєкт рахуємо як 120 м². Точна вартість після брифу.',
  },
  {
    id: 'kom-3',
    question: 'Чи враховуєте ви специфіку бізнесу при проєктуванні?',
    answer:
      'Так, це основа комерційного дизайну. Ми вивчаємо бізнес-модель, потік клієнтів, брендинг і операційні процеси. Простір має збільшувати виручку та підвищувати ефективність команди.',
  },
  {
    id: 'kom-4',
    question: 'Ви працюєте з брендами та мережами?',
    answer:
      'Так. Розробляємо концепції для одиничних об\'єктів і адаптуємо їх для мережевого тиражування.',
  },
];

// DRAFT: переписати під голос МУАС, не публікувати як є
const OBJECT_TYPES = [
  {
    tag: 'h3',
    t: 'Ресторани та кафе',
    d: 'Простір, що продає. Від вхідної групи до кухні. Враховуємо потік гостей, освітлення, акустику та атмосферу, яка змушує повертатись.',
  },
  {
    tag: 'h3',
    t: 'Офіси',
    d: 'Офіс, де хочеться працювати. Функціональне зонування, ergonomics, брендинг простору та light design для продуктивності.',
  },
  {
    tag: 'h3',
    t: 'Магазини та шоуруми',
    d: 'Дизайн, що продає. Раціональна викладка, правильний маршрут покупця, сцена для вашого продукту.',
  },
  {
    tag: 'h3',
    t: 'Готелі',
    d: 'Від лоббі до номерів. Атмосфера, що відрізняє вас від конкурентів і стає причиною для повернення гостей.',
  },
];

// DRAFT: переписати під голос МУАС, не публікувати як є
const SPECIFICS = [
  'Вивчення бізнес-задачі та ЦА',
  'Функціональне зонування під операційні процеси',
  'Брендинг простору та айдентика',
  'Акустичні та освітлювальні рішення',
  'Підбір матеріалів з урахуванням інтенсивності використання',
  'Авторський нагляд та комплектація',
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Послуги', item: `${SITE_URL}/posluhy` },
    { '@type': 'ListItem', position: 3, name: 'Комерційні приміщення', item: `${SITE_URL}/posluhy/komertsiini-prymishchennia` },
  ],
};

const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Дизайн комерційних приміщень',
  description:
    'Дизайн та реалізація комерційних просторів у Києві: ресторани, офіси, магазини, готелі. Розуміємо бізнес-логіку простору.',
  provider: { '@type': 'LocalBusiness', name: 'Bureau X', url: SITE_URL },
  areaServed: ['Київ', 'Україна'],
  url: `${SITE_URL}/posluhy/komertsiini-prymishchennia`,
};

export default async function KomertsiiniPrymishchennyaPage() {
  const projects = await getProjectsByCategory('COMMERCIAL').catch(() => []);

  return (
    <>
      <Script
        id="ld-bc-kom"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="ld-svc-kom"
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
          <li className="text-ink" aria-current="page">Комерційні приміщення</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-wide pt-8 pb-16 lg:pb-24">
        <p className="eyebrow">Послуги</p>
        <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
          Дизайн комерційних приміщень — ресторани, офіси, магазини, готелі
        </h1>
        {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">
          Розуміємо бізнес-логіку простору і реалізуємо під ключ. Комерційний дизайн — це не
          декор. Це інструмент для зростання виручки, ефективності команди та лояльності клієнтів.
        </p>
        <div className="mt-8">
          <CtaButton
            kind="estimate"
            className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
          >
            <span>⟶</span> Обговорити комерційний проєкт
          </CtaButton>
        </div>
      </section>

      {/* Типи об'єктів */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Типи об'єктів</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line sm:grid-cols-2">
          {OBJECT_TYPES.map((o, i) => (
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

      {/* Специфіка комерційного дизайну */}
      <section className="bg-coal py-16 text-paper lg:py-24">
        <div className="container-wide">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">
              Специфіка комерційного дизайну
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 pt-8 border-t border-paper/10 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIFICS.map((item, i) => (
              <Reveal key={item} delay={i * 50}>
                <div className="flex items-start gap-4 py-3 pr-6">
                  <span className="mt-0.5 shrink-0 text-[10px] uppercase tracking-[0.28em] text-paper/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
                  <span className="text-sm leading-relaxed text-paper/75">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Проєкти */}
      {projects.length > 0 && (
        <section className="container-wide py-16 lg:py-24 border-t border-line">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Проєкти</h2>
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
