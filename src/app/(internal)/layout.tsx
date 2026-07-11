import type { Metadata } from 'next';
import { RootDocument } from '@/components/RootDocument';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

// Admin panel, client dashboard and KP proposals are Ukrainian-only —
// they live outside the [locale] tree and never get an /en variant.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'bureau X',
    template: '%s · bureau X',
  },
  robots: { index: false, follow: false },
};

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="uk">{children}</RootDocument>;
}
