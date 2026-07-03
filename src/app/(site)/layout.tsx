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
    '@graph': [
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        name: 'bureau X',
        description: "Архітектурне бюро та студія дизайну інтер'єрів. Авторський стиль МУАС.",
        url: SITE_URL,
        telephone: settings.phone,
        email: settings.email,
        address: { '@type': 'PostalAddress', addressLocality: 'Київ', addressCountry: 'UA' },
        geo: { '@type': 'GeoCoordinates', latitude: 50.45444, longitude: 30.52361 },
        areaServed: ['Київ', 'Україна'],
        priceRange: '$$$$',
        openingHours: 'Mo-Fr 09:00-18:00',
        sameAs: [settings.instagram, settings.facebook, settings.behance].filter(Boolean),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          itemListElement: [
            { '@type': 'Service', name: 'Дизайн інтер\'єру', url: `${SITE_URL}/posluhy/dyzajn-intereru` },
            { '@type': 'Service', name: 'Архітектурне проєктування', url: `${SITE_URL}/posluhy/arkhitektura` },
            { '@type': 'Service', name: 'Ремонт під ключ', url: `${SITE_URL}/posluhy/remont-pid-klyuch` },
            { '@type': 'Service', name: 'Комерційні приміщення', url: `${SITE_URL}/posluhy/komertsiini-prymishchennia` },
            { '@type': 'Service', name: 'Приватні простори', url: `${SITE_URL}/posluhy/pryvatni-prostory` },
          ],
        },
      },
      {
        '@type': 'WebSite',
        name: 'bureau X',
        url: SITE_URL,
      },
    ],
  };

  return (
    <LeadModalProvider>
      <script id="ld-json" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CursorTrail />
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </LeadModalProvider>
  );
}
