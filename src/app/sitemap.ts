import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/data';
import { ARTICLES } from '@/lib/articles';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects().catch(() => []);
  return [
    { url: BASE, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/statti`, changeFrequency: 'weekly', priority: 0.6 },
    ...ARTICLES.map((a) => ({
      url: `${BASE}/statti/${a.slug}`,
      lastModified: new Date(a.dateModified),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${BASE}/posluhy`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/posluhy/dyzajn-intereru`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/posluhy/arkhitektura`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/posluhy/remont-pid-klyuch`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/posluhy/komertsiini-prymishchennia`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/posluhy/pryvatni-prostory`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/projects`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/muas`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/studio`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/kontakty`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/terms`, priority: 0.2 },
    { url: `${BASE}/privacy`, priority: 0.2 },
    ...projects.map((p) => ({
      url: `${BASE}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
