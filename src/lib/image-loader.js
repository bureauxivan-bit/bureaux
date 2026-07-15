// Custom next/image loader: resize remote images through wsrv.nl
// (free image CDN) instead of Vercel's optimizer, whose Hobby-tier
// transformation quota we exhausted (402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED).
export default function imageLoader({ src, width, quality }) {
  // Remote images (Supabase Storage) — proxy through wsrv.nl.
  if (src.startsWith('http')) {
    const params = new URLSearchParams({
      url: src,
      w: String(width),
      q: String(quality ?? 75),
      output: 'webp',
    });
    return `https://wsrv.nl/?${params}`;
  }
  // Local /public assets (logos etc.) — serve as-is; wsrv can't reach
  // relative paths and these files are small anyway.
  return src;
}
