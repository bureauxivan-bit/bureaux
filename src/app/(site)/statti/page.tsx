import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';

export const metadata: Metadata = {
  title: { absolute: "Статті про дизайн інтер'єру та архітектуру · bureau X" },
  description:
    "Статті bureau X про дизайн інтер'єру, архітектуру та ремонт: ціни, етапи роботи, поради щодо вибору бюро.",
  alternates: { canonical: '/statti' },
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ArticlesIndex() {
  const articles = [...ARTICLES].sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  return (
    <div className="container-wide pt-28 pb-24 lg:pt-36">
      <p className="eyebrow">Журнал</p>
      <h1 className="display-xl mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)]">Статті</h1>

      <ul className="mt-14 max-w-3xl divide-y divide-line border-t border-line">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/statti/${a.slug}`} className="group block py-7">
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
