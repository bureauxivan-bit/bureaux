import { Reveal } from './Reveal';

export type WorkStep = { title: string; desc: string };

const DEFAULT_STEPS: WorkStep[] = [
  {
    title: 'Бриф',
    desc: 'Знайомство, обговорення задачі, побажань та бюджету. Виїзд на об\'єкт або відеозустріч.',
  },
  {
    title: 'Концепт',
    desc: 'Планувальне рішення, настрійний борд, кольорова палітра. Фіксуємо напрямок до погодження.',
  },
  {
    title: 'Візуалізації',
    desc: '3D-рендери ключових зон. Ви бачите результат до початку ремонту.',
  },
  {
    title: 'Робочі креслення',
    desc: 'Повний пакет документації: розкладки, розрізи, специфікації матеріалів і меблів.',
  },
  {
    title: 'Комплектація',
    desc: 'Підбір та замовлення меблів, світла, текстилю. Знижки від партнерів бюро.',
  },
  {
    title: 'Авторський нагляд',
    desc: 'Контроль реалізації на майданчику. Відповідаємо за відповідність проєкту.',
  },
];

const DEFAULT_NOTE =
  'До кожного етапу — необмежені мікро-правки в рамках завдання. Кардинальна зміна концепції рахується окремо — про це домовляємось на березі.';

interface HowWeWorkProps {
  steps?: WorkStep[];
  note?: string | null;
}

export function HowWeWork({ steps = DEFAULT_STEPS, note = DEFAULT_NOTE }: HowWeWorkProps) {
  return (
    <section className="container-wide py-24 lg:py-36">
      <Reveal>
        <p className="eyebrow">Процес</p>
        <h2 className="display-xl mt-5 text-[clamp(2rem,5vw,4rem)]">Як ми працюємо</h2>
      </Reveal>

      <div className="mt-10 grid gap-8 pt-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 60}>
            <div className="py-4 pr-8">
              <span className="text-[10px] font-normal uppercase tracking-[0.28em] text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="display-xl mt-3 text-base font-normal sm:text-lg">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {note && (
        <Reveal delay={400}>
          <p className="mt-8 border-l-2 border-line pl-5 text-xs leading-relaxed text-muted">
            {note}
          </p>
        </Reveal>
      )}
    </section>
  );
}
