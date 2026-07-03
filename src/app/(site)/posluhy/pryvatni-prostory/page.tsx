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
  title: { absolute: 'Дизайн приватних просторів — квартири, будинки, котеджі · bureau X Київ' },
  description:
    "Дизайн інтер'єру квартири, приватного будинку або котеджу у Києві. bureau X — авторський стиль МУАС, повний цикл: концепція, проєкт, реалізація.",
};

const FAQS = [
  {
    id: 'priv-1',
    question: 'Скільки коштує дизайн квартири чи будинку?',
    answer:
      'Від $60/м² — повний проєкт під реалізацію (планування, візуалізація, креслення, специфікація). Точну цифру називаємо після короткого брифу.',
  },
  {
    id: 'priv-2',
    question: 'Я хочу сміливо, але без «українськості» — так можна?',
    answer:
      'Так. Більшість тих, хто так каже, не хоче орнаментів і символів — і це нормально. Натуральність, ручна робота й характер лишаються; простір виходить нашим, просто чистим у символах.',
  },
  {
    id: 'priv-3',
    question: 'Ви працюєте з ручними речами майстрів для дому?',
    answer:
      'Так. Кераміка, різьба, ткані речі — маємо свою мережу українських ремісників і закладаємо їхні предмети у проєкт. Ваших майстрів теж підключаємо.',
  },
  {
    id: 'priv-4',
    question: 'Скільки часу займає проєкт приватного інтер\'єру?',
    answer:
      '1,5–3 місяці залежно від площі. Етапи зафіксовані, ви бачите проміжний результат.',
  },
  {
    id: 'priv-5',
    question: 'Ви ведете проєкт до реалізації?',
    answer:
      'Так — можемо довести до ремонту під ключ і авторського нагляду. Дизайн і реалізація в одних руках означає менше переробок і чіткі строки.',
  },
];

const SPACE_TYPES = [
  {
    t: 'Квартири та апартаменти',
    d: 'Небанальний інтер\'єр без етнографії — натуральність, фактура, ручна робота. Символи — стільки, скільки готові ви.',
  },
  {
    t: 'Приватні будинки',
    d: 'Простір, де український код розкривається повністю — від матеріалу до світла.',
  },
  {
    t: 'Резиденції та колекційні інтер\'єри',
    d: 'Для тих, хто збирає авторські речі й хоче простір, що звучить як ціле. Тут експериментуємо найглибше.',
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
  provider: { '@type': 'LocalBusiness', name: 'bureau X', url: SITE_URL },
  areaServed: ['Київ', 'Україна'],
  url: `${SITE_URL}/posluhy/pryvatni-prostory`,
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      minPrice: 60,
      priceCurrency: 'USD',
      unitText: 'за м²',
    },
    description: 'Повний проєкт під реалізацію — від $60/м². Мінімальний проєкт 120 м² (від $7 200).',
  },
};

export default async function PryvatniProstoryPage() {
  const projects = await getProjectsByCategory('PRIVATE').catch(() => []);

  return (
    <>
      <script
        id="ld-bc-priv"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
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
        <p className="eyebrow">Послуги</p>
        <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
          Дизайн приватних просторів — квартири, будинки, резиденції
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">
          Дім, який схожий на вас, а не на каталог. Робимо характерні інтер'єри з натуральних
          матеріалів і ручної роботи українських майстрів — для тих, хто хоче не «як у всіх»,
          а своє. Український код лишається, навіть коли символів у проєкті немає.
        </p>
        <div className="mt-8">
          <CtaButton
            kind="estimate"
            className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
          >
            <span>⟶</span> Обговорити ваш простір
          </CtaButton>
        </div>
      </section>

      {/* Типи просторів */}
      <section className="container-wide py-16 lg:py-24 border-t border-line">
        <Reveal>
          <h2 className="display-xl text-[clamp(1.5rem,3vw,2.5rem)]">Для яких просторів</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Для тих, хто хоче простір із характером і готовий на щось сміливіше за «сучасну класику».
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 pt-8 border-t border-line lg:grid-cols-3">
          {SPACE_TYPES.map((s, i) => (
            <Reveal key={s.t} delay={i * 60}>
              <div className="py-4 pr-10">
                <h3 className="display-xl text-lg font-normal">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
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
              «Сміливо» для нас — не про епатаж, а про чесність матеріалу й ручну роботу.
              Недосконале дерево, кераміка майстрів, ткані речі — те, що робить дім теплим і не
              схожим на студійний. Ми не малюємо вигаданий декор — ми доводимо реальні ручні речі
              до вашого простору.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-xl mt-12 text-[clamp(1.5rem,3vw,2.5rem)]">
              Український дім, а не музей
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
              МУАС у приватному просторі — це захисток через натуральне й ручне, а не виставка з
              орнаментами. Дерево з недосконалістю, кераміка, тканина, символ як тихий акцент.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/50">
              МУАС — Молодий Український Архітектурний Стиль. Свого часу модерн змінив те, як
              виглядали будинки й інтер'єри цілого покоління. МУАС — сучасна відповідь: не ностальгія
              за минулим, а нова мова, яка говорить про сьогоднішню Україну через матеріал і форму.
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
