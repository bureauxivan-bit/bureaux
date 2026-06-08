import type { Metadata } from 'next';
import { Unbounded, Manrope } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const display = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
const body = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.example';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bureau X — дизайн інтер'єру та архітектура під ключ",
    template: '%s — BUREAUX',
  },
  description:
    "Бюро повного циклу архітектури та дизайну інтер'єрів у дусі МУАС — Молодого Українського Архітектурного Стилю.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="uk" className={`${display.variable} ${body.variable}`}>
      <body>
        {plausible && (
          <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
        {children}
      </body>
    </html>
  );
}
