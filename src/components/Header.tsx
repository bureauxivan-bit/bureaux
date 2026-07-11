'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLeadModal } from './LeadModal';
import type { Settings } from '@/lib/types';

const NAV = [
  { key: 'about', hash: '#about' },
  { key: 'projects', hash: '#projects' },
  { key: 'services', hash: '#services' },
] as const;

export function Header({ settings }: { settings: Settings }) {
  const t = useTranslations('header');
  const { openEstimate } = useLeadModal();
  const [menu, setMenu] = useState(false);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 py-5 transition-colors duration-300 ${menu ? 'bg-ink' : ''}`}>
      <div className="container-wide flex items-center justify-between">

        {/* Logo in black box */}
        <Link href="/" className="inline-flex items-center bg-ink px-3 py-1.5 transition-colors duration-200 hover:bg-ink/70">
          <Image
            src="/images/logo_big_inv.png"
            alt="bureau x"
            width={0}
            height={0}
            sizes="200px"
            className="h-6 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav — always black rectangles */}
        <nav className="hidden items-center gap-2 text-xs font-normal uppercase tracking-widest lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.key}
              href={{ pathname: '/', hash: n.hash }}
              className="bg-ink px-3 py-1.5 text-paper transition-colors duration-200 hover:bg-ink/70"
            >
              {t(`nav.${n.key}`)}
            </Link>
          ))}
          {settings.itemXUrl && (
            <a
              href={settings.itemXUrl}
              target="_blank"
              rel="noopener"
              className="bg-ink px-3 py-1.5 text-paper transition-colors duration-200 hover:bg-ink/70"
            >
              item <em>X</em>
            </a>
          )}
          <LanguageSwitcher />
        </nav>

        {/* CTA — black rectangle */}
        <div className="hidden items-center lg:flex">
          <button
            onClick={openEstimate}
            className="group flex items-center gap-3 bg-ink px-5 py-2 text-xs font-normal uppercase tracking-widest text-paper transition-colors duration-200 hover:bg-ink/70"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-1">⟶</span>
            {t('estimate')}
          </button>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenu((m) => !m)}
          aria-label={t('menu')}
          className="flex h-10 w-10 items-center justify-center bg-ink text-paper lg:hidden"
        >
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 h-0.5 w-6 bg-current transition-all ${menu ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-6 bg-current transition-all ${menu ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 h-0.5 w-6 bg-current transition-all ${menu ? 'top-1.5 -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`overflow-hidden lg:hidden ${menu ? 'max-h-[460px]' : 'max-h-0'} transition-all duration-500`}>
        <div className="container-wide flex flex-col gap-1 bg-ink py-6">
          {NAV.map((n) => (
            <Link
              key={n.key}
              href={{ pathname: '/', hash: n.hash }}
              onClick={() => setMenu(false)}
              className="flex items-center gap-3 py-2 text-sm font-normal uppercase tracking-widest text-paper/80 hover:text-paper"
            >
              <span className="inline-block h-1.5 w-1.5 bg-paper opacity-50" />
              {t(`nav.${n.key}`)}
            </Link>
          ))}
          {settings.itemXUrl && (
            <a
              href={settings.itemXUrl}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-3 py-2 text-sm font-normal uppercase tracking-widest text-paper/60 hover:text-paper"
            >
              <span className="inline-block h-1.5 w-1.5 bg-paper/60 opacity-50" />
              item <em>X</em>
            </a>
          )}
          <button
            onClick={() => { setMenu(false); openEstimate(); }}
            className="mt-4 flex items-center gap-3 bg-paper px-5 py-3 text-xs font-normal uppercase tracking-widest text-coal transition-opacity duration-200 hover:opacity-85"
          >
            <span>⟶</span>
            {t('freeEstimate')}
          </button>
          <div className="mt-4 flex items-center">
            <LanguageSwitcher variant="light" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-paper/50">
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="underline underline-offset-2">{settings.phone}</a>
            )}
            {settings.telegram && (
              <a href={settings.telegram} className="underline underline-offset-2">Telegram</a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} className="underline underline-offset-2">Instagram</a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} className="underline underline-offset-2">Facebook</a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
