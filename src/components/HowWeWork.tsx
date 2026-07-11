import { useTranslations } from 'next-intl';
import { Reveal } from './Reveal';

export type WorkStep = { title: string; desc: string };

interface HowWeWorkProps {
  steps?: WorkStep[];
  note?: string | null;
}

export function HowWeWork({ steps, note }: HowWeWorkProps) {
  const t = useTranslations('howWeWork');
  // Defaults live in the messages files so both locales get proper copy;
  // explicit props (e.g. page-specific step lists) still win.
  const resolvedSteps = steps ?? (t.raw('steps') as WorkStep[]);
  const resolvedNote = note === undefined ? t('note') : note;
  return (
    <section className="container-wide py-24 lg:py-36">
      <Reveal>
        <p className="eyebrow">{t('eyebrow')}</p>
        <h2 className="display-xl mt-5 text-[clamp(2rem,5vw,4rem)]">{t('heading')}</h2>
      </Reveal>

      <div className="mt-10 grid gap-8 pt-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {resolvedSteps.map((s, i) => (
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

      {resolvedNote && (
        <Reveal delay={400}>
          <p className="mt-8 border-l-2 border-line pl-5 text-xs leading-relaxed text-muted">
            {resolvedNote}
          </p>
        </Reveal>
      )}
    </section>
  );
}
