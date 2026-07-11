import { defineRouting } from 'next-intl/routing';

// uk lives at the root (/posluhy) so existing indexed URLs never change;
// en gets the /en prefix with properly localized slugs (/en/services).
export const routing = defineRouting({
  locales: ['uk', 'en'],
  defaultLocale: 'uk',
  localePrefix: 'as-needed',
  // Browser-language auto-redirects hurt indexing and can trap users in the
  // wrong locale — the header switcher (persisted in a cookie) is enough.
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/projects': '/projects',
    '/projects/[slug]': '/projects/[slug]',
    '/statti': { uk: '/statti', en: '/articles' },
    '/statti/[slug]': { uk: '/statti/[slug]', en: '/articles/[slug]' },
    '/studio': '/studio',
    '/muas': '/muas',
    '/privacy': '/privacy',
    '/terms': '/terms',
    '/thank-you': '/thank-you',
    '/kontakty': { uk: '/kontakty', en: '/contacts' },
    '/posluhy': { uk: '/posluhy', en: '/services' },
    '/posluhy/arkhitektura': {
      uk: '/posluhy/arkhitektura',
      en: '/services/architecture',
    },
    '/posluhy/dyzajn-intereru': {
      uk: '/posluhy/dyzajn-intereru',
      en: '/services/interior-design',
    },
    '/posluhy/komertsiini-prymishchennia': {
      uk: '/posluhy/komertsiini-prymishchennia',
      en: '/services/commercial-spaces',
    },
    '/posluhy/pryvatni-prostory': {
      uk: '/posluhy/pryvatni-prostory',
      en: '/services/private-spaces',
    },
    '/posluhy/remont-pid-klyuch': {
      uk: '/posluhy/remont-pid-klyuch',
      en: '/services/turnkey-renovation',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
