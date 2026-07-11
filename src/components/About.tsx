import { useTranslations } from 'next-intl';
import { Reveal } from './Reveal';

export function About() {
  const t = useTranslations('about');
  return (
    <section id="about" className="container-wide scroll-mt-24 py-24 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div>
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="display-xl mt-5 text-[clamp(2rem,5vw,4rem)]">
              {t('titleLine1')}<br />{t('titleLine2')}<br />{t('titleLine3')}
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-6 text-lg leading-relaxed text-ink/80">
            <p>{t('p1')}</p>
            <p className="border-l-2 border-ink pl-6 text-ink">
              {t.rich('p2', { strong: (chunks) => <strong>{chunks}</strong> })}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
