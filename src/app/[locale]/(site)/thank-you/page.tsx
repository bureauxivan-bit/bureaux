import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { seoAlternates } from '@/i18n/seo';

const COPY = {
  uk: {
    metaTitle: 'Дякуємо',
    h1: 'Дякуємо!',
    text: "Ваша заявка отримана. Ми зв'яжемося з вами найближчим часом.",
    home: 'На головну',
  },
  en: {
    metaTitle: 'Thank you',
    h1: 'Thank you!',
    text: "We've received your request and will get in touch shortly.",
    home: 'Back to home',
  },
} as const;

function copyFor(locale: string) {
  return locale === 'en' ? COPY.en : COPY.uk;
}

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const c = copyFor(locale);
  return { title: c.metaTitle, alternates: seoAlternates('/thank-you', locale) };
}

export default function ThankYou({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  return (
    <div className="container-wide flex min-h-[70vh] flex-col items-start justify-center pb-28 pt-36">
      <p className="eyebrow mb-6 tracking-widest text-muted">BUREAUX</p>
      <h1 className="display-xl text-4xl md:text-6xl">{c.h1}</h1>
      <p className="mt-6 max-w-md text-muted">
        {c.text}
      </p>
      <Link
        href="/"
        className="mt-12 border border-ink px-8 py-3.5 text-sm uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
      >
        {c.home}
      </Link>
    </div>
  );
}
