import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { seoAlternates } from '@/i18n/seo';
import { Reveal } from '@/components/Reveal';
import { LeadForm } from '@/components/LeadForm';
import { getSettings } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

const COPY = {
  uk: {
    metaTitle: 'Контакти — bureau X, архітектурне бюро · Київ',
    metaDescription:
      "Зв'яжіться з bureau X: телефон, email, адреса у Києві. Запишіться на безкоштовну консультацію.",
    breadcrumbHome: 'Головна',
    breadcrumbSelf: 'Контакти',
    selfPath: '/kontakty',
    eyebrow: 'Звʼязок',
    h1: 'Контакти',
    phone: 'Телефон',
    address: 'Адреса',
    addressFallback: 'Київ, Україна',
    hours: 'Режим роботи',
    hoursValue: 'Пн–Пт, 09:00–18:00',
    socials: 'Соцмережі',
    consult: 'Безкоштовна консультація',
    ldCity: 'Київ',
    ldAreaServed: ['Київ', 'Україна'],
  },
  en: {
    metaTitle: 'Contacts — bureau X, Architecture Studio · Kyiv',
    metaDescription:
      'Get in touch with bureau X: phone, email, address in Kyiv, Ukraine. Book a free consultation.',
    breadcrumbHome: 'Home',
    breadcrumbSelf: 'Contacts',
    selfPath: '/en/contacts',
    eyebrow: 'Get in touch',
    h1: 'Contacts',
    phone: 'Phone',
    address: 'Address',
    addressFallback: 'Kyiv, Ukraine',
    hours: 'Working hours',
    hoursValue: 'Mon–Fri, 09:00–18:00',
    socials: 'Social media',
    consult: 'Free consultation',
    ldCity: 'Kyiv',
    ldAreaServed: ['Kyiv', 'Ukraine'],
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
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDescription,
    alternates: seoAlternates('/kontakty', locale),
  };
}

export default async function KontaktyPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  const settings = await getSettings();

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: locale === 'en' ? `${SITE_URL}/en` : SITE_URL },
      { '@type': 'ListItem', position: 2, name: c.breadcrumbSelf, item: `${SITE_URL}${c.selfPath}` },
    ],
  };

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'bureau X',
    url: SITE_URL,
    telephone: settings.phone ?? '+380989498648',
    email: settings.email ?? 'bureaux.ivan@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address ?? '',
      addressLocality: c.ldCity,
      addressCountry: 'UA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 50.45444, longitude: 30.52361 },
    openingHours: 'Mo-Fr 09:00-18:00',
    areaServed: [...c.ldAreaServed],
  };

  return (
    <>
      <script
        id="ld-bc-kontakty"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        id="ld-lb-kontakty"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />

      <section className="container-wide pt-36 pb-16 lg:pt-44 lg:pb-24">
        <Reveal>
          <p className="eyebrow">{c.eyebrow}</p>
          <h1 className="display-xl mt-5 text-[clamp(2rem,5vw,4rem)]">{c.h1}</h1>
        </Reveal>
      </section>

      <section className="container-wide pb-24 lg:pb-36">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">

          {/* Contact details */}
          <Reveal>
            <div className="space-y-0 border-t border-line">
              {settings.phone && (
                <div className="border-b border-line py-6">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted">{c.phone}</p>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="display-xl mt-2 block text-xl transition-opacity hover:opacity-60"
                  >
                    {settings.phone}
                  </a>
                </div>
              )}

              {settings.email && (
                <div className="border-b border-line py-6">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Email</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="display-xl mt-2 block text-xl transition-opacity hover:opacity-60"
                  >
                    {settings.email}
                  </a>
                </div>
              )}

              <div className="border-b border-line py-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted">{c.address}</p>
                <p className="display-xl mt-2 text-xl">
                  {settings.address ?? c.addressFallback}
                </p>
              </div>

              <div className="border-b border-line py-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted">{c.hours}</p>
                <p className="display-xl mt-2 text-xl">{c.hoursValue}</p>
              </div>

              {/* Social links */}
              {(settings.telegram || settings.instagram || settings.facebook || settings.behance) && (
                <div className="py-6">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted">{c.socials}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {settings.telegram && (
                      <a
                        href={settings.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-line px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
                      >
                        Telegram
                      </a>
                    )}
                    {settings.instagram && (
                      <a
                        href={settings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-line px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
                      >
                        Instagram
                      </a>
                    )}
                    {settings.facebook && (
                      <a
                        href={settings.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-line px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
                      >
                        Facebook
                      </a>
                    )}
                    {settings.behance && (
                      <a
                        href={settings.behance}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-line px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
                      >
                        Behance
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Lead form */}
          <Reveal delay={120}>
            <div>
              <p className="eyebrow mb-6">{c.consult}</p>
              <div className="border border-line p-7 sm:p-9">
                <LeadForm type="CONSULT" variant="light" />
              </div>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
