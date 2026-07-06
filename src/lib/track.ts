// Client-side event tracking. Fires to Google (gtag + GTM dataLayer) and Meta
// Pixel for the standard dashboards, and beacons to our own /api/track/event
// so the Telegram /stats funnel (visits → CTA clicks → leads) stays live.
type Params = Record<string, string | number | boolean>;

export function trackEvent(name: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...a: unknown[]) => void;
  };
  try {
    w.gtag?.('event', name, params);
    w.dataLayer?.push({ event: name, ...params });
    if (name.startsWith('cta_')) w.fbq?.('trackCustom', name, params);
  } catch {}
  try {
    navigator.sendBeacon?.(
      '/api/track/event',
      JSON.stringify({ name, page: window.location.pathname }),
    );
  } catch {}
}
