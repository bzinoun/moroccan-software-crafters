import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { isExternal } from "@/lib/routes";

// The one anchor of the site for an href that may be an internal route, an
// external URL or a hash on the same page.
// - Internal route: next/link adds the base path.
// - External URL: a plain anchor that opens in a new tab with `rel="noopener"`.
// - Hash only ("#sponsor-form"): a plain anchor too. The hash needs no base
//   path, and next/link does not scroll again when the hash is already in the
//   URL, so a second click on the same link would do nothing.
export function PageLink({
  href,
  ...rest
}: Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string }) {
  if (isExternal(href)) {
    return <a href={href} target="_blank" rel="noopener" {...rest} />;
  }
  return href.startsWith("#") ? (
    <a href={href} {...rest} />
  ) : (
    <Link href={href} {...rest} />
  );
}
