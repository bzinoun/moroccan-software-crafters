import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { loadSite } from "@/content/load";
import type { PageId } from "@/content/types";

// The shell of one page: skip link, header, `main#main`, footer. Each route
// segment renders it from its own `layout.tsx` with its page id, so the
// current nav link is right in the exported HTML (no client code). The root
// layout owns `<body>`, so the page id sits on this wrapper as `data-page`.
// `skip` replaces the default skip link ("Aller au contenu" to `#main`); only
// the host page uses it, to jump to its form. Without a page id (the 404 page)
// no nav link is current and the wrapper carries no `data-page`.
export function PageFrame({
  page,
  skip,
  className,
  children,
}: {
  page?: PageId;
  skip?: { href: string; label: string };
  /** For a font variable class: it must sit on an ancestor of the text. */
  className?: string;
  children: ReactNode;
}) {
  const site = loadSite();
  return (
    <div data-page={page} className={className}>
      <SkipLink href={skip?.href} label={skip?.label} />
      <SiteHeader site={site} page={page} />
      <main id="main">{children}</main>
      <SiteFooter site={site} />
    </div>
  );
}
