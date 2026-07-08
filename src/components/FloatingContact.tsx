'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { trackEvent } from '@/lib/track';

type Props = { phone?: string | null; telegram?: string | null; instagram?: string | null };

// Passive, always-available contact affordance for the Instagram/mobile
// audience that prefers messaging over filling a form. Monochrome, square.
export function FloatingContact({ phone, telegram, instagram }: Props) {
  const [open, setOpen] = useState(false);

  const links: { label: string; href: string; event: string }[] = [];
  if (telegram) links.push({ label: 'Telegram', href: telegram, event: 'contact_telegram' });
  if (instagram) links.push({ label: 'Instagram Direct', href: instagram, event: 'contact_instagram' });
  if (phone) links.push({ label: 'Зателефонувати', href: `tel:${phone}`, event: 'contact_phone' });
  if (links.length === 0) return null;

  const toggle = () => {
    setOpen((v) => {
      if (!v) trackEvent('contact_open');
      return !v;
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5 print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            className="flex flex-col items-end gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
          >
            {links.map((l) => (
              <a
                key={l.event}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={() => trackEvent(l.event)}
                className="border border-ink/10 bg-paper px-4 py-2.5 text-xs font-normal uppercase tracking-widest text-ink shadow-lg transition-colors hover:bg-ink hover:text-paper"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggle}
        aria-label={open ? 'Закрити контакти' : 'Звʼязатися з нами'}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center bg-ink text-paper shadow-xl transition-transform duration-200 hover:scale-105"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 4h16v12H7l-3 3V4z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
