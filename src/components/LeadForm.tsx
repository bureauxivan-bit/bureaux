'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { LeadType } from '@/lib/types';

type FormValues = { name: string; phone: string; company?: string };

export function LeadForm({
  type = 'GENERAL',
  variant = 'light',
}: {
  type?: LeadType;
  variant?: 'light' | 'dark';
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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
        throw new Error(data.error || 'Сталася помилка. Спробуйте ще раз.');
      }
      setState('success');
      reset();
    } catch (e) {
      setState('error');
      setErrMsg(e instanceof Error ? e.message : 'Помилка');
    }
  };

  const dark = variant === 'dark';
  const fieldBase =
    'w-full rounded-xl border bg-transparent px-4 py-3.5 text-base outline-none transition-colors';
  const fieldTone = dark
    ? 'border-paper/20 text-paper placeholder:text-paper/40 focus:border-terra'
    : 'border-ink/15 text-ink placeholder:text-muted focus:border-terra';

  if (state === 'success') {
    return (
      <div className={`rounded-2xl border p-8 text-center ${dark ? 'border-paper/20' : 'border-line'}`}>
        <div className="mb-3 text-3xl">✦</div>
        <p className="display-xl text-xl">Дякуємо!</p>
        <p className={`mt-2 text-sm ${dark ? 'text-paper/70' : 'text-muted'}`}>
          Ми зв’яжемося з вами найближчим часом.
        </p>
      </div>
    );
  }

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
          placeholder="Ім'я"
          className={`${fieldBase} ${fieldTone} ${errors.name ? 'border-terra' : ''}`}
          {...register('name', { required: "Вкажіть ім'я", minLength: { value: 2, message: 'Закоротко' } })}
        />
        {errors.name && <p className="mt-1 text-xs text-terra">{errors.name.message}</p>}
      </div>
      <div>
        <input
          inputMode="tel"
          placeholder="Телефон"
          className={`${fieldBase} ${fieldTone} ${errors.phone ? 'border-terra' : ''}`}
          {...register('phone', {
            required: 'Вкажіть телефон',
            pattern: { value: /^\+?[0-9\s\-()]{9,20}$/, message: 'Невірний номер' },
          })}
        />
        {errors.phone && <p className="mt-1 text-xs text-terra">{errors.phone.message}</p>}
      </div>

      {state === 'error' && <p className="text-sm text-terra">{errMsg}</p>}

      <button type="submit" disabled={state === 'loading'} className="btn-terra w-full disabled:opacity-60">
        {state === 'loading' ? 'Надсилаємо…' : 'Відправити заявку'}
      </button>
      <p className={`text-center text-[11px] ${dark ? 'text-paper/40' : 'text-muted'}`}>
        Натискаючи кнопку, ви погоджуєтесь з політикою конфіденційності.
      </p>
    </form>
  );
}
