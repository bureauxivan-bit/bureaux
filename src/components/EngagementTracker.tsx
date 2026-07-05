'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Measures real engagement per pageview: max scroll depth and time the tab
// was actually visible. Sends a beacon on hide/leave; beacons share one
// pageview id and the server upserts, so repeated sends just refresh totals.
export function EngagementTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const id = crypto.randomUUID();
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
