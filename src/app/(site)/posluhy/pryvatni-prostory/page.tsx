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
  title: { absolute: 'Дизайн приватних просторів — квартири, будинки, котеджі · Bureau X Київ' },
  description:
    "Дизайн інтер'єру квартири, приватного будинку або котеджу у Києві. Bureau X — авторський стиль МУАС, повний цикл: концепція, проєкт, реалізація.",
};

// DRAFT: переписати під голос МУАС, не публікувати як є
const FAQS = [
  {
    id: 'priv-1',
    question: 'У чому різниця між приватним і комерційним дизайном?',
    answer:
      'Приватний простір — про особистість і спосіб життя конкретної людини або родини. Ми заглиблюємось у вас, ваші звички, цінності й естетику. Комерційний проєкт орієнтований на бізнес-задачу і цільову аудиторію бізнесу.',
  },
  {
    id: 'priv-2',
    question: 'Ви проєктуєте квартири будь-якої площі?',
    answer:
      'Мінімальний проєкт рахуємо як 120 м². Менші об\'єкти рахуємо умовно за 120 м² (дизайн від $7 200). Зверніться для уточнення — завжди знайдемо рішення.',
  },
  {
    id: 'priv-3',
    question: 'Чи можна поєднати дизайн квартири та авторський нагляд?',
    answer:
      'Так, це наш стандартний підхід. Після затвердження проєкту архітектор контролює реалізацію на майданчику — авторський нагляд $800/міс (Київ).',
  },
  {
    id: 'priv-4',
    question: 'Ви проєктуєте котеджі разом з архітектурою?',
    answer:
      'Так. Ми бюро повного циклу: архітектурне проєктування будинку + дизайн інтер\'єру в одних руках. Це забезпечує узгодженість рішень і економить ваш час.',
  },
  {
    id: 'priv-5',
    question: 'Скільки часу займає дизайн приватного будинку?',
    answer:
      'Для будинку 150–300 м² — орієнтовно 12–20 тижнів. Залежить від площі, кількості поверхів і складності інтер\'єру. Фіксуємо у договорі.',
  },
];

// DRAFT: переписати під голос МУАС, не публікувати як є
const SPACE_TYPES = [
  {
    t: 'Квартири',
    d: 'Студії, 1–4 кімнатні квартири, апартаменти. Оптимізуємо планування під спосіб життя, нейтралізуємо недоліки планування.',
  },
  {
    t: 'Приватні будинки',
    d: 'Двоповерхові котеджі та заміські резиденції. Узгоджуємо дизайн з архітектурою — від фасаду до останньої деталі.',
  },
  {
    t: 'Котеджі',
    d: 'Комплексний підхід: архітектурне проєктування + дизайн інтер\'єру. Від ділянки до ключів.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Послуги', item: `${SITE_URL}/posluhy` },
    { '@type': 'ListItem', position: 3, name: 'Приватні простори', item: `${SITE_URL}/posluhy/pryvatni-prostory` },
  ],
};

const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Дизайн приватних просторів',
  description:
    "Дизайн інтер'єру квартир, будинків і котеджів у Києві. Авторський стиль МУАС, повний цикл від концепції до реалізації.",
  provider: { '@type': 'LocalBusiness', name: 'Bureau X', url: SITE_URL },
  areaServed: ['Київ', 'Україна'],
  url: `${SITE_URL}/posluhy/pryvatni-prostory`,
};

export default async function PryvatniProstoryPage() {
  const projects = await getProjectsByCategory('PRIVATE').catch(() => []);

  return (
    <>
      <Script
        id="ld-bc-priv"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="ld-svc-priv"
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
          <li className="text-ink" aria-current="page">Приватні простори</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-wide pt-8 pb-16 lg:pb-24">
        <Reveal>
          <p className="eyebrow">Послуги</p>
          <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
            Дизайн приватних просторів — квартири, будинки, котеджі
          </h1>
        </Reveal>
        <Reveal delay={120}>
          {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">
            Авторський стиль МУАС, повний цикл від концепції до реалізації. Кожен проєкт — про вас:
            вашу особистість, спосіб життя та естетику. Не шаблони — простір зі змістом.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-8">
            <CtaButton
              kind="consult"
              className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
            >
              <span>⟶</span> Записатися на консультацію
            </CtaButton>
          </div>
        </Reveal>
      </section>

      {/* Типи просторів: Квартири / Приватні будинки / Котеджі */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Для яких просторів</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line lg:grid-cols-3">
          {SPACE_TYPES.map((s, i) => (
            <Reveal key={s.t} delay={i * 60}>
              <div className="py-4 pr-10">
                <h3 className="display-xl text-lg font-normal">{s.t}</h3>
                {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* МУАС в приватному просторі */}
      <section className="bg-coal py-16 text-paper lg:py-24">
        <div className="container-wide">
          <Reveal>
            <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">МУАС в приватному просторі</h2>
          </Reveal>
          <Reveal delay={120}>
            {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              Молодий Український Архітектурний Стиль — авторська концепція Bureau X. Три принципи
              кожного приватного проєкту: особистий (про вас і вашу родину), функціональний (про
              зручність і спосіб життя), смисловий (про що має бути цей дім). Сучасна естетика
              з українським корінням і особистою історією клієнта.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Реалізовані проєкти */}
      {projects.length > 0 && (
        <section className="container-wide py-16 lg:py-24 border-t border-line">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Реалізовані проєкти</h2>
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
