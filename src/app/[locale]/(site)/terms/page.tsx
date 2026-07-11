import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { seoAlternates } from '@/i18n/seo';

const COPY = {
  uk: {
    title: 'Правила та умови',
    text: 'Тут розміщуються правила та умови користування сайтом bureau x. Відредагуйте цей текст відповідно до вашої юридичної інформації.',
  },
  en: {
    title: 'Terms & Conditions',
    text: 'This page holds the terms and conditions for using the bureau x website. Edit this text to match your legal information.',
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
  return { title: c.title, alternates: seoAlternates('/terms', locale) };
}

export default function Terms({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  return (
    <div className="container-wide max-w-3xl pb-28 pt-36">
      <h1 className="display-xl text-4xl">{c.title}</h1>
      <p className="mt-6 text-muted">
        {c.text}
      </p>
    </div>
  );
}
