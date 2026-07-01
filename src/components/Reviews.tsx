import Script from 'next/script';
import { Reveal } from './Reveal';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

type Review = { id: string; author: string; projectName: string | null; text: string };

export function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;

  const reviewLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'bureau X',
    url: SITE_URL,
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewBody: r.text,
      ...(r.projectName ? { name: r.projectName } : {}),
    })),
  };

  return (
    <section className="container-wide py-24 lg:py-36">
      <Script
        id="ld-reviews"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }}
      />

      <Reveal>
        <h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">Відгуки</h2>
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
