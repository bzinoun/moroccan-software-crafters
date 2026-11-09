import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { assetUrl, linkKind } from "@/lib/routes";

// The one anchor of the site for an href that may be an internal route, an
// external URL or a hash on the same page.
// - Internal route: next/link adds the base path.
// - External URL: a plain anchor that opens in a new tab with `rel="noopener"`.
// - Hash, alone ("#sponsor-form") or after a route ("/#historique"): a plain
//   anchor. next/link does not scroll again when the hash is already in the
//   URL, so a second click on the same link would do nothing. A plain anchor
//   needs the base path added by hand for a route.
export function PageLink({
  href,
  basePath,
  ...rest
}: Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  /** Prefix of a route with a hash. Defaults to the build setting. */
  basePath?: string;
}) {
  switch (linkKind(href)) {
    case "external":
      return <a href={href} target="_blank" rel="noopener" {...rest} />;
    case "hash":
      return <a href={href} {...rest} />;
    case "route-hash":
      return <a href={assetUrl(href, basePath)} {...rest} />;
    case "route":
      return <Link href={href} {...rest} />;
  }
}
