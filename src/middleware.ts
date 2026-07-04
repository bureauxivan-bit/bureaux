import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';
import { jwtVerify } from 'jose';
import { notifyVisit } from '@/lib/telegram';
import { lookupGeo, isDatacenterIsp } from '@/lib/geo';
import { parseUserAgent, isBotUserAgent } from '@/lib/ua';

const ADMIN_COOKIE = 'bx_session';
const CLIENT_COOKIE = 'bx_client';
const VISITOR_COOKIE = 'bx_vid';
const VISIT_SESSION_COOKIE = 'bx_visit_sid';
const VISIT_SESSION_MAX_AGE = 30 * 60; // one Telegram notification per 30 min per visitor
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365;

// Only real public pages count as visits. Anything else (/wp-includes, /vendor/…)
// is vulnerability scanners probing for WordPress/PHP — they 404 but would spam
// the analytics chat. /admin and /miy-proekt are internal, not prospect traffic.
// Keep in sync with src/app/(site) routes when adding public pages.
const TRACKED_PREFIXES = [
  '/projects',
  '/posluhy',
  '/studio',
  '/kontakty',
  '/muas',
  '/privacy',
  '/terms',
  '/thank-you',
  '/kp',
  '/login',
  '/register',
];

function isTrackedPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return TRACKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

async function isValid(token: string | undefined, secret: string, role?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (role && payload.role !== role) return false;
    return true;
  } catch {
    return false;
  }
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

// Same-visitor duplicate guard (per edge isolate): parallel requests race past
// the cookie check before either response lands, so cookies alone can't dedup.
const recentlyNotified = new Map<string, number>();
const NOTIFY_DEDUP_MS = 60_000;

/** Fired via waitUntil — must not delay the response. Sends at most one Telegram
 *  notification per visitor per 30-minute visit session. */
