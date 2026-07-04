type GeoInfo = {
  country: string;
  city: string;
  isp: string;
};

/** Fallback values when the geo API is unavailable — e.g. Vercel's built-in
 *  request geolocation (country/city only, no ISP). */
export type GeoHints = {
  country?: string;
  city?: string;
};

const UNKNOWN = 'Невідомо';
const LOCAL: GeoInfo = { country: 'Локально', city: '—', isp: '—' };

// Datacenter/hosting providers — traffic from them is scrapers, not people.
// Cloudflare deliberately NOT listed: iCloud Private Relay routes real Safari
// users through Cloudflare IPs.
const DATACENTER_RE =
  /amazon|aws|google llc|google cloud|microsoft|azure|digitalocean|hetzner|ovh|alibaba|tencent|huawei cloud|oracle|linode|akamai|vultr|leaseweb|m247|datacamp|contabo|scaleway|fastly|f\.n\.s\. holdings|hosting|data ?cent|facebook|meta platforms|twitter|bytedance|tiktok/i;

export function isDatacenterIsp(isp: string): boolean {
  return DATACENTER_RE.test(isp);
}

function isLocalIp(ip: string): boolean {
  return (
    ip === 'unknown' ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.')
  );
}

/** Best-effort IP geolocation via ipwho.is (free, HTTPS, no API key — HTTPS is
 *  required because Vercel Edge middleware blocks plain-http fetch). Never throws. */
export async function lookupGeo(ip: string, hints: GeoHints = {}): Promise<GeoInfo> {
  if (isLocalIp(ip)) return LOCAL;

  const fallback: GeoInfo = {
    country: hints.country || UNKNOWN,
    city: hints.city || UNKNOWN,
    isp: UNKNOWN,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://ipwho.is/${ip}?fields=success,country,city,connection.isp`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return fallback;

    const data = (await res.json()) as {
      success: boolean;
      country?: string;
      city?: string;
      connection?: { isp?: string };
    };
    if (!data.success) return fallback;

    return {
      country: data.country || fallback.country,
      city: data.city || fallback.city,
      isp: data.connection?.isp || fallback.isp,
    };
  } catch {
    return fallback;
  }
}
