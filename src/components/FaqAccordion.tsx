'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Reveal } from './Reveal';

type FaqItem = { id: string; question: string; answer: string };

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  return (
    <>
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

              {/* Always mounted so answers are present in server-rendered HTML
                  (AI crawlers don't execute JS); open/close is animation only. */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
                aria-hidden={!isOpen}
              >
                <p className="pb-7 pr-14 text-sm leading-relaxed text-muted">{f.answer}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </>
  );
}
