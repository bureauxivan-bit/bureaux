import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { seoAlternates } from '@/i18n/seo';

const COPY = {
  uk: {
    title: 'Політика конфіденційності',
    text: 'Тут описується, як bureau x збирає та обробляє персональні дані, надіслані через форми сайту. Відредагуйте цей текст відповідно до вимог законодавства.',
  },
  en: {
    title: 'Privacy Policy',
    text: 'This page describes how bureau x collects and processes personal data submitted through the site forms. Edit this text to match applicable legal requirements.',
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
  return { title: c.title, alternates: seoAlternates('/privacy', locale) };
}

export default function Privacy({ params: { locale } }: { params: { locale: string } }) {
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
