import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Reveal } from './Reveal';
import type { Settings } from '@/lib/types';

export function Footer({ settings }: { settings: Settings }) {
  const t = useTranslations('footer');
  const socials = [
    settings.behance && { label: 'Behance', href: settings.behance },
    settings.facebook && { label: 'Facebook', href: settings.facebook },
    settings.instagram && { label: 'Instagram', href: settings.instagram },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="bg-coal text-paper">
      <div className="container-wide py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">

          <Reveal>
            <div>
              <Image src="/images/logo_big_inv.png" alt="bureau x" width={0} height={0}
                sizes="200px" className="h-10 w-auto object-contain" />
              <p className="mt-4 max-w-sm text-sm text-paper/55">
                {t('tagline')}
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-2 text-sm">
              <p className="eyebrow mb-4 text-paper/50">{t('contacts')}</p>
              {settings.address && <p className="text-paper/70">{settings.address}</p>}
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="block link-underline">{settings.phone}</a>
              )}
              {settings.email && <a href={`mailto:${settings.email}`} className="block link-underline">{settings.email}</a>}
              {settings.coordinates && <p className="pt-2 text-xs text-paper/40">{settings.coordinates}</p>}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="space-y-2 text-sm">
              <p className="eyebrow mb-4 text-paper/50">{t('socials')}</p>
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" className="block link-underline">{s.label} ↗</a>
              ))}
              {settings.itemXUrl && (
                <a href={settings.itemXUrl} target="_blank" rel="noopener" className="mt-3 block text-paper underline">
                  item <em>X</em> — {t('shop')} ↗
                </a>
              )}
            </div>
          </Reveal>

        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-8 text-xs text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('rights')}</p>
          <div className="flex gap-6">
            <Link href="/muas" className="link-underline">{t('muas')}</Link>
            <Link href="/terms" className="link-underline">{t('terms')}</Link>
            <Link href="/privacy" className="link-underline">{t('privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
