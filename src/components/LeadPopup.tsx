'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { trackEvent } from '@/lib/track';

// Exit-intent lead magnet: a 1-minute "free estimate" mini-quiz shown once per
// session when a visitor is about to leave. Softer than a bare phone form for
// cold social traffic. 75% of visitors bounce off the hero — this catches some.

const SEEN_KEY = 'bx_popup_seen';        // once per tab session
const DISMISS_KEY = 'bx_popup_dismissed'; // cooldown after a manual close
const DONE_KEY = 'bx_lead_done';          // never nag someone who converted
const DISMISS_DAYS = 3;
const ELIGIBLE_MS = 25_000;   // "engaged enough to ask" threshold
const HARD_MS = 50_000;       // fallback if no exit signal fires

const OBJECTS = ['Квартира', 'Будинок', 'Комерція', 'Інше'];
const AREAS = ['до 50 м²', '50–100 м²', '100–200 м²', '200+ м²'];

export function LeadPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [objectType, setObjectType] = useState('');
  const [area, setArea] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const eligible = useRef(false);
  const shownRef = useRef(false);

  const show = useCallback(() => {
    if (shownRef.current) return;
    shownRef.current = true;
    setVisible(true);
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}
    trackEvent('popup_shown');
  }, []);

  // Don't show on conversion-adjacent pages.
  const suppressed = pathname === '/thank-you' || pathname.startsWith('/kontakty');

  useEffect(() => {
    if (suppressed) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      if (localStorage.getItem(DONE_KEY)) return;
      const dismissed = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (dismissed && Date.now() - dismissed < DISMISS_DAYS * 864e5) return;
    } catch {}

    const markEligible = () => { eligible.current = true; };
    const eligTimer = setTimeout(markEligible, ELIGIBLE_MS);
    const hardTimer = setTimeout(show, HARD_MS);

    const onScroll = () => {
      const doc = document.documentElement;
      const pct = (window.scrollY / (doc.scrollHeight - window.innerHeight)) * 100;
      if (pct > 40) markEligible();
      // mobile exit intent: eligible + scrolling back up toward the top
      if (eligible.current && window.scrollY < lastY.current - 8 && window.scrollY < 600) show();
      lastY.current = window.scrollY;
    };
    const lastY = { current: window.scrollY };
    const onMouseOut = (e: MouseEvent) => {
      if (eligible.current && e.clientY <= 0) show();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseout', onMouseOut);
    return () => {
      clearTimeout(eligTimer);
      clearTimeout(hardTimer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [suppressed, show]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = '';
      };
    }
  });

  const close = () => {
    setVisible(false);
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
  };

  const pickObject = (o: string) => { setObjectType(o); setStep(1); trackEvent('popup_start'); };
  const pickArea = (a: string) => { setArea(a); setStep(2); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          type: 'ESTIMATE',
          message: `Квіз: ${objectType}, ${area}`,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Сталася помилка. Спробуйте ще раз.');
      }
      try { localStorage.setItem(DONE_KEY, '1'); } catch {}
      trackEvent('popup_lead');
      if (typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track', 'Lead');
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка');
    } finally {
      setSubmitting(false);
    }
  };

  const chip =
    'border border-ink/15 px-4 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-paper';
  const field =
    'w-full border border-ink/15 bg-transparent px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/50';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog" aria-modal="true" aria-label="Безкоштовний прорахунок"
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

            {step < 3 ? (
              <>
                <p className="eyebrow mb-3">BUREAUX</p>
                <h3 className="display-xl text-2xl leading-tight">
                  Безкоштовний прорахунок<br />за 1 хвилину
                </h3>
                <p className="mb-6 mt-2 text-sm text-muted">
                  {step === 0 && 'Який у вас об’єкт?'}
                  {step === 1 && 'Орієнтовна площа?'}
                  {step === 2 && 'Куди надіслати прорахунок?'}
                </p>

                {step === 0 && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {OBJECTS.map((o) => (
                      <button key={o} type="button" onClick={() => pickObject(o)} className={chip}>
                        {o}
                      </button>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {AREAS.map((a) => (
                      <button key={a} type="button" onClick={() => pickArea(a)} className={chip}>
                        {a}
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={submit} className="space-y-3" noValidate>
                    <input
                      className={field} placeholder="Ваше ім’я" value={name}
                      onChange={(e) => setName(e.target.value)} required minLength={2}
                    />
                    <input
                      className={field} placeholder="Телефон" type="tel" value={phone}
                      onChange={(e) => setPhone(e.target.value)} required
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                      type="submit" disabled={submitting}
                      className="w-full bg-ink px-6 py-3.5 text-xs font-normal uppercase tracking-widest text-paper transition-opacity hover:opacity-85 disabled:opacity-60"
                    >
                      {submitting ? 'Надсилаємо…' : 'Отримати прорахунок'}
                    </button>
                    <p className="text-center text-[11px] text-muted">
                      {objectType} · {area}
                    </p>
                  </form>
                )}

                <div className="mt-6 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`h-0.5 flex-1 ${i <= step ? 'bg-ink' : 'bg-ink/15'}`} />
                  ))}
                </div>
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="eyebrow mb-3">BUREAUX</p>
                <h3 className="display-xl text-2xl">Дякуємо!</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm text-muted">
                  Ми зв’яжемося з вами найближчим часом і надішлемо орієнтовний прорахунок.
                </p>
                <button
                  onClick={close}
                  className="mt-6 border border-ink/15 px-6 py-3 text-xs font-normal uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Закрити
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
