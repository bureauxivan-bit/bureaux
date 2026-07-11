'use client';
import { useState } from 'react';
import Link from 'next/link';
import { NormalCursor } from '@/components/NormalCursor';

const PROJECT_TYPES = [
  { value: 'PRIVATE', label: "Приватний інтер'єр" },
  { value: 'COMMERCIAL', label: 'Комерційний простір' },
  { value: 'ARCHITECTURE', label: 'Архітектура' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    projectType: 'PRIVATE', projectDetails: '',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setErr('Паролі не співпадають'); return; }
    setLoading(true); setErr('');
    const res = await fetch('/api/client/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, email: form.email, phone: form.phone,
        password: form.password, projectType: form.projectType,
        projectDetails: form.projectDetails || undefined,
      }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
    else { const d = await res.json().catch(() => ({})); setErr(d.error || 'Помилка реєстрації'); }
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <NormalCursor />
      {/* header */}
      <header className="border-b border-line px-8 py-5">
        <div className="text-sm font-medium uppercase tracking-[0.2em]">bureau <em>X</em></div>
        <div className="mt-0.5 text-xs text-muted">Особистий кабінет</div>
      </header>

      <div className="flex flex-1 items-start justify-center px-4 py-16">
        {done ? (
          <div className="w-full max-w-sm text-center">
            <h1 className="display-xl mb-3 text-3xl">Заявку подано</h1>
            <p className="mb-8 text-sm leading-relaxed text-muted">
              Ми розглянемо ваш запит та надішлемо підтвердження на{' '}
              <span className="text-ink">{form.email}</span>.
            </p>
            <Link href="/login"
              className="inline-block border border-ink px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-paper transition-colors">
              Перейти до входу
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="w-full max-w-sm">
            <h1 className="display-xl mb-2 text-3xl">Реєстрація</h1>
            <p className="mb-8 text-sm leading-relaxed text-muted">
              Заповніть форму — ми підтвердимо<br />доступ до особистого кабінету
            </p>

            <div className="space-y-3">
              <input
                type="text" placeholder="Ім'я та прізвище" value={form.name}
                onChange={set('name')} required
                className="w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/60 transition-colors"
              />
              <input
                type="email" placeholder="Email" value={form.email}
                onChange={set('email')} required
                className="w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/60 transition-colors"
              />
              <input
                type="tel" placeholder="Телефон" value={form.phone}
                onChange={set('phone')} required
                className="w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/60 transition-colors"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="password" placeholder="Пароль" value={form.password}
                  onChange={set('password')} required
                  className="w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/60 transition-colors"
                />
                <input
                  type="password" placeholder="Підтвердити" value={form.confirmPassword}
                  onChange={set('confirmPassword')} required
                  className="w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/60 transition-colors"
                />
              </div>
              <select
                value={form.projectType} onChange={set('projectType')}
                className="w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink transition-colors"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <textarea
                placeholder="Коротко опишіть ваш проєкт (необов'язково)"
                value={form.projectDetails} onChange={set('projectDetails')} rows={3}
                className="w-full resize-none border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/60 transition-colors"
              />
            </div>

            {err && <p className="mt-3 text-sm text-[rgb(var(--terra))]">{err}</p>}

            <button
              disabled={loading}
              className="mt-4 w-full bg-ink py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-opacity disabled:opacity-60 hover:opacity-80"
            >
              {loading ? 'Відправлення…' : 'Подати заявку'}
            </button>

            <p className="mt-6 text-xs text-muted">
              Вже маєте акаунт?{' '}
              <Link href="/login" className="text-ink underline underline-offset-2 hover:no-underline">
                Увійти
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
