import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { loadHome, loadSite } from "@/content/load";
import type { PageId } from "@/content/types";
import "./globals.css";

const site = loadSite();
const home = loadHome();

// TODO: set the page id per route (meetup, socrates, news, association, host)
// once those pages exist. Two CSS selectors depend on `<body data-page>`.
const page: PageId = "home";

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: home.meta.title,
  description: home.meta.description,
  icons: {
    icon: "/assets/img/favicon.png",
    apple: "/assets/img/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Same font request as the static site, so globals.css matches. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- faithful port of index.html */}
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body data-page={page}>
        <SkipLink />
        <SiteHeader site={site} page={page} />
        <main id="main">{children}</main>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}
