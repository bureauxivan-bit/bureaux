import { Reveal } from './Reveal';

export function About() {
  return (
    <section id="about" className="container-wide scroll-mt-24 py-24 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div>
            <p className="eyebrow">Про нас</p>
            <h2 className="display-xl mt-5 text-[clamp(2rem,5vw,4rem)]">Бюро<br />архітектури<br />та дизайну</h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-6 text-lg leading-relaxed text-ink/80">
            <p>
              Ми бюро архітектури та дизайну, засновниками якого є молоде подружжя архітекторів за
              освітою та захопленням. Вже понад 5 років даруємо людям приємні емоції під час
              розробки дизайну та ремонту.
            </p>
            <p className="border-l-2 border-ink pl-6 text-ink">
              Ми створили <strong>Молодий Український Архітектурний Стиль (МУАС)</strong> — активно
              просуваємо новий стиль українського дизайну, поєднуючи сучасні тенденції та українські
              традиції.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