async function trackVisit(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  if (!isTrackedPath(pathname)) return;

  // Next.js link prefetches and client-router fetches aren't page views —
  // hovering the nav can prefetch several routes at once, each of which
  // would otherwise count as a separate visit. Next/Vercel strip their
  // internal markers (rsc header, ?_rsc param) before middleware runs, so
  // the reliable signal is sec-fetch-dest: browsers set it to "document"
  // for real navigations and "empty" for fetch()-based prefetches, and
  // servers can't strip it. _rsc/purpose checks kept as belt-and-suspenders.
  const dest = req.headers.get('sec-fetch-dest');
  if (
    req.nextUrl.searchParams.has('_rsc') ||
    req.headers.get('purpose') === 'prefetch' ||
    req.headers.get('sec-purpose')?.includes('prefetch') ||
    (dest && dest !== 'document')
  ) {
    return;
  }

  const userAgent = req.headers.get('user-agent') || '';
  if (!userAgent || isBotUserAgent(userAgent)) return;

  // Monitors and scripts send a UA that parses to no browser/OS — not a person.
  const parsedUa = parseUserAgent(userAgent);
  if (!parsedUa.looksHuman) return;

  // Real browsers always send Accept-Language on page loads. Crawler fetchers
  // that fake a browser UA (Google's page renderer posing as a Nexus 5, etc.)
  // typically omit it.
  if (!req.headers.get('accept-language')) return;

  const alreadyNotifiedThisSession = req.cookies.has(VISIT_SESSION_COOKIE);
  const isNewVisitor = !req.cookies.has(VISITOR_COOKIE);

  // Cookie writes must happen before the first `await` so they land on the
  // response before middleware() returns it (waitUntil runs after that).
  res.cookies.set(VISIT_SESSION_COOKIE, '1', {
    maxAge: VISIT_SESSION_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
  });
  if (isNewVisitor) {
    res.cookies.set(VISITOR_COOKIE, '1', {
      maxAge: VISITOR_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  if (alreadyNotifiedThisSession) return;

  const ip = clientIp(req);
  const dedupKey = `${ip}|${userAgent}`;
  const now = Date.now();
  const lastNotified = recentlyNotified.get(dedupKey);
  if (lastNotified && now - lastNotified < NOTIFY_DEDUP_MS) return;
  recentlyNotified.set(dedupKey, now);
  if (recentlyNotified.size > 500) {
    for (const [key, ts] of recentlyNotified) {
      if (now - ts > NOTIFY_DEDUP_MS) recentlyNotified.delete(key);
    }
  }

  try {
    const { device, os, browser } = parsedUa;
    const language = req.headers.get('accept-language')?.split(',')[0]?.trim() || 'Невідомо';
    const referrer = req.headers.get('referer') || 'Пряме відвідування';

    // Show UTM as a separate campaign line; strip tracking junk (fbclid & co)
    // from the displayed page URL so it stays readable.
    const params = req.nextUrl.searchParams;
    const utm = [params.get('utm_source'), params.get('utm_medium'), params.get('utm_content') || params.get('utm_campaign')]
      .filter(Boolean)
      .join(' / ');
    const cleanParams = new URLSearchParams();
    for (const [key, value] of params) {
      if (!/^(utm_|fbclid|gclid|yclid|msclkid|igsh|ttclid|_rsc)/.test(key)) cleanParams.set(key, value);
    }
    const qs = cleanParams.toString();
    const url = req.nextUrl.pathname + (qs ? `?${qs}` : '');
    // Vercel populates req.geo at the edge — used as fallback if the geo API is down.
    let geoCity: string | undefined;
    try {
      geoCity = req.geo?.city ? decodeURIComponent(req.geo.city) : undefined;
    } catch {
      geoCity = req.geo?.city;
    }
    const { country, city, isp } = await lookupGeo(ip, {
      country: req.geo?.country,
      city: geoCity,
    });

    // Scraper fleets fake real-browser UAs but run from hosting providers.
    if (isDatacenterIsp(isp)) {
      console.log('[analytics] skipped datacenter visit:', { ip, isp, url });
      return;
    }

    console.log('[analytics] visit:', { ip, url, isNewVisitor });
    const visit = {
      ip,
      country,
      city,
      isp,
      device,
      os,
      browser,
      language,
      referrer,
      url,
      utm: utm || undefined,
      isNewVisitor,
    };
    await Promise.all([
      notifyVisit({ timestamp: new Date(), ...visit }),
      logVisit(req.nextUrl.origin, visit),
    ]);
  } catch (err) {
    console.error('[analytics] trackVisit failed:', err);
  }
}

/** Persists the visit for monthly stats. Prisma can't run in edge middleware,
 *  so this POSTs to an internal Node route. Best-effort. */
async function logVisit(origin: string, visit: Record<string, unknown>) {
  try {
    const res = await fetch(`${origin}/api/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-track-secret': process.env.AUTH_SECRET ?? '',
      },
      body: JSON.stringify(visit),
    });
    if (!res.ok) console.error('[analytics] logVisit rejected:', res.status);
  } catch (err) {
    console.error('[analytics] logVisit failed:', err);
  }
}

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET ?? '';

  let response: NextResponse;

  if (pathname.startsWith('/admin')) {
    const isLogin = pathname === '/admin/login';
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const valid = await isValid(token, secret);

    if (!isLogin && !valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      response = NextResponse.redirect(url);
    } else if (isLogin && valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      response = NextResponse.redirect(url);
    } else {
      response = NextResponse.next();
    }
  } else if (pathname.startsWith('/miy-proekt')) {
    // Client dashboard — requires approved client session
    const token = req.cookies.get(CLIENT_COOKIE)?.value;
    const valid = await isValid(token, secret, 'client');
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      response = NextResponse.redirect(url);
    } else {
      response = NextResponse.next();
    }
  } else if (pathname === '/login') {
    // Client login — redirect to dashboard if already logged in
    const token = req.cookies.get(CLIENT_COOKIE)?.value;
    const valid = await isValid(token, secret, 'client');
    if (valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/miy-proekt';
      response = NextResponse.redirect(url);
    } else {
      response = NextResponse.next();
    }
  } else {
    response = NextResponse.next();
  }

  event.waitUntil(trackVisit(req, response));

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
