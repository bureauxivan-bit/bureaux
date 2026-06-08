'use client';
import { useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/constants';

type P = {
  id: string; slug: string; title: string; year: number; category: string;
  coverId: string | null; images: { id: string; url: string }[];
};

export function ProjectsGrid({ projects }: { projects: P[] }) {
  const [cat, setCat] = useState<string | 'ALL'>('ALL');
  const filtered = cat === 'ALL' ? projects : projects.filter((p) => p.category === cat);

  const tabs: { key: string; label: string }[] = [
    { key: 'ALL', label: 'Усі' },
    ...CATEGORY_ORDER.map((c) => ({ key: c, label: CATEGORY_LABELS[c] })),
  ];

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setCat(t.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              cat === t.key ? 'bg-ink text-paper' : 'border border-ink/15 text-muted hover:border-ink hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <p className="mt-12 text-muted">У цій категорії поки немає проєктів.</p>
      )}
    </>
  );
}
