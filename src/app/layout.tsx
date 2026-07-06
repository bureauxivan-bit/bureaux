import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SmoothScroll } from '@/components/SmoothScroll';
import { CustomCursor } from '@/components/CustomCursor';
import './globals.css';

const display = localFont({
  src: [
    { path: '../../public/fonts/ApercuPro-Thin.woff2',       weight: '100', style: 'normal' },
    { path: '../../public/fonts/ApercuPro-ExtraLight.woff2', weight: '200', style: 'normal' },
    { path: '../../public/fonts/ApercuPro-Light.woff2',      weight: '300', style: 'normal' },
    { path: '../../public/fonts/ApercuPro-Regular.woff2',    weight: '400', style: 'normal' },
    { path: '../../public/fonts/ApercuPro-Italic.woff2',     weight: '400', style: 'italic' },
    { path: '../../public/fonts/ApercuPro-Medium.woff2',     weight: '500', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
});

const body = localFont({
  src: [
    { path: '../../public/fonts/ApercuPro-Light.woff2',   weight: '300', style: 'normal' },
    { path: '../../public/fonts/ApercuPro-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/ApercuPro-Medium.woff2',  weight: '500', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "bureau X — Дизайн інтер'єру та архітектура під ключ · Київ",
    template: '%s · bureau X',
  },
  description:
    "bureau X — архітектурне бюро у Києві. Дизайн інтер'єру квартир і будинків, архітектурне проєктування, ремонт під ключ. Авторський стиль МУАС.",
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    siteName: 'bureau X',
    images: [
      {
        url: '/images/og.png',
        width: 1200,
        height: 779,
        alt: "bureau X — дизайн інтер'єру та архітектура під ключ, Київ",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bureaux_ua',
    images: ['/images/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="uk" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N2WQQPFL');
        `}</Script>
        {/* End Google Tag Manager */}
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","xaze6rne4c");
        `}</Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N2WQQPFL"
            title="gtm" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-1CVLYKWRZR" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1CVLYKWRZR');
        `}</Script>
        {plausible && (
          <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','438208975362673');
          fbq('track','PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }} alt=""
            src="https://www.facebook.com/tr?id=438208975362673&ev=PageView&noscript=1"
          />
        </noscript>
        <SmoothScroll />
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
