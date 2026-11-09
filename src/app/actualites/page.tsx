import type { Metadata } from "next";
import { ArticleListSection } from "@/components/actualites/ArticleListSection";
import { loadArticles } from "@/content/load";
import { pageMetadata } from "@/lib/page-metadata";
import { articleCards, DEFAULT_SOCIAL_PHOTO } from "@/lib/pages-data";

// Server component: the loaders read content/*.json at build time.
const articles = loadArticles();

export const metadata: Metadata = pageMetadata({
  path: "/actualites/",
  title: articles.meta.title,
  description: articles.meta.description,
  share: { description: articles.lead },
  photo: DEFAULT_SOCIAL_PHOTO,
});

export default function NewsPage() {
  return (
    <ArticleListSection
      eyebrow={articles.eyebrow}
      title={articles.title}
      lead={articles.lead}
      articles={articleCards(articles)}
    />
  );
}
