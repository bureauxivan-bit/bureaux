'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Review = { id: string; author: string; projectName: string | null; text: string };

export function Reviews({ reviews }: { reviews: Review[] }) {
  const [i, setI] = useState(0);
  if (!reviews.length) return null;
  const go = (d: number) => setI((p) => (p + d + reviews.length) % reviews.length);
  const r = reviews[i];

  return (
    <section className="container-wide py-24 lg:py-36">
      <div className="flex items-end justify-between">
        <h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">Відгуки</h2>
        <div className="flex gap-3">
          <button onClick={() => go(-1)} aria-label="Назад"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper">←</button>
          <button onClick={() => go(1)} aria-label="Далі"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper">→</button>
        </div>
      </div>

      <div className="relative mt-12 min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={r.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <p className="display-xl text-2xl leading-snug sm:text-3xl">«{r.text}»</p>
            <footer className="mt-7 flex items-center gap-3 text-sm">
              <span className="h-px w-10 bg-terra" />
              <span className="font-semibold">{r.author}</span>
              {r.projectName && <span className="text-muted">· {r.projectName}</span>}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex gap-2">
        {reviews.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`Відгук ${idx + 1}`}
            className={`h-1 rounded-full transition-all ${idx === i ? 'w-10 bg-terra' : 'w-4 bg-ink/15'}`} />
        ))}
      </div>
    </section>
  );
}
