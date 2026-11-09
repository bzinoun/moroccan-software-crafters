import type { MetadataRoute } from "next";
import { loadArticles, loadSite } from "@/content/load";

// An exported site needs the metadata route prerendered at build time.
export const dynamic = "force-static";

const PAGE_PATHS = [
  "/",
  "/meetup/",
  "/association/",
  "/actualites/",
  "/socrates/",
  "/accueillir/",
];

// `site.baseUrl` already carries the GitHub Pages base path, so every URL is
// built from it. Every path ends with a slash (`trailingSlash: true`).
export default function sitemap(): MetadataRoute.Sitemap {
  const { baseUrl } = loadSite();
  const articles = loadArticles();
  const pages = PAGE_PATHS.map((path) => ({ url: `${baseUrl}${path}` }));
  // An article has a date, so it gets a `lastModified`; the other pages have none.
  const posts = articles.items.map((a) => ({
    url: `${baseUrl}/actualites/${a.slug}/`,
    lastModified: a.date,
  }));
  return [...pages, ...posts];
}
