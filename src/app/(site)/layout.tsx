import Script from 'next/script';
import { getSettings } from '@/lib/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LeadModalProvider } from '@/components/LeadModal';
import CursorTrail from '@/components/CursorTrail';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'bureau x',
    description: "Бюро архітектури та дизайну інтер'єрів у стилі МУАС.",
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    address: { '@type': 'PostalAddress', addressLocality: 'Київ', addressCountry: 'UA' },
    geo: { '@type': 'GeoCoordinates', latitude: 50.45444, longitude: 30.52361 },
    sameAs: [settings.instagram, settings.facebook, settings.behance].filter(Boolean),
  };

  return (
    <LeadModalProvider>
      <Script id="ld-json" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CursorTrail />
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </LeadModalProvider>
  );
}
