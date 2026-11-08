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

export type LinkKind = "external" | "hash" | "route-hash" | "route";

/** Which element an href needs: only a plain route goes through next/link. */
export function linkKind(href: string): LinkKind {
  if (isExternal(href)) return "external";
  if (href.startsWith("#")) return "hash";
  if (href.includes("#")) return "route-hash";
  return "route";
}

export function pageRoute(page: PageId): string {
  return PAGE_ROUTES[page];
}

/** `basePath` defaults to the build setting; a test passes the value it needs. */
export function assetUrl(
  path: string,
  basePath: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "",
): string {
  return `${basePath}${path}`;
}
