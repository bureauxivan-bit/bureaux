'use client';
import { defaultCountries, parseCountry } from 'react-international-phone';
import type { CountryIso2 } from 'react-international-phone';
import { useState, useRef, useEffect } from 'react';

const toFlag = (iso2: string) =>
  [...iso2.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('');

function detectCountry(): CountryIso2 {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Europe/Kyiv' || tz === 'Europe/Kiev') return 'ua';
    if (tz === 'Europe/Warsaw') return 'pl';
    if (tz === 'Europe/Berlin' || tz === 'Europe/Vienna' || tz === 'Europe/Zurich') return 'de';
    if (tz === 'Europe/London') return 'gb';
    if (tz.startsWith('America/')) return 'us';
    const lang = typeof navigator !== 'undefined' ? navigator.language : '';
    if (lang.startsWith('uk')) return 'ua';
    if (lang.startsWith('pl')) return 'pl';
    if (lang.startsWith('de')) return 'de';
  } catch {}
  return 'ua';
}

const COUNTRIES = [
  ...defaultCountries.filter((c) => parseCountry(c).iso2 === 'ua'),
  ...defaultCountries.filter((c) => parseCountry(c).iso2 !== 'ua'),
];

export function PhoneInput({
  value,
  onChange,
  dark,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  dark?: boolean;
  hasError?: boolean;
}) {
  const defaultIso2 = useRef(detectCountry()).current;
  const [iso2, setIso2] = useState<CountryIso2>(defaultIso2);
  const [national, setNational] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const countryData = parseCountry(
    COUNTRIES.find((c) => parseCountry(c).iso2 === iso2) ?? COUNTRIES[0]
  );

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleCountrySelect = (newIso2: CountryIso2) => {
    const newCountry = parseCountry(
      COUNTRIES.find((c) => parseCountry(c).iso2 === newIso2) ?? COUNTRIES[0]
    );
    setIso2(newIso2);
    setOpen(false);
    onChange(`+${newCountry.dialCode}${national}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNational(val);
    onChange(`+${countryData.dialCode}${val}`);
  };

  const border = hasError ? 'border-ink' : dark ? 'border-paper/20' : 'border-ink/15';
  const divider = dark ? 'border-paper/20' : 'border-ink/15';
  const bg = dark ? 'bg-[#0f0e0d]' : 'bg-paper';
  const text = dark ? 'text-paper' : 'text-ink';
  const muted = dark ? 'text-paper/40' : 'text-ink/40';
  const placeholder = dark ? 'placeholder:text-paper/40' : 'placeholder:text-ink/40';
  const hover = dark ? 'hover:bg-paper/10' : 'hover:bg-ink/5';
  const activeClass = dark ? 'bg-paper/10' : 'bg-ink/5';

  return (
    <div className="relative" ref={wrapRef}>
      <div className={`flex w-full border ${border} bg-transparent transition-colors`}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex shrink-0 items-center gap-1.5 border-r ${divider} px-3 py-3.5 outline-none`}
        >
          <span className="text-lg leading-none">{toFlag(iso2)}</span>
          <span className={`text-sm tabular-nums ${muted}`}>+{countryData.dialCode}</span>
          <span className={`text-[9px] ${muted}`}>{open ? '▲' : '▼'}</span>
        </button>
        <input
          type="tel"
          inputMode="tel"
          value={national}
          onChange={handleNumberChange}
          placeholder="98 999 99 99"
          className={`min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base outline-none ${text} ${placeholder}`}
        />
      </div>

      {open && (
        <div
          className={`absolute left-0 top-full z-50 mt-px max-h-56 w-full overflow-y-auto border ${divider} ${bg}`}
        >
          {COUNTRIES.map((c) => {
            const p = parseCountry(c);
            const isActive = p.iso2 === iso2;
            return (
              <button
                key={p.iso2}
                type="button"
                onClick={() => handleCountrySelect(p.iso2 as CountryIso2)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm ${text} ${hover} ${isActive ? activeClass : ''}`}
              >
                <span className="text-base leading-none">{toFlag(p.iso2)}</span>
                <span className="flex-1 truncate">{p.name}</span>
                <span className={`tabular-nums ${muted}`}>+{p.dialCode}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
