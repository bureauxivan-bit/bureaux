import { Reveal } from './Reveal';

const ROWS = [
  {
    name: "Дизайн інтер'єру",
    price: 'від $60/м²',
    note: 'Повний проєкт: планування, візуалізації, креслення, специфікації — усе для реалізації ремонту',
  },
  {
    name: 'Архітектурне проєктування',
    price: 'від $40/м²',
    note: 'Повний проєкт: ескіз, планування, конструктивні рішення, робочі креслення — від концепції до дозволу на будівництво',
  },
  {
    name: 'Авторський супровід реалізації',
    price: '$800/міс',
    note: 'Київ; інші міста та країни — перерахунок за запитом. Окремо від вартості проєкту',
  },
  {
    name: 'Мінімальний проєкт',
    price: 'від 120 м²',
    note: "Менші об'єкти рахуємо як 120 м²: дизайн від $7200, архітектура від $4800",
  },
];

export function PricingBlock() {
  return (
    <section id="pricing" className="container-wide scroll-mt-24 py-24 lg:py-36">
      <Reveal>
        <p className="eyebrow">Вартість</p>
        <h2 className="display-xl mt-5 text-[clamp(2rem,5vw,4rem)]">Вартість послуг</h2>
      </Reveal>

      <div className="mt-14 border-t border-line">
        {ROWS.map((r, i) => (
          <Reveal key={r.name} delay={i * 60}>
            <div className="grid gap-2 border-b border-line py-5 sm:grid-cols-[2fr_1fr_2fr] sm:items-baseline sm:gap-6">
              <span className="text-xs font-normal uppercase tracking-widest">{r.name}</span>
              <span className="display-xl text-2xl font-light sm:text-right">{r.price ?? '—'}</span>
              {r.note
                ? <span className="text-xs leading-relaxed text-muted">{r.note}</span>
                : <span />
              }
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={340}>
        <p className="mt-7 border-l-2 border-line pl-5 text-xs leading-relaxed text-muted">
          Орієнтовний бюджет реалізації «під ключ» (проєкт + ремонт) — від $1400/м².
          Для планування загального бюджету; вартість самого проєктування — $60/м².
        </p>
      </Reveal>
    </section>
  );
}
