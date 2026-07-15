import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
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
    // Vercel's optimizer ran out of Hobby-tier transformations (402s on
    // /_next/image), so remote images are resized via wsrv.nl instead.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.js',
    deviceSizes: [640, 828, 1200, 1920],
  },
};
export default withNextIntl(nextConfig);
