'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { PhoneInput } from '@/components/PhoneInput';
import { trackEvent } from '@/lib/track';

// Standalone ad landing quiz (/quiz). Questions come from the client brief in
// Notion. Answers are folded into the lead's message so they show up in the
// Telegram alert and the admin leads list without a schema change.

const PROPERTY = ['Квартира', 'Будинок', 'Комерція'];
const SERVICES = [
  'Дизайн інтер’єру',
  'Архітектурне проєктування',
  'Дизайн-проєкт та реалізація під ключ',
  'Поки не визначився(-лася), хочу обговорити можливості',
];
const STAGES = [
  'Вже маю готову нерухомість',
  'Об’єкт на етапі будівництва',
  'Маю земельну ділянку, планую будівництво',
  'Зараз шукаю або обираю нерухомість',
  'Ремонт уже розпочався',
];
// Same floor as the site popup — the studio doesn't take small apartments.
const AREAS = ['до 100 м²', '100–200 м²', '200–400 м²', '400+ м²'];
const CONTACT = ['Telegram', 'Viber', 'Телефонний дзвінок'];

type Answers = {
  property: string;
  service: string;
  area: string;
  stage: string;
  location: string;
  wishes: string;
  contact: string;
  name: string;
  phone: string;
  company: string; // honeypot
};

const EMPTY: Answers = {
  property: '', service: '', area: '', stage: '', location: '', wishes: '',
  contact: '', name: '', phone: '', company: '',
};

const QUESTIONS = [
  'Який у вас тип нерухомості?',
  'Яка послуга вас цікавить?',
  'Яка площа об’єкта?',
  'На якому етапі зараз ваш об’єкт?',
  'Де знаходиться ваш об’єкт?',
  'Чи є у вас побажання або особливі вимоги до майбутнього проєкту?',
  'Як ми можемо зручно з вами зв’язатися?',
];
const TOTAL = QUESTIONS.length;

function buildMessage(a: Answers) {
  return [
    'Квіз «Безкоштовний розрахунок»',
    `Тип: ${a.property}`,
    `Послуга: ${a.service}`,
    `Площа: ${AREAS.includes(a.area) ? a.area : `${a.area} м²`}`,
    `Етап: ${a.stage}`,
    `Локація: ${a.location}`,
    a.wishes.trim() ? `Побажання: ${a.wishes.trim()}` : '',
    `Зв’язок: ${a.contact}`,
  ].filter(Boolean).join('\n');
}

/** PhoneInput emits "+<dial><national>". Ukraine: exactly 9 national digits;
 *  elsewhere require a plausible length (dial code + at least 7 digits). */
function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('380')) return digits.length === 12;
  return digits.length >= 9 && digits.length <= 15;
}

