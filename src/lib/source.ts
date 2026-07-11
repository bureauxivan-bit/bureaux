// Maps a referrer (or the special "Google Ads" marker) to a compact channel
// label. Shared by the edge middleware (to stamp a first-touch bx_src cookie)
// and the /stats report, so acquisition and conversion use the same buckets.
// Pure + edge-safe: no Node APIs.

export const DIRECT = 'Пряме/месенджер';

export function channelLabel(referrer: string | null | undefined, siteHost = 'bureaux.com.ua'): string {
  if (referrer === 'Google Ads') return 'Google Ads';
  if (!referrer || referrer === 'Пряме відвідування') return DIRECT;

  const pin = /pinterest/i.test(referrer);
  try {
    const h = new URL(referrer).hostname.replace(/^(www|l|lm|m)\./, '');
    if (h.includes(siteHost)) return 'Внутрішні';
    if (h.includes('instagram')) return 'Instagram';
    if (h.includes('facebook') || h === 'fb.com') return 'Facebook';
    if (h.includes('pinterest')) return 'Pinterest';
    if (h.includes('tiktok')) return 'TikTok';
    if (h.includes('t.me') || h.includes('telegram')) return 'Telegram';
    if (h.includes('chatgpt') || h.includes('openai')) return 'ChatGPT';
    if (h.includes('claude') || h.includes('anthropic')) return 'Claude';
    if (h.includes('perplexity')) return 'Perplexity';
    if (h.includes('gemini')) return 'Gemini';
    if (h.includes('bing')) return 'Bing';
    if (h.includes('google')) return 'Google (органіка)';
    return h;
  } catch {
    // Non-URL referrers (e.g. the Android app token "com.pinterest").
    if (pin) return 'Pinterest';
    return DIRECT;
  }
}
