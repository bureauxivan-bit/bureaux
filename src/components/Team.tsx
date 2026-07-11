import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Reveal } from './Reveal';

type Member = { id: string; name: string; role: string; quote: string | null; photoUrl: string | null };

export function Team({ team }: { team: Member[] }) {
  const t = useTranslations('team');
  if (!team.length) return null;
  return (
    <section className="border-t border-line">
      {/* Two-column grid inside container */}
      <div className="container-wide py-12 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {team.map((m, i) => (
          <Reveal key={m.id} delay={i * 100}>
            <article>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink/5">
                {m.photoUrl ? (
                  <Image
                    src={m.photoUrl}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top grayscale transition-[filter] duration-700 hover:grayscale-0"
                  />
                ) : (
                  <div className="h-full w-full bg-ink/10" />
                )}
              </div>
              <div className="py-5">
                <h3 className="display-xl text-sm font-bold uppercase tracking-[0.2em]">{m.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted">{m.role}</p>
                {m.quote && (
                  <p className="mt-4 text-sm leading-relaxed text-ink/60">«{m.quote}»</p>
                )}
              </div>
            </article>
          </Reveal>
        ))}
        </div>
      </div>

      {/* Link to studio page */}
      <div className="px-8 py-10 text-center lg:px-12">
        <Link
          href="/studio"
          className="hidden bg-ink px-5 py-2.5 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70 sm:inline-flex"
        >
          {t('link')} →
        </Link>
        <Link
          href="/studio"
          className="btn-ghost w-full justify-center sm:hidden"
        >
          {t('link')} →
        </Link>
      </div>
    </section>
  );
}
