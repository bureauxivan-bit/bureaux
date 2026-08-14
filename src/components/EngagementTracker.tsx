'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// crypto.randomUUID needs Chrome 92+/iOS 15.4+ — the in-app WebViews that ad
// clicks arrive in (Instagram, ad-network apps) often ship older engines, and
// the throw took down the whole page for a paying visitor. Fall back to a
// v4-shaped UUID from getRandomValues (universally supported); the server's
// UUID_RE accepts both.
function pageviewId(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === 'function') return c.randomUUID();
  const b = new Uint8Array(16);
  if (typeof c?.getRandomValues === 'function') c.getRandomValues(b);
  else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // variant 10
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Measures real engagement per pageview: max scroll depth and time the tab
// was actually visible. Sends a beacon on hide/leave; beacons share one
// pageview id and the server upserts, so repeated sends just refresh totals.
export function EngagementTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const id = pageviewId();
    let visibleSince: number | null = document.visibilityState === 'visible' ? Date.now() : null;
    let visibleMs = 0;
    let maxScroll = 0;

    const measureScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct = scrollable > 50 ? Math.round((window.scrollY / scrollable) * 100) : 100;
      if (pct > maxScroll) maxScroll = Math.min(100, pct);
    };

    const send = () => {
      const seconds = Math.round((visibleMs + (visibleSince ? Date.now() - visibleSince : 0)) / 1000);
      if (seconds < 1) return;
      navigator.sendBeacon(
        '/api/track/engagement',
        JSON.stringify({ id, page: pathname, seconds, scroll: maxScroll }),
      );
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (visibleSince) {
          visibleMs += Date.now() - visibleSince;
          visibleSince = null;
        }
        send();
      } else if (!visibleSince) {
        visibleSince = Date.now();
      }
    };

    measureScroll();
    window.addEventListener('scroll', measureScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', send);

    return () => {
      send(); // SPA navigation to another page
      window.removeEventListener('scroll', measureScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', send);
    };
  }, [pathname]);

  return null;
}
