'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLeadModal } from './LeadModal';
import type { Settings } from '@/lib/types';

const NAV = [
  { label: 'Про нас', href: '/#about' },
  { label: 'Проєкти', href: '/#projects' },
  { label: 'Послуги', href: '/#services' },
];

export function Header({ settings }: { settings: Settings }) {
  const { openEstimate } = useLeadModal();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-paper/85 py-3 backdrop-blur-md shadow-[0_1px_0_rgb(var(--line))]' : 'py-5'
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        <Link href="/" className="display-xl text-xl tracking-tightest">
          BUREAU<span className="text-terra">X</span>
        </Link>

        <nav className="hidden items-center gap-9 text-sm font-medium lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="link-underline">{n.label}</a>
          ))}
          {settings.itemXUrl && (
            <a href={settings.itemXUrl} target="_blank" rel="noopener" className="link-underline text-muted">
              Item X ↗
            </a>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={openEstimate} className="btn-terra hidden sm:inline-flex !px-5 !py-2.5 text-xs">
            Прорахунок проєкту
          </button>
          <button
            onClick={() => setMenu((m) => !m)} aria-label="Меню"
            className="flex h-10 w-10 items-center justify-center lg:hidden"
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-0.5 w-6 bg-ink transition-all ${menu ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-6 bg-ink transition-all ${menu ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-0.5 w-6 bg-ink transition-all ${menu ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div className={`overflow-hidden lg:hidden ${menu ? 'max-h-[420px]' : 'max-h-0'} transition-all duration-500`}>
        <div className="container-wide flex flex-col gap-1 border-t border-line bg-paper/95 py-6 backdrop-blur">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setMenu(false)} className="py-2 text-lg font-medium">
              {n.label}
            </a>
          ))}
          {settings.itemXUrl && (
            <a href={settings.itemXUrl} target="_blank" rel="noopener" className="py-2 text-lg text-muted">Item X ↗</a>
          )}
          <button onClick={() => { setMenu(false); openEstimate(); }} className="btn-terra mt-3">
            Прорахунок проєкту
          </button>
          <div className="mt-4 flex flex-col gap-1 text-sm text-muted">
            {settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>}
            <div className="flex gap-4">
              {settings.telegram && <a href={settings.telegram}>Telegram</a>}
              {settings.instagram && <a href={settings.instagram}>Instagram</a>}
              {settings.facebook && <a href={settings.facebook}>Facebook</a>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
