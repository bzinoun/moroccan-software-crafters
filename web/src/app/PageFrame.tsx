import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { loadSite } from "@/content/load";
import type { PageId } from "@/content/types";

// The shell of one page: skip link, header, `main#main`, footer. Each route
// segment renders it from its own `layout.tsx` with its page id, so the
// current nav link is right in the static HTML (no client code). The old site
// set `<body data-page>`; the root layout owns `<body>` here, so the id sits
// on this wrapper instead. Without a page id (the 404 page) no nav link is
// current and the wrapper carries no `data-page`.
export function PageFrame({
  page,
  children,
}: {
  page?: PageId;
  children: ReactNode;
}) {
  const site = loadSite();
  return (
    <div data-page={page}>
      <SkipLink />
      <SiteHeader site={site} page={page} />
      <main id="main">{children}</main>
      <SiteFooter site={site} />
    </div>
  );
}
