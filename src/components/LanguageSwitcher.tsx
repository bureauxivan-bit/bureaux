'use client';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const LABELS: Record<Locale, string> = { uk: 'UA', en: 'EN' };

/** UA / EN switcher — links to the same page in the other locale.
 *  Strict geometry: flat rectangles, no rounding, matches the nav blocks. */
export function LanguageSwitcher({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const locale = useLocale();
  // usePathname returns the internal pathname template; params fill [slug] etc.
  const pathname = usePathname();
  const params = useParams();

  return (
    <span
      className={`inline-flex items-center text-xs font-normal uppercase tracking-widest ${
        variant === 'dark' ? 'bg-ink text-paper' : 'bg-paper text-coal'
      }`}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        const cls = `px-2.5 py-1.5 transition-opacity duration-200 ${
          active ? 'opacity-100' : 'opacity-45 hover:opacity-80'
        }`;
        if (active) {
          return (
            <span key={l} aria-current="true" className={cls}>
              {LABELS[l]}
            </span>
          );
        }
        return (
          <Link
            key={l}
            // @ts-expect-error — pathname/params pair is valid at runtime; the
            // union of typed pathnames can't be statically narrowed here.
            href={{ pathname, params }}
            locale={l}
            className={cls}
          >
            {LABELS[l]}
          </Link>
        );
      })}
    </span>
  );
}
