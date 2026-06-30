import Image from 'next/image';
import { CtaButton } from './CtaButton';

export function Hero({ heroImage }: { heroImage?: string | null }) {
  const src = heroImage || '/images/hero.jpg';

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden text-paper">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt="Bureau X — дизайн інтер'єру та архітектура під ключ, Київ"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay: transparent at top, dark at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-coal/90 via-coal/50 to-coal/40" />
      </div>

      {/* Text anchored to bottom */}
      <div className="container-wide relative mt-auto pb-16 pt-32 lg:pb-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          {/* Heading + subtext */}
          <div className="max-w-3xl">
            <h1 className="display-xl text-[clamp(1.8rem,3.5vw,3.5rem)] leading-[1.1]">
              bureau <em>X</em>{' '}
              дизайн інтер&rsquo;єру<br className="hidden sm:block" />{' '}
              та архітектура під ключ
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-paper/65 sm:text-lg">
              Функціональність, естетика та затишок у дусі сучасного молодого
              українського архітектурного стилю. Простір, що працює для вас.
              Реалізуємо проєкти по всій Україні та світу.
            </p>
          </div>

          {/* CTA — arrow style */}
          <div className="shrink-0 lg:pb-1">
            <CtaButton
              kind="consult"
              className="group inline-flex items-center gap-3 border border-paper/50 px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-all duration-300 hover:border-paper hover:bg-paper hover:text-coal"
            >
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              Безкоштовна консультація
            </CtaButton>
          </div>

        </div>
      </div>
    </section>
  );
}
