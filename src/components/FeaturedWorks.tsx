import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { CATEGORY_LABELS } from '@/lib/constants';

type P = {
  id: string; slug: string; title: string; year: number; category: string;
  coverId: string | null; images: { id: string; url: string }[];
};

function coverUrl(p: P) {
  if (p.coverId) {
    const f = p.images.find((i) => i.id === p.coverId);
    if (f) return f.url;
  }
  return p.images[0]?.url ?? null;
}

// Alternating aspect-ratio + vertical offset pattern
const PATTERNS = [
  { ar: 'aspect-[4/3]',  offset: ''           },
  { ar: 'aspect-[3/4]',  offset: 'sm:mt-[8%]' },
  { ar: 'aspect-[3/4]',  offset: ''           },
  { ar: 'aspect-[4/3]',  offset: 'sm:mt-[8%]' },
  { ar: 'aspect-[16/10]', offset: ''          },
  { ar: 'aspect-[3/4]',  offset: 'sm:mt-[8%]' },
];

export function FeaturedWorks({ projects }: { projects: P[] }) {
  return (
    <section id="projects" className="scroll-mt-24">

      {/* Section header */}
      <div className="container-wide border-y border-line py-6">
        <div className="flex items-center justify-between">
          <h2 className="display-xl text-[clamp(1.4rem,3vw,2.4rem)]">Проєкти</h2>
          <Link
            href="/projects"
            className="hidden bg-ink px-5 py-2.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70 sm:inline-flex"
          >
            Дивитися всі →
          </Link>
        </div>
      </div>

      {/* Grid */}
      {projects.length ? (
        <div className="px-6 pb-12 pt-8 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 gap-x-5 gap-y-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
            {projects.map((p, i) => {
              const { ar, offset } = PATTERNS[i % PATTERNS.length];
              const url = coverUrl(p);
              return (
                <Reveal key={p.id} delay={i % 3 === 0 ? 0 : i % 3 === 1 ? 80 : 160} className={offset}>
                  <Link href={`/projects/${p.slug}`} className="group mb-7 block sm:mb-9">

                    {/* Image */}
                    <div className={`relative ${ar} overflow-hidden bg-ink/5`}>
                      {url ? (
                        <img
                          src={url}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="display-xl text-6xl text-ink/10">X</span>
                        </div>
                      )}
                    </div>

                    {/* Caption */}
                    <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                      <span className="display-xl text-sm font-normal transition-opacity duration-300 group-hover:opacity-50 sm:text-base">
                        {p.title}
                      </span>
                      <span className="ml-4 shrink-0 text-xs text-muted">{p.year}</span>
                    </div>

                    {/* Category tag */}
                    <p className="mt-1.5 text-[11px] uppercase tracking-wider text-muted/60">
                      {CATEGORY_LABELS[p.category]}
                    </p>

                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* Mobile "all projects" link */}
          <div className="mt-2 sm:hidden">
            <Link href="/projects" className="btn-ghost w-full justify-center">
              Дивитися всі проєкти
            </Link>
          </div>
        </div>
      ) : (
        <p className="container-wide py-16 text-muted">Проєкти зʼявляться найближчим часом.</p>
      )}

    </section>
  );
}
