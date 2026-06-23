import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Дякуємо' };

export default function ThankYou() {
  return (
    <div className="container-wide flex min-h-[70vh] flex-col items-start justify-center pb-28 pt-36">
      <p className="eyebrow mb-6 tracking-widest text-muted">BUREAUX</p>
      <h1 className="display-xl text-4xl md:text-6xl">Дякуємо!</h1>
      <p className="mt-6 max-w-md text-muted">
        Ваша заявка отримана. Ми зв'яжемося з вами найближчим часом.
      </p>
      <Link
        href="/"
        className="mt-12 border border-ink px-8 py-3.5 text-sm uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
      >
        На головну
      </Link>
    </div>
  );
}
