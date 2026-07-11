// English versions of the /statti articles, served at /en/articles/<en-slug>.
// Translations live in articles-en-{1,2,3}.ts (split for authoring convenience);
// each entry carries ukSlug so hreflang can pair the two language versions.
// Convention: any URL inside en article data (related hrefs, inline <a href>)
// is a FINAL English URL (/en/services/..., /en/articles/...), rendered with
// plain links — not the i18n <Link>.
import type { Article } from './articles';
import { ARTICLES_EN_1 } from './articles-en-1';
import { ARTICLES_EN_2 } from './articles-en-2';
import { ARTICLES_EN_3 } from './articles-en-3';

export type ArticleEn = Article & {
  /** Slug of the Ukrainian original (for hreflang pairing). */
  ukSlug: string;
};

export const ARTICLES_EN: ArticleEn[] = [
  ...ARTICLES_EN_1,
  ...ARTICLES_EN_2,
  ...ARTICLES_EN_3,
];

export function getArticleEn(slug: string): ArticleEn | undefined {
  return ARTICLES_EN.find((a) => a.slug === slug);
}

/** en slug for a uk article slug (undefined while a translation is missing). */
export function enSlugForUk(ukSlug: string): string | undefined {
  return ARTICLES_EN.find((a) => a.ukSlug === ukSlug)?.slug;
}
