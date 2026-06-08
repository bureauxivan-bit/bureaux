import { CtaButton } from './CtaButton';
import { Reveal } from './Reveal';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-coal text-paper">
      {/* atmospheric layered background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-1/4 top-0 h-[120%] w-[70%] rounded-full bg-terra/15 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[60%] w-[40%] rounded-full bg-paper/5 blur-[120px]" />
      </div>

      <div className="container-wide relative flex min-h-[100svh] flex-col justify-center pb-20 pt-40">
        <Reveal>
          <p className="eyebrow text-paper/60">Молодий Український Архітектурний Стиль</p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="display-xl mt-7 max-w-5xl text-[clamp(2.6rem,8vw,7rem)]">
            Bureau<span className="text-terra">X</span> — дизайн інтер’єру та архітектура{' '}
            <span className="text-terra">під ключ</span>
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-paper/65 sm:text-lg">
            Функціональність, естетика та затишок у дусі сучасного молодого українського
            архітектурного стилю. Простір, що працює для вас. Реалізуємо проєкти по всій Україні та світу.
          </p>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-11 flex flex-col gap-4 sm:flex-row">
            <CtaButton kind="consult">Безкоштовна консультація</CtaButton>
            <a href="#projects" className="btn-ghost !border-paper/30 !text-paper hover:!bg-paper hover:!text-ink">
              Дивитися проєкти
            </a>
          </div>
        </Reveal>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-paper/40">
        <span className="inline-block animate-pulse">↓ гортайте</span>
      </div>
    </section>
  );
}
