import type { Metadata } from 'next';
import Script from 'next/script';
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
  title: { absolute: 'Дизайн комерційних приміщень у Києві — Bureau X' },
  description:
    'Дизайн ресторанів, кафе, офісів, магазинів та готелів у Києві від Bureau X. Розуміємо бізнес-логіку простору, реалізуємо під ключ.',
};

const FAQS = [
  {
    id: 'kom-1',
    question: 'Скільки коштує дизайн комерційного приміщення?',
    answer:
      'Від $60/м² — повний проєкт під реалізацію. Комерція складніша за житло функціонально, тому точну цифру називаємо після брифу за обсягом і задачею.',
  },
  {
    id: 'kom-2',
    question: 'Ви робите проєкти, які приваблюють відвідувачів?',
    answer:
      'Так, це закладаємо свідомо: вау-зони, фотозони, маршрут погляду. Комерційний інтер\'єр має повертати вкладене, а не лише подобатися.',
  },
  {
    id: 'kom-3',
    question: 'У вас є досвід у HoReCa?',
    answer:
      'Так — ресторани й комплекси відпочинку, зокрема в Карпатах та Закарпатті. Проєкти з людьми та фото — є в портфоліо.',
  },
  {
    id: 'kom-4',
    question: 'Скільки часу займає комерційний проєкт?',
    answer:
      'Залежить від площі й складності; фіксуємо строки після брифу. Етапність прозора — ви не чекаєте в тиші.',
  },
  {
    id: 'kom-5',
    question: 'Чи обов\'язково робити «українським»?',
    answer:
      'Ні. Наш почерк — характер і натуральність; етнічні символи додаємо стільки, скільки треба бренду. Простір усе одно виходить нашим.',
  },
];

const OBJECT_TYPES = [
  {
    t: 'Ресторани й кафе',
    d: 'Атмосфера, за якою повертаються й фотографуються. Наш досвід — від сімейних ресторанів до закладів із характером.',
  },
  {
    t: 'Готелі й бази відпочинку',
    d: 'Комплекси в Карпатах та Закарпатті — простір, що продає враження, а не лише ночівлю.',
  },
  {
    t: 'Офіси й коворкінги',
    d: 'Простір, який працює на бренд і на людей усередині.',
  },
];

const PROCESS_STEPS: WorkStep[] = [
  {
    title: 'Бриф',
    desc: 'Вивчаємо бізнес-задачу, цільову аудиторію, потік відвідувачів і операційні процеси.',
  },
  {
    title: 'Концепт і зонування',
    desc: 'Функціональний план, маршрут погляду, вау-зони — фіксуємо напрям до погодження.',
  },
  {
    title: 'Візуалізації',
    desc: '3D-рендери ключових зон. Ви бачите результат до початку будівництва.',
  },
  {
    title: 'Робочі креслення',
    desc: 'Повний пакет документації під реалізацію: розкладки, розрізи, специфікації.',
  },
  {
    title: 'Комплектація',
    desc: 'Підбір матеріалів, меблів, освітлення, предметів ручної роботи. Доставляємо.',
  },
  {
    title: 'Здача',
    desc: 'Авторський нагляд на об\'єкті — контролюємо відповідність проєкту до фінального результату.',
  },
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
          Дизайн комерційних приміщень — ресторани, готелі, офіси
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">
          Комерційний інтер'єр має заробляти: приводити відвідувача, утримувати його й змушувати
          повертатися. Тут ми ставимо сміливі рішення, вау-зони й фотозони — з українським
          характером, який вирізняє вас із десятка однакових.
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

      {/* Типи просторів */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Типи просторів</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Простір, який працює на трафік і на впізнаваність, а не просто «гарний».
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line sm:grid-cols-2">
          {OBJECT_TYPES.map((o, i) => (
            <Reveal key={o.t} delay={i * 60}>
              <div className="py-4 pr-10">
                <h3 className="display-xl text-lg font-normal">{o.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.d}</p>
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
              Відвідувач обирає очима за секунди. Ми проєктуємо ті секунди: точку входу, маршрут
              погляду, зони, які хочеться зняти й показати. Український код тут — не етнографія, а
              те, що робить вас впізнаваним, а не «ще одним лотком».
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-xl mt-12 text-[clamp(1.5rem,3vw,2.5rem)]">
              Український характер, який працює на бізнес
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              У комерції МУАС розкривається найсміливіше: натуральні матеріали, ручна робота
              майстрів і сучасна трактовка українського — те, чого немає в мережевих інтер'єрах
              «під копірку».
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/50">
              МУАС — Молодий Український Архітектурний Стиль. Ми його назвали й хочемо
              масштабувати: щоб простори з українським характером ставали нормою, а не
              виключенням — у ресторанах, готелях, офісах по всій країні.
            </p>
          </Reveal>
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
        <HowWeWork steps={PROCESS_STEPS} note="Строки та кошторис фіксуємо після брифу. Кардинальна зміна концепції після погодження — окрема домовленість." />
      </div>

      {/* FAQ */}
      <div className="border-t border-line">
        <Faq faqs={FAQS} />
      </div>

      <FinalCta />
    </>
  );
}
