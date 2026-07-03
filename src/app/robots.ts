import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

const DISALLOW = ['/admin/', '/api/', '/miy-proekt/', '/kp/', '/login', '/register'];

// AI-краулери, яким явно дозволяємо доступ (AEO/GEO):
// OpenAI, Anthropic, Perplexity, Google Gemini, Bing (пошук ChatGPT), Common Crawl.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'GoogleOther',
  'Bingbot',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
