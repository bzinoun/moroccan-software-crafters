import type { Metadata } from "next";
import { ArticleListSection } from "@/components/actualites/ArticleListSection";
import { loadArticles, loadSite } from "@/content/load";
import { articleCards } from "@/lib/pages-data";

// Server component: the loaders read ../content/*.json at build time. Port of
// the list branch of `news()` in assets/js/pages.js and of actualites.html.
const articles = loadArticles();
const site = loadSite();

// Static in actualites.html (og:image): the cover of the Société Générale recap.
const SHARE_PHOTO = "2026-10-sg-gscm-5";

// A page-level openGraph replaces the layout one, so it repeats type and url.
// Share URLs are absolute and `site.baseUrl` already carries the base path.
export const metadata: Metadata = {
  title: articles.meta.title,
  description: articles.meta.description,
  openGraph: {
    type: "website",
    title: articles.meta.title,
    description: articles.lead,
    url: `${site.baseUrl}/actualites/`,
    images: [`${site.baseUrl}/assets/img/meetups/${SHARE_PHOTO}.jpg`],
  },
};

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
