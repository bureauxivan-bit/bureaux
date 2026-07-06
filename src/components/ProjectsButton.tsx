'use client';
import Link from 'next/link';
import { trackEvent } from '@/lib/track';

// Softer secondary CTA for cold social traffic: sends people straight to the
// work instead of asking for a phone number up front.
export function ProjectsButton({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/projects"
      onClick={() => trackEvent('cta_projects')}
      className={className}
    >
      Переглянути проєкти
    </Link>
  );
}
