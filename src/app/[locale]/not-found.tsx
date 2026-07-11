import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <div className="container-wide flex min-h-[70svh] flex-col items-center justify-center text-center">
      <p className="display-xl text-8xl text-ink">404</p>
      <p className="mt-4 text-muted">{t('message')}</p>
      <Link href="/" className="btn-ghost mt-8">{t('home')}</Link>
    </div>
  );
}
