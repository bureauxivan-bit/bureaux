'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ClientLogout() {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add('is-client');
    return () => document.documentElement.classList.remove('is-client');
  }, []);

  const logout = async () => {
    await fetch('/api/client/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };
  return (
    <button
      onClick={logout}
      className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted hover:text-ink transition-colors"
    >
      Вийти →
    </button>
  );
}
