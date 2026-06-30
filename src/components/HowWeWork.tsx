import { Reveal } from './Reveal';

const STEPS = [
  {
    num: '01',
    title: 'Бриф',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: 'Знайомство, обговорення задачі, побажань та бюджету. Виїзд на об\'єкт або відеозустріч.',
  },
  {
    num: '02',
    title: 'Концепт',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: 'Планувальне рішення, настрійний борд, кольорова палітра. Фіксуємо напрямок до погодження.',
  },
  {
    num: '03',
    title: 'Візуалізації',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: '3D-рендери ключових зон. Ви бачите результат до початку ремонту.',
  },
  {
    num: '04',
    title: 'Робочі креслення',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: 'Повний пакет документації: розкладки, розрізи, специфікації матеріалів і меблів.',
  },
  {
    num: '05',
    title: 'Комплектація',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: 'Підбір та замовлення меблів, світла, текстилю. Знижки від партнерів бюро.',
  },
  {
    num: '06',
    title: 'Авторський нагляд',
    // DRAFT: переписати під голос МУАС, не публікувати як є
    desc: 'Контроль реалізації на майданчику. Відповідаємо за відповідність проєкту.',
  },
];

export function HowWeWork() {
  return (
    <section className="container-wide py-24 lg:py-36">
      <Reveal>
        <p className="eyebrow">Процес</p>
        <h2 className="display-xl mt-5 text-[clamp(2rem,5vw,4rem)]">Як ми працюємо</h2>
      </Reveal>

      <div className="mt-10 grid gap-8 pt-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.num} delay={i * 60}>
            <div className="py-4 pr-8">
              <span className="text-[10px] font-normal uppercase tracking-[0.28em] text-muted">
                {s.num}
              </span>
              <h3 className="display-xl mt-3 text-base font-normal sm:text-lg">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* DRAFT: переписати під голос МУАС, не публікувати як є */}
      <Reveal delay={400}>
        <p className="mt-8 border-l-2 border-line pl-5 text-xs leading-relaxed text-muted">
          До кожного етапу — необмежені мікро-правки в рамках завдання. Кардинальна зміна концепції
          рахується окремо — про це домовляємось на березі.
        </p>
      </Reveal>
    </section>
  );
}
