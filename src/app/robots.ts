import type { MetadataRoute } from 'next';
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/miy-proekt/', '/kp/', '/login', '/register'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
