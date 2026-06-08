import Image from 'next/image';
import { Reveal } from './Reveal';

type Member = { id: string; name: string; role: string; quote: string | null; photoUrl: string | null };

export function Team({ team }: { team: Member[] }) {
  if (!team.length) return null;
  return (
    <section className="bg-paper py-8 lg:py-12">
      <div className="container-wide grid gap-6 md:grid-cols-2">
        {team.map((m, i) => (
          <Reveal key={m.id} delay={i * 120}>
            <article className="flex h-full flex-col gap-6 rounded-2xl border border-line p-7 sm:flex-row">
              <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-ink/5 sm:w-44">
                {m.photoUrl && <Image src={m.photoUrl} alt={m.name} fill sizes="200px" className="object-cover" />}
              </div>
              <div>
                <h3 className="display-xl text-xl">{m.name}</h3>
                <p className="text-sm text-terra">{m.role}</p>
                {m.quote && <p className="mt-4 text-sm leading-relaxed text-muted">«{m.quote}»</p>}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
