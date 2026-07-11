import { notFound } from 'next/navigation';

// Unknown paths under a valid locale (/en/foo, /abc) fall through to the
// localized not-found page instead of Next's default 404.
export default function CatchAllPage() {
  notFound();
}
