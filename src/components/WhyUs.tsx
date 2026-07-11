import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Reveal } from './Reveal';

const ITEM_KEYS = ['experience', 'fullCycle', 'youth', 'meaning', 'individual', 'ukrainianCode'] as const;

export function WhyUs() {
  const t = useTranslations('whyUs');
  return (
    <section className="relative bg-coal py-24 text-paper lg:py-32 overflow-hidden">

      {/* Decorative Krest — right side, vertically centered, half visible */}
      <div
        className="pointer-events-none absolute top-1/2 -right-[240px] h-[480px] w-[480px] -translate-y-1/2 select-none opacity-[0.06]"
        aria-hidden="true"
      >
        <Image
          src="/images/Krest.png"
          alt=""
          fill
          sizes="480px"
          className="object-contain"
          style={{ filter: 'invert(1)' }}
        />
      </div>

      <div className="container-wide relative">

        {/* Heading */}
        <Reveal>
          <h2 className="display-xl text-[clamp(1.3rem,2.6vw,2.6rem)]">
            {t('heading')} bureau <em>X</em>
          </h2>
        </Reveal>

        {/* Thin rule */}
        <div className="mt-10 h-px bg-paper/10" />

        {/* 3-column grid of advantages */}
        <div className="mt-0 grid sm:grid-cols-2 lg:grid-cols-3">
          {ITEM_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 60}>
              <div className="group border-t border-paper/15 py-8 pr-10 transition-colors duration-300 hover:border-paper/30">
                <span className="text-[10px] uppercase tracking-[0.28em] text-paper/20">
                  0{i + 1}
                </span>
                <h3 className="display-xl mt-3 text-base font-normal transition-colors duration-300 group-hover:text-paper/90 sm:text-[1.05rem]">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/45">
                  {t(`items.${key}.desc`)}
                </p>
                {i === 5 && (
                  <div className="mt-5">
                    <Image
                      src="/images/MUAS.png"
                      alt={t('muasAlt')}
                      width={200}
                      height={40}
                      className="opacity-55 transition-opacity duration-300 group-hover:opacity-80"
                      style={{ filter: 'invert(1)' }}
                    />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
