import type { Metadata } from "next";
import { ArticleListSection } from "@/components/actualites/ArticleListSection";
import { loadArticles, loadSite } from "@/content/load";
import { absoluteMeetupPhoto } from "@/lib/derive";
import { articleCards, DEFAULT_SOCIAL_PHOTO } from "@/lib/pages-data";

// Server component: the loaders read content/*.json at build time. Port of
// the list branch of `news()` in the former `assets/js/pages.js` (`git show 1353207:assets/js/pages.js`) and of the former `actualites.html` (`git show 1353207:actualites.html`).
const articles = loadArticles();
const site = loadSite();

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
    // The former `actualites.html` shared the cover of the Société Générale recap.
    images: [absoluteMeetupPhoto(site.baseUrl, DEFAULT_SOCIAL_PHOTO)],
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
