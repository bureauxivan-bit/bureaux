import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container-wide flex min-h-[70svh] flex-col items-center justify-center text-center">
      <p className="display-xl text-8xl text-ink">404</p>
      <p className="mt-4 text-muted">Сторінку не знайдено.</p>
      <Link href="/" className="btn-ghost mt-8">На головну</Link>
    </div>
  );
}
