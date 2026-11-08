import "server-only";

// These functions read content/articles.json through node:fs by default.
// Import this module from pages, `generateStaticParams` and sitemap code.
// `pages-data.ts` stays free of node:fs.

import { loadArticles } from "@/content/load";
import type { Article, Articles } from "@/content/types";

/** Every article slug, for `generateStaticParams`. */
export function articleSlugs(articles: Articles = loadArticles()): string[] {
  return articles.items.map((a) => a.slug);
}

/** The article of a slug, or undefined. */
export function articleBySlug(
  slug: string,
  articles: Articles = loadArticles(),
): Article | undefined {
  return articles.items.find((a) => a.slug === slug);
}
