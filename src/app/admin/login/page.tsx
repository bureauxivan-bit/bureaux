'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) { router.push('/admin'); router.refresh(); }
    else { const d = await res.json().catch(() => ({})); setErr(d.error || 'Помилка входу'); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-coal px-4 text-paper">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="display-xl mb-1 text-2xl">BUREAUX</div>
        <p className="mb-8 text-sm text-paper/50">Панель адміністратора</p>
        <input
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="mb-3 w-full border border-paper/20 bg-transparent px-4 py-3 outline-none focus:border-paper/50"
        />
        <input
          type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="mb-3 w-full border border-paper/20 bg-transparent px-4 py-3 outline-none focus:border-paper/50"
        />
        {err && <p className="mb-3 text-sm text-paper/70">{err}</p>}
        <button disabled={loading} className="btn-admin w-full disabled:opacity-60">
          {loading ? 'Вхід…' : 'Увійти'}
        </button>
      </form>
    </div>
  );
}
