import type { Metadata } from "next";
import { loadHome, loadSite } from "@/content/load";
import { pageMetadata } from "@/lib/page-metadata";
import { DEFAULT_SOCIAL_PHOTO } from "@/lib/pages-data";
import { assetUrl } from "@/lib/routes";
import { fonts } from "./fonts";
import "./globals.css";
import { JS_CLASS_SCRIPT } from "./js-class-script";

const site = loadSite();
const home = loadHome();

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/",
    title: home.meta.title,
    description: home.meta.description,
    photo: home.hero.collage[0]?.photo ?? DEFAULT_SOCIAL_PHOTO,
  }),
  metadataBase: new URL(site.baseUrl),
  icons: {
    // Metadata URLs do not get the base path from Next, so add it here.
    icon: assetUrl("/assets/img/favicon.png"),
    apple: assetUrl("/assets/img/apple-touch-icon.png"),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fonts.fraunces.variable} ${fonts.inter.variable} ${fonts.caveat.variable}`}
      // The script in the head adds the `js` class before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_CLASS_SCRIPT }} />
      </head>
      {/* The shell (skip link, header, main, footer) comes from each route
          segment layout through PageFrame, which knows the page id. */}
      <body>{children}</body>
    </html>
  );
}
