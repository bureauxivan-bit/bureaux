/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname; }
  catch { return undefined; }
})();

const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      // Old-site project URLs (/projects/info/<hex-id>) still live in Google's
      // index — send those visitors to the projects page instead of a 404.
      {
        source: '/projects/info/:id',
        destination: '/projects',
        permanent: true,
      },
    ];
  },
  images: {
    // WebP only: AVIF doubled the number of transformations on Vercel's
    // free tier for a barely noticeable size win.
    formats: ['image/webp'],
    // Supabase Storage sends max-age=3600, so Vercel re-transformed every
    // image hourly. Project photos never change under the same URL, so
    // cache optimized versions for 31 days.
    minimumCacheTTL: 2678400,
    // Fewer srcset widths = fewer transformations per image.
    deviceSizes: [640, 828, 1200, 1920],
    remotePatterns: [
      ...(supabaseHost ? [{ protocol: 'https', hostname: supabaseHost }] : []),
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};
export default nextConfig;
