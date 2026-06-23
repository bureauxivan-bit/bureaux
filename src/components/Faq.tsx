'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal } from './Reveal';

type Faq = { id: string; question: string; answer: string };

export function Faq({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!faqs.length) return null;

  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  return (
    <section className="container-wide py-24 lg:py-36">
      <Reveal>
        <h2 className="display-xl mb-16 text-center text-[clamp(2rem,5vw,4rem)]">
          Часті запитання
        </h2>
      </Reveal>

      <div className="mx-auto max-w-3xl">
        {faqs.map((f, i) => {
          const isOpen = open === f.id;
          return (
            <div key={f.id} className={`border-t border-line ${i === faqs.length - 1 ? 'border-b' : ''}`}>
              <button
                onClick={() => toggle(f.id)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="display-xl text-sm font-bold uppercase leading-snug tracking-wider sm:text-base">
                  {f.question}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center border border-ink/25 text-lg leading-none transition-all duration-300 ${
                    isOpen ? 'rotate-45 border-ink bg-ink text-paper' : 'text-ink'
                  }`}
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 pr-14 text-sm leading-relaxed text-muted">{f.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
