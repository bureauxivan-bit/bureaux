'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Faq = { id: string; question: string; answer: string };

export function Faq({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  if (!faqs.length) return null;

  return (
    <section className="container-wide py-24 lg:py-36">
      <h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">Часті запитання</h2>
      <div className="mt-12 divide-y divide-line border-t border-line">
        {faqs.map((f) => {
          const isOpen = open === f.id;
          return (
            <div key={f.id}>
              <button
                onClick={() => setOpen(isOpen ? null : f.id)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="display-xl text-lg sm:text-xl">{f.question}</span>
                <span className={`text-2xl text-terra transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
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
                    <p className="max-w-2xl pb-7 leading-relaxed text-muted">{f.answer}</p>
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
