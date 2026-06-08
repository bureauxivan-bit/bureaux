import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from './Reveal';

type Service = { id: string; number: number; title: string; description: string | null; coverUrl: string | null };

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="container-wide scroll-mt-24 py-24 lg:py-36">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end">
        <Reveal>
          <h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">Послуги</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="max-w-md text-muted lg:justify-self-end lg:text-right">
            Усі проєкти ми виконуємо у нашому авторському українському стилі.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={i * 90}>
            <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-paper p-7 transition-colors duration-500 hover:border-ink">
              <div className="relative mb-20 aspect-[4/3] overflow-hidden rounded-xl bg-ink/5">
                {s.coverUrl && (
                  <Image src={s.coverUrl} alt={s.title} fill sizes="33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <span className="display-xl absolute right-4 top-3 text-6xl text-terra/30">
                  0{s.number}
                </span>
              </div>
              <h3 className="display-xl text-xl">{s.title}</h3>
              {s.description && <p className="mt-3 text-sm leading-relaxed text-muted">{s.description}</p>}
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={150}>
        <div className="mt-12">
          <Link href="/projects" className="btn-ghost">Дивитися всі проєкти</Link>
        </div>
      </Reveal>
    </section>
  );
}
