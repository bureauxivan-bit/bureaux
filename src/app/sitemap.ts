import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/data';
import { ARTICLES } from '@/lib/articles';
import { enSlugForUk } from '@/lib/articles-en';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

type Opts = {
  lastModified?: Date;
  changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority?: number;
};

/** One uk + one en sitemap entry for a localized page, each carrying
 *  hreflang alternates so Google links the two versions together. */
function localized(ukPath: string, enPath: string, opts: Opts = {}): MetadataRoute.Sitemap {
  const languages = {
    uk: `${BASE}${ukPath}`,
    en: `${BASE}${enPath}`,
    'x-default': `${BASE}${ukPath}`,
  };
  return [
    { url: `${BASE}${ukPath}`, ...opts, alternates: { languages } },
    { url: `${BASE}${enPath}`, ...opts, alternates: { languages } },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects().catch(() => []);
  return [
    ...localized('', '/en', { changeFrequency: 'monthly', priority: 1 }),
    ...localized('/statti', '/en/articles', { changeFrequency: 'weekly', priority: 0.6 }),
    ...ARTICLES.flatMap((a) => {
      const enSlug = enSlugForUk(a.slug);
      const opts: Opts = {
        lastModified: new Date(a.dateModified),
        changeFrequency: 'monthly',
        priority: 0.7,
      };
      // Пара uk/en, якщо переклад існує; інакше лише українська версія.
      return enSlug
        ? localized(`/statti/${a.slug}`, `/en/articles/${enSlug}`, opts)
        : [{ url: `${BASE}/statti/${a.slug}`, ...opts }];
    }),
    ...localized('/posluhy', '/en/services', { changeFrequency: 'monthly', priority: 0.9 }),
    ...localized('/posluhy/dyzajn-intereru', '/en/services/interior-design', { changeFrequency: 'monthly', priority: 0.9 }),
    ...localized('/posluhy/arkhitektura', '/en/services/architecture', { changeFrequency: 'monthly', priority: 0.8 }),
    ...localized('/posluhy/remont-pid-klyuch', '/en/services/turnkey-renovation', { changeFrequency: 'monthly', priority: 0.8 }),
    ...localized('/posluhy/komertsiini-prymishchennia', '/en/services/commercial-spaces', { changeFrequency: 'monthly', priority: 0.7 }),
    ...localized('/posluhy/pryvatni-prostory', '/en/services/private-spaces', { changeFrequency: 'monthly', priority: 0.7 }),
    ...localized('/projects', '/en/projects', { changeFrequency: 'weekly', priority: 0.8 }),
    ...localized('/muas', '/en/muas', { changeFrequency: 'monthly', priority: 0.8 }),
    ...localized('/studio', '/en/studio', { changeFrequency: 'monthly', priority: 0.7 }),
    ...localized('/kontakty', '/en/contacts', { changeFrequency: 'monthly', priority: 0.6 }),
    ...localized('/terms', '/en/terms', { priority: 0.2 }),
    ...localized('/privacy', '/en/privacy', { priority: 0.2 }),
    ...projects.flatMap((p) =>
      localized(`/projects/${p.slug}`, `/en/projects/${p.slug}`, {
        lastModified: p.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    ),
  ];
}
