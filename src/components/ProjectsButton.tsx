'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { trackEvent } from '@/lib/track';

// Softer secondary CTA for cold social traffic: sends people straight to the
// work instead of asking for a phone number up front.
export function ProjectsButton({ className = '' }: { className?: string }) {
  const t = useTranslations('common');
  return (
    <Link
      href="/projects"
      onClick={() => trackEvent('cta_projects')}
      className={className}
    >
      {t('viewProjects')}
    </Link>
  );
}
