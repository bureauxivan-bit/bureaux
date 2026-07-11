import { unstable_setRequestLocale } from 'next-intl/server';
import { getSettings } from '@/lib/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LeadModalProvider } from '@/components/LeadModal';
import CursorTrail from '@/components/CursorTrail';
import { EngagementTracker } from '@/components/EngagementTracker';
import { FloatingContact } from '@/components/FloatingContact';
import { LeadPopup } from '@/components/LeadPopup';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export default async function SiteLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const settings = await getSettings();
  const isEn = locale === 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
        '@id': `${SITE_URL}/#organization`,
        name: 'bureau X',
        alternateName: 'bureauX',
        description: isEn
          ? 'Architecture and interior design studio. Signature MUAS style.'
          : "Архітектурне бюро та студія дизайну інтер'єрів. Авторський стиль МУАС.",
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo_big.png`,
        image: `${SITE_URL}/images/og.png`,
        telephone: settings.phone,
        email: settings.email,
        founder: isEn
          ? [
              { '@type': 'Person', name: 'Ivan Rudenko', jobTitle: 'Co-founder, architect' },
              { '@type': 'Person', name: 'Daria Rudenko-Fortuna', jobTitle: 'Co-founder, architect' },
            ]
          : [
              { '@type': 'Person', name: 'Іван Руденко', jobTitle: 'Співзасновник, архітектор' },
              { '@type': 'Person', name: "Дар'я Руденко-Фортуна", jobTitle: 'Співзасновниця, архітекторка' },
            ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address ?? '',
          addressLocality: isEn ? 'Kyiv' : 'Київ',
          addressCountry: 'UA',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 50.45444, longitude: 30.52361 },
        areaServed: isEn
          ? ['Kyiv', 'Ukraine', 'Remote — worldwide']
          : ['Київ', 'Україна', 'Дистанційно — весь світ'],
        priceRange: '$$$$',
        openingHours: 'Mo-Fr 09:00-18:00',
        sameAs: [
          settings.instagram,
          settings.facebook,
          settings.behance,
          settings.telegram,
          'https://www.pinterest.com/bureau_x/',
        ].filter(Boolean),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          itemListElement: isEn
            ? [
                { '@type': 'Service', name: 'Interior design', url: `${SITE_URL}/en/services/interior-design` },
                { '@type': 'Service', name: 'Architectural design', url: `${SITE_URL}/en/services/architecture` },
                { '@type': 'Service', name: 'Turnkey renovation', url: `${SITE_URL}/en/services/turnkey-renovation` },
                { '@type': 'Service', name: 'Commercial spaces', url: `${SITE_URL}/en/services/commercial-spaces` },
                { '@type': 'Service', name: 'Private spaces', url: `${SITE_URL}/en/services/private-spaces` },
              ]
            : [
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
      <EngagementTracker />
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingContact phone={settings.phone} telegram={settings.telegram} instagram={settings.instagram} />
      <LeadPopup />
    </LeadModalProvider>
  );
}
