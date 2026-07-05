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
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      ...(supabaseHost ? [{ protocol: 'https', hostname: supabaseHost }] : []),
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};
export default nextConfig;
