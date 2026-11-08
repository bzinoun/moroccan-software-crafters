// Every href, in content/*.json and in TypeScript, is a route ("/meetup/#proposer"),
// a hash on the same page or a full URL. `next/link` adds the basePath on
// its own; a plain `<img src>` does not, so public files go through `assetUrl`.

import type { PageId } from "@/content/types";

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

export function pageRoute(page: PageId): string {
  return PAGE_ROUTES[page];
}

export function assetUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
