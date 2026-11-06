import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { loadHome, loadSite } from "@/content/load";
import type { PageId } from "@/content/types";
import { fonts } from "./fonts";
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
    <html
      lang="fr"
      className={`${fonts.fraunces.variable} ${fonts.inter.variable} ${fonts.caveat.variable}`}
    >
      <body data-page={page}>
        <SkipLink />
        <SiteHeader site={site} page={page} />
        <main id="main">{children}</main>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}
