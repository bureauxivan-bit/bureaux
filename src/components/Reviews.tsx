import { useTranslations } from 'next-intl';
import { Reveal } from './Reveal';

type Review = { id: string; author: string; projectName: string | null; text: string };

// Без Review JSON-LD навмисно: Google з 2019 ігнорує self-serving відгуки
// (розмітку відгуків про компанію на її ж сайті), а без reviewRating вона
// ще й невалідна. Текст відгуків у HTML — цього достатньо для AI-краулерів.
export function Reviews({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('reviews');
  if (!reviews.length) return null;

  return (
    <section className="container-wide py-24 lg:py-36">
      <Reveal>
        <h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">{t('heading')}</h2>
      </Reveal>

      {/* Desktop grid */}
      <div className="mt-12 hidden gap-px bg-line sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.id} delay={i * 60}>
            <blockquote className="flex h-full flex-col bg-paper p-7 lg:p-9">
              <p className="display-xl flex-1 text-base leading-relaxed lg:text-lg">«{r.text}»</p>
              <footer className="mt-6 flex items-center gap-3 text-sm">
                <span className="h-px w-8 shrink-0 bg-ink" />
                <div>
                  <span className="font-normal">{r.author}</span>
                  {r.projectName && (
                    <span className="mt-0.5 block text-xs text-muted">{r.projectName}</span>
                  )}
                </div>
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </div>

      {/* Mobile horizontal scroll with snap */}
      <div className="-mx-5 mt-10 flex snap-x snap-mandatory overflow-x-auto gap-3 px-5 pb-4 sm:hidden">
        {reviews.map((r) => (
          <blockquote
            key={r.id}
            className="flex w-[85vw] shrink-0 snap-center flex-col border border-line p-6"
          >
            <p className="display-xl flex-1 text-base leading-relaxed">«{r.text}»</p>
            <footer className="mt-5 flex items-center gap-3 text-sm">
              <span className="h-px w-7 shrink-0 bg-ink" />
              <div>
                <span className="font-normal">{r.author}</span>
                {r.projectName && (
                  <span className="mt-0.5 block text-xs text-muted">{r.projectName}</span>
                )}
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
