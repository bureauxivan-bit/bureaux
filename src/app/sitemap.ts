import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/data';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.example';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects().catch(() => []);
  return [
    { url: BASE, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/projects`, changeFrequency: 'weekly', priority: 0.8 },
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
