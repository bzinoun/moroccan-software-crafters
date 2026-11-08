import type { MetadataRoute } from "next";
import { loadSite } from "@/content/load";
import { articleSlugs } from "@/lib/pages-data";

// A static export needs the metadata route prerendered at build time.
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
  const paths = [
    ...PAGE_PATHS,
    ...articleSlugs().map((slug) => `/actualites/${slug}/`),
  ];
  return paths.map((path) => ({ url: `${baseUrl}${path}` }));
}
