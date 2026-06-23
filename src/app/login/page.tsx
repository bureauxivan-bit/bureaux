'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NormalCursor } from '@/components/NormalCursor';

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/client/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) { router.push('/miy-proekt'); router.refresh(); }
    else { const d = await res.json().catch(() => ({})); setErr(d.error || 'Помилка входу'); }
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <NormalCursor />
      {/* header */}
      <header className="border-b border-line px-8 py-5">
        <div className="text-sm font-medium uppercase tracking-[0.2em]">bureau <em>X</em></div>
        <div className="mt-0.5 text-xs text-muted">Особистий кабінет</div>
      </header>

      {/* form */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <form onSubmit={submit} className="w-full max-w-sm">
          <h1 className="display-xl mb-2 text-3xl">Вхід до кабінету</h1>
          <p className="mb-8 text-sm leading-relaxed text-muted">
            Введіть email та пароль,<br />отримані від бюро
          </p>

          <div className="space-y-3">
            <input
              type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/60 transition-colors"
            />
            <input
              type="password" placeholder="Пароль" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/60 transition-colors"
            />
          </div>

          {err && <p className="mt-3 text-sm text-[rgb(var(--terra))]">{err}</p>}

          <button
            disabled={loading}
            className="mt-4 w-full bg-ink py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-opacity disabled:opacity-60 hover:opacity-80"
          >
            {loading ? 'Вхід…' : 'Увійти'}
          </button>

          <p className="mt-6 text-xs text-muted">
            Для отримання доступу зверніться до бюро або{' '}
            <Link href="/register" className="text-ink underline underline-offset-2 hover:no-underline">
              подайте заявку
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
