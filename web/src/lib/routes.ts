// Maps the root-site hrefs stored in content/*.json to App Router routes.
// `next/link` adds the basePath on its own; plain `<img src>` does not, so
// static assets go through `assetUrl`.

import type { PageId } from "@/content/types";

const PAGE_FILES: Record<string, string> = {
  "index.html": "/",
  "meetup.html": "/meetup/",
  "socrates.html": "/socrates/",
  "actualites.html": "/actualites/",
  "association.html": "/association/",
  "accueillir.html": "/accueillir/",
};

const PAGE_ROUTES: Record<PageId, string> = {
  home: "/",
  meetup: "/meetup/",
  socrates: "/socrates/",
  news: "/actualites/",
  association: "/association/",
  host: "/accueillir/",
};

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function toRoute(href: string): string {
  if (isExternal(href) || href.startsWith("#")) return href;
  const [file, hash] = href.split("#");
  const route = file === "" || file === "./" ? "/" : (PAGE_FILES[file] ?? `/${file}`);
  return hash === undefined ? route : `${route}#${hash}`;
}

export function pageRoute(page: PageId): string {
  return PAGE_ROUTES[page];
}

export function assetUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
