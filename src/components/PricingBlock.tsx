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

      {/* Семантична таблиця цін (AEO): на мобільних клітинки стають блоками,
          на sm+ — звичайні табличні рядки, як у попередній div-сітці. */}
      <Reveal>
        <table className="mt-14 w-full border-collapse border-t border-line text-left">
          <caption className="sr-only">Вартість послуг bureau X</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Послуга</th>
              <th scope="col">Вартість</th>
              <th scope="col">Примітка</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr
                key={r.name}
                className="block border-b border-line py-5 sm:table-row sm:py-0"
              >
                <th
                  scope="row"
                  className="block w-auto text-xs font-normal uppercase tracking-widest sm:table-cell sm:w-[40%] sm:py-5 sm:pr-6 sm:align-baseline"
                >
                  {r.name}
                </th>
                <td className="display-xl block pt-2 text-2xl font-light sm:table-cell sm:w-[20%] sm:py-5 sm:pt-5 sm:text-right sm:align-baseline">
                  {r.price}
                </td>
                <td className="block pt-2 text-xs leading-relaxed text-muted sm:table-cell sm:py-5 sm:pl-6 sm:pt-5 sm:align-baseline">
                  {r.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={340}>
        <p className="mt-7 border-l-2 border-line pl-5 text-xs leading-relaxed text-muted">
          Орієнтовний бюджет реалізації «під ключ» (проєкт + ремонт) — від $1400/м².
          Для планування загального бюджету; вартість самого проєктування — $60/м².
        </p>
      </Reveal>
    </section>
  );
}
