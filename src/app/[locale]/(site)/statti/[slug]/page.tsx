import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticle, type Block } from '@/lib/articles';
import { FinalCta } from '@/components/FinalCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug);
  if (!a) return { title: 'Статтю не знайдено' };
  return {
    title: { absolute: `${a.title} · bureau X` },
    description: a.description,
    alternates: { canonical: `/statti/${a.slug}` },
    openGraph: {
      type: 'article',
      title: a.title,
      description: a.description,
      publishedTime: a.datePublished,
      modifiedTime: a.dateModified,
    },
  };
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="display-xl mt-14 mb-5 text-[clamp(1.4rem,3vw,2.2rem)]">{block.text}</h2>;
    case 'p':
      return (
        <p
          className="mt-4 max-w-2xl text-base leading-relaxed [&_a]:underline [&_a]:decoration-ink/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-ink"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case 'ul':
      return (
        <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-base leading-relaxed text-ink/80">
          {block.items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      );
    case 'table':
      return (
        <div className="mt-6 max-w-3xl overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/20">
                {block.head.map((h, i) => (
                  <th key={i} className="py-3 pr-6 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-line align-top">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`py-3 pr-6 ${ci === 0 ? 'text-ink' : 'text-muted'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'faq':
      return (
        <div className="mt-6 max-w-2xl divide-y divide-line border-t border-line">
          {block.items.map((it, i) => (
            <div key={i} className="py-5">
              <h3 className="text-base font-medium">{it.q}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">{it.a}</p>
            </div>
          ))}
        </div>
      );
  }
}

export default function ArticlePage({ params }: { params: { locale: string; slug: string } }) {
  unstable_setRequestLocale(params.locale);
  const a = getArticle(params.slug);
  if (!a) notFound();

  const url = `${SITE_URL}/statti/${a.slug}`;
  const faqBlock = a.blocks.find((b): b is Extract<Block, { type: 'faq' }> => b.type === 'faq');

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Статті', item: `${SITE_URL}/statti` },
      { '@type': 'ListItem', position: 3, name: a.title, item: url },
    ],
  };
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url,
    inLanguage: 'uk',
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
  };
  const faqLd = faqBlock && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqBlock.items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  return (
    <article>
      <script id="ld-bc" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script id="ld-article" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && (
        <script id="ld-faq" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <nav className="container-wide pt-28 pb-0 text-xs text-muted lg:pt-36" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="transition-colors hover:text-ink">Головна</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/statti" className="transition-colors hover:text-ink">Статті</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">{a.title}</li>
        </ol>
      </nav>

      <header className="container-wide pt-8 pb-4">
        <p className="eyebrow">Стаття</p>
        <h1 className="display-xl mt-5 max-w-4xl text-[clamp(2rem,5vw,3.5rem)]">{a.title}</h1>
        <p className="mt-4 text-xs text-muted">
          <time dateTime={a.datePublished}>{fmtDate(a.datePublished)}</time>
        </p>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed">{a.lede}</p>
      </header>

      <section className="container-wide pb-16 lg:pb-24">
        {a.blocks.map((block, i) => <BlockView key={i} block={block} />)}

        {a.related.length > 0 && (
          <div className="mt-16 max-w-2xl border-t border-line pt-8">
            <p className="eyebrow mb-4">Читати далі</p>
            <ul className="space-y-2">
              {a.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-base underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <FinalCta />
    </article>
  );
}
