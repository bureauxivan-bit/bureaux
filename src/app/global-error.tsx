'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    fetch('/api/error-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [error]);

  return (
    <html lang="uk">
      <body className="flex min-h-screen flex-col items-center justify-center bg-paper text-ink px-6">
        <p className="text-sm uppercase tracking-widest">Помилка</p>
        <h1 className="mt-4 text-2xl font-light">Щось пішло не так</h1>
        <button
          onClick={() => reset()}
          className="mt-8 border border-ink px-6 py-3 text-sm hover:bg-ink hover:text-paper transition-colors"
        >
          Спробувати ще раз
        </button>
      </body>
    </html>
  );
}
