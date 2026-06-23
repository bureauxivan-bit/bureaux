'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { LeadType } from '@/lib/types';
import { LeadForm } from './LeadForm';

type ModalConfig = { type: LeadType; title: string; subtitle: string };

const PRESETS: Record<'estimate' | 'consult', ModalConfig> = {
  estimate: {
    type: 'ESTIMATE',
    title: 'Прорахунок проєкту',
    subtitle: 'Залиште заявку на безкоштовний прорахунок проєкту та консультацію.',
  },
  consult: {
    type: 'CONSULT',
    title: 'Консультація',
    subtitle: 'Залиште заявку на безкоштовну консультацію.',
  },
};

type Ctx = { openEstimate: () => void; openConsult: () => void };
const LeadModalCtx = createContext<Ctx>({ openEstimate: () => {}, openConsult: () => {} });

export const useLeadModal = () => useContext(LeadModalCtx);

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const openEstimate = useCallback(() => setConfig(PRESETS.estimate), []);
  const openConsult = useCallback(() => setConfig(PRESETS.consult), []);
  const close = useCallback(() => setConfig(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    if (config) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [config, close]);

  return (
    <LeadModalCtx.Provider value={{ openEstimate, openConsult }}>
      {children}
      <AnimatePresence>
        {config && (
          <motion.div
            className="modal-root fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} />
            <motion.div
              role="dialog" aria-modal="true" aria-label={config.title}
              className="relative w-full max-w-md bg-paper p-7 shadow-2xl sm:p-9"
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            >
              <button
                onClick={close} aria-label="Закрити"
                className="absolute right-5 top-5 text-2xl leading-none text-muted transition-colors hover:text-ink"
              >
                ×
              </button>
              <p className="eyebrow mb-3">BUREAUX</p>
              <h3 className="display-xl text-2xl">{config.title}</h3>
              <p className="mb-6 mt-2 text-sm text-muted">{config.subtitle}</p>
              <LeadForm type={config.type} onBeforeRedirect={close} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LeadModalCtx.Provider>
  );
}
