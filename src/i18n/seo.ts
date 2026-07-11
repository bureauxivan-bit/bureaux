import { getPathname } from './navigation';
import type { routing } from './routing';

type Href = Parameters<typeof getPathname>[0]['href'];

/** Canonical + hreflang alternates for a localized page. Relative URLs are
 *  resolved against metadataBase. x-default points at the Ukrainian version. */
export function seoAlternates(href: Href, locale: string) {
  const uk = getPathname({ href, locale: 'uk' });
  const en = getPathname({ href, locale: 'en' });
  return {
    canonical: locale === 'en' ? en : uk,
    languages: { uk, en, 'x-default': uk },
  };
}
