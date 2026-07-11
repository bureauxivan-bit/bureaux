import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { seoAlternates } from '@/i18n/seo';
import { ARTICLES } from '@/lib/articles';
import { ARTICLES_EN } from '@/lib/articles-en';

const COPY = {
  uk: {
    metaTitle: "Статті про дизайн інтер'єру та архітектуру · bureau X",
    metaDescription:
      "Статті bureau X про дизайн інтер'єру, архітектуру та ремонт: ціни, етапи роботи, поради щодо вибору бюро.",
    eyebrow: 'Журнал',
    h1: 'Статті',
    dateLocale: 'uk-UA',
  },
  en: {
    metaTitle: 'Articles on Interior Design & Architecture · bureau X',
    metaDescription:
      'bureau X articles on interior design, architecture and renovation: pricing, process stages, and advice on choosing a studio.',
    eyebrow: 'Journal',
    h1: 'Articles',
    dateLocale: 'en-US',
  },
} as const;

function copyFor(locale: string) {
  return locale === 'en' ? COPY.en : COPY.uk;
}

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const c = copyFor(locale);
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDescription,
    alternates: seoAlternates('/statti', locale),
  };
}

export default function ArticlesIndex({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const c = copyFor(locale);
  const source = locale === 'en' ? ARTICLES_EN : ARTICLES;
  const articles = [...source].sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(c.dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="container-wide pt-28 pb-24 lg:pt-36">
      <p className="eyebrow">{c.eyebrow}</p>
      <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)]">{c.h1}</h1>

      <ul className="mt-14 max-w-3xl divide-y divide-line border-t border-line">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={{ pathname: '/statti/[slug]', params: { slug: a.slug } }} className="group block py-7">
              <p className="text-xs text-muted">
                <time dateTime={a.datePublished}>{fmtDate(a.datePublished)}</time>
              </p>
              <h2 className="display-xl mt-2 text-[clamp(1.2rem,2.4vw,1.7rem)] transition-opacity group-hover:opacity-70">
                {a.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{a.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
