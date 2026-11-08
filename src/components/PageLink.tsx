import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { assetUrl, isExternal } from "@/lib/routes";

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
  ...rest
}: Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string }) {
  if (isExternal(href)) {
    return <a href={href} target="_blank" rel="noopener" {...rest} />;
  }
  if (href.startsWith("#")) return <a href={href} {...rest} />;
  if (href.includes("#")) return <a href={assetUrl(href)} {...rest} />;
  return <Link href={href} {...rest} />;
}
