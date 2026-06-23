'use client';
import { useState } from 'react';
import Image from 'next/image';

type Member = {
  id: string;
  name: string;
  role: string;
  quote: string | null;
  photoUrl: string | null;
};

export function StudioTeamList({ team }: { team: Member[] }) {
  const [activeId, setActiveId] = useState<string>(team[0]?.id ?? '');
  const active = team.find((m) => m.id === activeId) ?? team[0];

  return (
    <div className="container-wide grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px]">

      {/* Scrollable name list */}
      <div>
        {team.map((m) => {
          const isActive = m.id === activeId;
          return (
            <button
              key={m.id}
              onMouseEnter={() => setActiveId(m.id)}
              onClick={() => setActiveId(m.id)}
              className="group flex w-full items-baseline gap-5 border-b border-line py-6 text-left transition-colors"
              aria-current={isActive}
            >
              <span className="w-28 shrink-0 text-right text-xs tracking-wide text-muted transition-opacity sm:w-56">
                {m.role}
              </span>
              <span
                className={`display-xl text-[clamp(1.4rem,2.8vw,2.8rem)] leading-tight transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-20 group-hover:opacity-60'
                }`}
              >
                {m.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sticky photo panel */}
      <div className="hidden lg:block">
        <div className="sticky top-28">
          {active?.photoUrl ? (
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink/5">
              <Image
                key={active.id}
                src={active.photoUrl}
                alt={active.name}
                fill
                sizes="420px"
                className="object-cover object-top grayscale"
              />
            </div>
          ) : (
            <div className="aspect-[3/4] w-full bg-ink/5" />
          )}
          {active && (
            <div className="px-7 py-6">
              <p className="display-xl text-sm font-bold uppercase tracking-[0.18em]">
                {active.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted">{active.role}</p>
              {active.quote && (
                <p className="mt-4 text-sm leading-relaxed text-ink/55">«{active.quote}»</p>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
