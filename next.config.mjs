/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname; }
  catch { return undefined; }
})();

const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      ...(supabaseHost ? [{ protocol: 'https', hostname: supabaseHost }] : []),
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};
export default nextConfig;