export function Quiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [a, setA] = useState<Answers>(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [customArea, setCustomArea] = useState(false);
  useEffect(() => { trackEvent('quiz_view'); }, []);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => {
    setA((prev) => ({ ...prev, [k]: v }));
    setError('');
  };

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setError('');
    setStep(next);
    // Per-step reach (quiz_step_2 … quiz_step_7) → drop-off funnel in /stats.
    if (next > step) trackEvent(`quiz_step_${next + 1}`);
    window.scrollTo({ top: 0 });
  };

  const pick = (k: 'property' | 'service' | 'stage' | 'contact', v: string) => {
    set(k, v);
    if (k !== 'contact') setTimeout(() => go(step + 1), 180);
  };

  const pickArea = (v: string) => {
    setCustomArea(false);
    set('area', v);
    setTimeout(() => go(step + 1), 180);
  };

  const openCustomArea = () => {
    setCustomArea(true);
    if (AREAS.includes(a.area)) set('area', '');
  };

  const nextFromArea = () => {
    const n = Number(a.area.replace(',', '.'));
    if (!a.area.trim() || !Number.isFinite(n) || n <= 0 || n > 100000) {
      setError('Вкажіть площу в м²');
      return;
    }
    go(step + 1);
  };

  const nextFromLocation = () => {
    if (a.location.trim().length < 2) {
      setError('Вкажіть місто та країну');
      return;
    }
    go(step + 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!a.contact) return setError('Оберіть зручний спосіб зв’язку');
    if (a.name.trim().length < 2) return setError('Вкажіть ваше ім’я');
    if (!isValidPhone(a.phone)) return setError('Перевірте номер телефону');

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: a.name.trim(),
          phone: a.phone.replace(/[^\d+]/g, ''), // "+38067 123 45 67" → "+380671234567"
          type: 'ESTIMATE',
          message: buildMessage(a),
          company: a.company,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Не вдалося надіслати. Спробуйте ще раз.');
      }
      try { localStorage.setItem('bx_lead_done', '1'); } catch {}
      trackEvent('quiz_lead');
      trackEvent('lead_submitted');
      const w = window as unknown as { fbq?: (...x: unknown[]) => void };
      w.fbq?.('track', 'Lead');
      router.push('/thank-you');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка. Спробуйте ще раз.');
      setSubmitting(false);
    }
  };

  const chip = (active: boolean) =>
    `w-full border px-5 py-4 text-left text-[15px] leading-snug transition-colors ${
      active ? 'border-ink bg-ink text-paper' : 'border-ink/15 text-ink [@media(hover:hover)]:hover:border-ink/50'
    }`;
  const field =
    'w-full border border-ink/15 bg-transparent px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-ink/50';
  const primary =
    'w-full bg-ink px-6 py-4 text-xs font-normal uppercase tracking-widest text-paper transition-opacity [@media(hover:hover)]:hover:opacity-85 disabled:opacity-60';

  const onEnter = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); fn(); }
  };

  return (
    <div className="flex min-h-[100svh] flex-col bg-paper">
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-5 pt-6">
        <span className="font-display text-lg font-light tracking-tight">bureau X</span>
        <span className="text-xs tabular-nums text-muted">
          {step + 1} / {TOTAL}
        </span>
      </header>

      <div className="mx-auto mt-4 w-full max-w-xl px-5">
        <div className="h-0.5 w-full bg-ink/10">
          <motion.div
            className="h-full bg-ink"
            animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-xl flex-1 px-5 pb-16 pt-8">
        {step === 0 && (
          <div className="mb-8">
            <h1 className="display-xl text-[32px] leading-[1.08] sm:text-[40px]">
              Отримайте безкоштовний розрахунок вартості вашого проєкту
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Дайте відповідь на кілька запитань, щоб ми краще зрозуміли ваш запит
              і могли підготувати для вас індивідуальну пропозицію.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5 text-sm">
              <span>
                <span className="font-display text-xl font-light text-ink">100+</span>
                <span className="ml-1.5 text-muted">проєктів</span>
              </span>
              <span className="flex items-center gap-2 text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-terra" aria-hidden="true" />
                Відповімо протягом 5 хв
              </span>
              <a
                href="/projects"
                target="_blank"
                rel="noopener"
                onClick={() => trackEvent('cta_projects')}
                className="text-ink underline decoration-ink/30 underline-offset-4 transition-colors [@media(hover:hover)]:hover:decoration-ink"
              >
                Переглянути проєкти →
              </a>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === TOTAL - 1 && (
              <p className="eyebrow mb-4">Контактна інформація</p>
            )}
            <h2 className="mb-6 text-xl font-normal leading-snug sm:text-2xl">
              {QUESTIONS[step]}
            </h2>

            {step === 0 && (
              <div className="space-y-2.5">
                {PROPERTY.map((o) => (
                  <button key={o} type="button" aria-pressed={a.property === o} className={chip(a.property === o)} onClick={() => pick('property', o)}>
                    {o}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-2.5">
                {SERVICES.map((o) => (
                  <button key={o} type="button" aria-pressed={a.service === o} className={chip(a.service === o)} onClick={() => pick('service', o)}>
                    {o}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  {AREAS.map((o) => (
                    <button
                      key={o} type="button" aria-pressed={!customArea && a.area === o}
                      className={chip(!customArea && a.area === o)}
                      onClick={() => pickArea(o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                {!customArea ? (
                  <button type="button" className={chip(false)} onClick={openCustomArea}>
                    Вказати свою площу
                  </button>
                ) : (
                  <div className="space-y-2.5 pt-2">
                    <div className="relative">
                      <input
                        autoFocus
                        inputMode="decimal"
                        aria-label="Площа, м²"
                        className={`${field} pr-14`}
                        placeholder="Ваша площа, наприклад 120"
                        value={a.area}
                        onChange={(e) => set('area', e.target.value.replace(/[^\d.,]/g, '').slice(0, 7))}
                        onKeyDown={onEnter(nextFromArea)}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">м²</span>
                    </div>
                    <button type="button" className={primary} onClick={nextFromArea}>Далі</button>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2.5">
                {STAGES.map((o) => (
                  <button key={o} type="button" aria-pressed={a.stage === o} className={chip(a.stage === o)} onClick={() => pick('stage', o)}>
                    {o}
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <input
                  autoFocus
                  className={field}
                  placeholder="Місто, країна"
                  aria-label="Місто та країна"
                  autoComplete="address-level2"
                  value={a.location}
                  maxLength={120}
                  onChange={(e) => set('location', e.target.value)}
                  onKeyDown={onEnter(nextFromLocation)}
                />
                <button type="button" className={primary} onClick={nextFromLocation}>Далі</button>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <textarea
                  autoFocus
                  rows={5}
                  aria-label="Побажання до проєкту"
                  className={`${field} resize-none`}
                  placeholder="Стиль, кількість кімнат, терміни, бюджет — усе, що важливо (необов’язково)"
                  value={a.wishes}
                  maxLength={1000}
                  onChange={(e) => set('wishes', e.target.value)}
                />
                <button type="button" className={primary} onClick={() => go(step + 1)}>
                  {a.wishes.trim() ? 'Далі' : 'Пропустити'}
                </button>
              </div>
            )}

            {step === 6 && (
              <form onSubmit={submit} noValidate className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  {CONTACT.map((o) => (
                    <button
                      key={o} type="button" aria-pressed={a.contact === o}
                      className={`${chip(a.contact === o)} flex min-h-[56px] items-center justify-center !px-2 !py-3 text-center !text-sm`}
                      onClick={() => pick('contact', o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm text-muted">Як до вас звертатися?</span>
                  <input
                    className={field}
                    placeholder="Ваше ім’я"
                    autoComplete="name"
                    value={a.name}
                    maxLength={80}
                    onChange={(e) => set('name', e.target.value)}
                  />
                </label>

                <div>
                  <span className="mb-2 block text-sm text-muted">Ваш номер телефону</span>
                  <PhoneInput value={a.phone} onChange={(v) => set('phone', v)} />
                </div>

                {/* honeypot */}
                <input
                  tabIndex={-1} autoComplete="off" aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  value={a.company} onChange={(e) => set('company', e.target.value)}
                />

                {error && <p className="text-sm text-terra">{error}</p>}

                <button type="submit" disabled={submitting} className={primary}>
                  {submitting ? 'Надсилаємо…' : 'Отримати розрахунок'}
                </button>
                <p className="text-center text-[11px] leading-relaxed text-muted">
                  Натискаючи кнопку, ви погоджуєтеся з{' '}
                  <a href="/privacy" target="_blank" className="underline underline-offset-2">політикою конфіденційності</a>.
                </p>
              </form>
            )}

            {error && step !== 6 && <p className="mt-3 text-sm text-terra">{error}</p>}
          </motion.div>
        </AnimatePresence>

        {step > 0 && (
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="mt-8 text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink"
          >
            ← Назад
          </button>
        )}
      </main>
    </div>
  );
}
