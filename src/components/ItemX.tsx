import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Reveal } from './Reveal';

export function ItemX({ url }: { url?: string | null }) {
  const t = useTranslations('itemX');
  return (
    <section className="container-wide pt-24 pb-12 lg:pt-32 lg:pb-16">
      <Reveal>
        <div className="relative overflow-hidden bg-ink text-paper">

          {/* Glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 bg-paper/8 blur-[120px]" />

          {/* Text */}
          <div className="relative px-8 pb-8 pt-12 sm:max-w-[52%] sm:px-16 sm:py-24 lg:min-h-[420px] lg:flex lg:flex-col lg:justify-center">
            <p className="eyebrow text-paper/50 -ml-10">{t('eyebrow')}</p>
            <h2 className="display-xl mt-5 text-[clamp(2rem,5vw,4rem)]">
              item <em>X</em> — {t('heading')}
            </h2>
            <p className="mt-5 text-paper/60">
              {t('subtitle')}
            </p>
            {/* Desktop only — button stays in text column */}
            <a
              href={url ?? 'https://itemx.art'}
              target="_blank"
              rel="noopener"
              className="mt-9 hidden sm:inline-flex items-center gap-2 bg-terra px-7 py-3.5 text-xs font-light uppercase tracking-widest text-paper transition-opacity duration-200 hover:opacity-80"
            >
              {t('cta')} ↗
            </a>
          </div>

          {/* Mobile: image first, then button */}
          <div className="sm:hidden">
            <Image
              src="/images/roz_hor.png"
              alt=""
              width={1200}
              height={600}
              className="h-auto w-full"
              aria-hidden="true"
            />
          </div>
          <div className="flex justify-center py-6 sm:hidden">
            <a
              href={url ?? 'https://itemx.art'}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-terra px-7 py-3.5 text-xs font-light uppercase tracking-widest text-paper transition-opacity duration-200 hover:opacity-80"
            >
              {t('cta')} ↗
            </a>
          </div>

          {/* Desktop: vertical image, absolute right */}
          <div
            className="pointer-events-none absolute right-10 top-1/2 hidden w-[320px] -translate-y-1/2 sm:block sm:w-[380px] lg:w-[440px]"
            aria-hidden="true"
          >
            <Image
              src="/images/artboard.png"
              alt=""
              width={800}
              height={1000}
              className="h-auto w-full"
            />
          </div>

        </div>
      </Reveal>
    </section>
  );
}
