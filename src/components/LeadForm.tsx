'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { LeadType } from '@/lib/types';
import { PhoneInput } from './PhoneInput';
import { trackEvent } from '@/lib/track';

type FormValues = { name: string; phone: string; email?: string; company?: string };

export function LeadForm({
  type = 'GENERAL',
  variant = 'light',
  onBeforeRedirect,
}: {
  type?: LeadType;
  variant?: 'light' | 'dark';
  onBeforeRedirect?: () => void;
}) {
  const t = useTranslations('leadForm');
  const router = useRouter();
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    defaultValues: { phone: '' },
  });
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const onSubmit = async (values: FormValues) => {
    setState('loading'); setErrMsg('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, type }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('genericError'));
      }
      reset();
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }
      trackEvent('lead_submitted');
      onBeforeRedirect?.();
      // wait for modal exit animation before navigating
      setTimeout(() => router.push('/thank-you'), onBeforeRedirect ? 350 : 0);
    } catch (e) {
      setState('error');
      setErrMsg(e instanceof Error ? e.message : t('genericErrorShort'));
    }
  };

  const dark = variant === 'dark';
  const fieldBase =
    'w-full border bg-transparent px-4 py-3.5 text-base outline-none transition-colors';
  const fieldTone = dark
    ? 'border-paper/20 text-paper placeholder:text-paper/40 focus:border-ink/50'
    : 'border-ink/15 text-ink placeholder:text-muted focus:border-ink/50';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      {/* honeypot — hidden from humans */}
      <input
        type="text" tabIndex={-1} autoComplete="off"
        aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register('company')}
      />
      <div>
        <input
          placeholder={t('namePlaceholder')}
          className={`${fieldBase} ${fieldTone} ${errors.name ? 'border-ink' : ''}`}
          {...register('name', { required: t('nameRequired'), minLength: { value: 2, message: t('nameTooShort') } })}
        />
        {errors.name && <p className="mt-1 text-xs text-ink">{errors.name.message}</p>}
      </div>
      <div>
        <Controller
          name="phone"
          control={control}
          rules={{
            required: t('phoneRequired'),
            validate: (v) =>
              v.replace(/\D/g, '').length >= 7 || t('phoneInvalid'),
          }}
          render={({ field }) => (
            <PhoneInput
              value={field.value}
              onChange={field.onChange}
              dark={dark}
              hasError={!!errors.phone}
            />
          )}
        />
        {errors.phone && <p className="mt-1 text-xs text-ink">{errors.phone.message}</p>}
      </div>
      <div>
        <input
          type="email"
          inputMode="email"
          placeholder={t('emailPlaceholder')}
          className={`${fieldBase} ${fieldTone} ${errors.email ? 'border-ink' : ''}`}
          {...register('email', {
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('emailInvalid') },
          })}
        />
        {errors.email && <p className="mt-1 text-xs text-ink">{errors.email.message}</p>}
      </div>

      {state === 'error' && <p className="text-sm text-ink">{errMsg}</p>}

      <button type="submit" disabled={state === 'loading'} className="btn-terra w-full disabled:opacity-60">
        {state === 'loading' ? t('submitting') : t('submit')}
      </button>
      <p className={`text-center text-[11px] ${dark ? 'text-paper/40' : 'text-muted'}`}>
        {t('privacyNote')}
      </p>
    </form>
  );
}
