'use client';

// Subtle "scroll down" hint. 75% of visitors never scrolled past the hero —
// this nudges them into the rest of the page. Hidden once they start scrolling.
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export function ScrollCue() {
  const t = useTranslations('scrollCue');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollDown}
      aria-label={t('ariaLabel')}
      className={`absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-paper/60 transition-opacity duration-500 hover:text-paper ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <span className="text-[10px] font-normal uppercase tracking-[0.25em]">{t('label')}</span>
      <span className="animate-bounce text-lg leading-none">↓</span>
    </button>
  );
}
