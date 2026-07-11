import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CtaButton } from './CtaButton';
import { ProjectsButton } from './ProjectsButton';
import { ScrollCue } from './ScrollCue';

export function Hero({ heroImage }: { heroImage?: string | null }) {
  const t = useTranslations('hero');
  const src = heroImage || '/images/hero.jpg';

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden text-paper">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={t('imageAlt')}
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
              {t('titleLine1')}<br className="hidden sm:block" />{' '}
              {t('titleLine2')}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-paper/65 sm:text-lg">
              {t('subtitle')}
            </p>
          </div>

          {/* CTAs — primary (estimate) + softer secondary (projects) */}
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:pb-1">
            <CtaButton
              kind="estimate"
              className="group inline-flex items-center justify-center gap-3 bg-paper px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-coal transition-opacity duration-200 hover:opacity-85"
            >
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              {t('cta')}
            </CtaButton>
            <ProjectsButton
              className="inline-flex items-center justify-center border border-paper/40 px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-paper/10"
            />
          </div>

        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
