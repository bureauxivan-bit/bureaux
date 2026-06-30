import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from './Reveal';

type Service = { id: string; number: number; title: string; description: string | null; coverUrl: string | null };

function getServiceHref(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('інтер')) return '/posluhy/dyzajn-intereru';
  if (t.includes('архітектур')) return '/posluhy/arkhitektura';
  if (t.includes('ремонт')) return '/posluhy/remont-pid-klyuch';
  if (t.includes('комерц')) return '/posluhy/komertsiini-prymishchennia';
  if (t.includes('приватн')) return '/posluhy/pryvatni-prostory';
  return '/posluhy';
}

export function Services({ services }: { services: Service[] }) {
  if (!services.length) return null;

  return (
    <section id="services" className="scroll-mt-24 py-24 lg:py-36">

      {/* header row */}
      <div className="container-wide mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <p className="display-xl max-w-xs text-[clamp(1rem,2vw,1.5rem)] uppercase leading-tight tracking-tight">
            Усі проєкти ми виконуємо у нашому авторському українському стилі
          </p>
        </Reveal>
        <Reveal delay={100}>
          <Link
            href="/posluhy"
            className="inline-flex shrink-0 items-center gap-3 bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-opacity duration-200 hover:opacity-75"
          >
            <span>→</span>
            Всі послуги
          </Link>
        </Reveal>
      </div>

      {/* images grid */}
      <div className="container-wide grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {services.map((s, i) => {
          const href = getServiceHref(s.title);
          return (
            <Reveal key={s.id} delay={i * 80}>
              <Link href={href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                  {s.coverUrl ? (
                    <Image
                      src={s.coverUrl}
                      alt={`${s.title} — дизайн інтер'єру bureau X Київ`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted/20">
                      <span className="display-xl text-7xl">X</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-b border-line pb-4">
                  <span className="text-xs font-normal uppercase tracking-widest">{s.title}</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
