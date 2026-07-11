import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { RootDocument } from '@/components/RootDocument';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const isEn = locale === 'en';
  return {
    metadataBase: new URL(SITE_URL),
    title: isEn
      ? {
          default: 'bureau X — Interior Design & Turnkey Architecture · Kyiv',
          template: '%s · bureau X',
        }
      : {
          default: "bureau X — Дизайн інтер'єру та архітектура під ключ · Київ",
          template: '%s · bureau X',
        },
    description: isEn
      ? 'bureau X — architecture studio in Kyiv, Ukraine. Interior design for apartments and houses, architectural design, turnkey renovation. Signature MUAS style.'
      : "bureau X — архітектурне бюро у Києві. Дизайн інтер'єру квартир і будинків, архітектурне проєктування, ремонт під ключ. Авторський стиль МУАС.",
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'uk_UA',
      siteName: 'bureau X',
      images: [
        {
          url: '/images/og.png',
          width: 1200,
          height: 779,
          alt: isEn
            ? 'bureau X — interior design & turnkey architecture, Kyiv'
            : "bureau X — дизайн інтер'єру та архітектура під ключ, Київ",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@bureaux_ua',
      images: ['/images/og.png'],
    },
    // Set GOOGLE_SITE_VERIFICATION to the code from Search Console
    // (Settings → Ownership verification → HTML tag → the content="..." value).
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Any unknown first path segment (/wp-admin, /vendor, …) lands here as a
  // "locale" — reject it before touching the DB or messages.
  if (!routing.locales.includes(locale as Locale)) notFound();
  unstable_setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <RootDocument locale={locale}>
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </RootDocument>
  );
}
