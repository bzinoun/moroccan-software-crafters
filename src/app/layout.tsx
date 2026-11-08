import type { Metadata } from "next";
import { loadHome, loadSite } from "@/content/load";
import { assetUrl } from "@/lib/routes";
import { fonts } from "./fonts";
import "./globals.css";

const site = loadSite();
const home = loadHome();

// Social tags need absolute URLs. `site.baseUrl` already carries the GitHub
// Pages base path, so build them from it: `assetUrl` would add the path twice.
const sharePhoto = home.hero.collage[0]?.photo;
const shareImages = sharePhoto
  ? [`${site.baseUrl}/assets/img/meetups/${sharePhoto}.jpg`]
  : [];

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: home.meta.title,
  description: home.meta.description,
  openGraph: {
    type: "website",
    title: home.meta.title,
    description: home.meta.description,
    url: `${site.baseUrl}/`,
    images: shareImages,
  },
  twitter: {
    card: "summary_large_image",
  },
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
    >
      {/* The shell (skip link, header, main, footer) comes from each route
          segment layout through PageFrame, which knows the page id. */}
      <body>{children}</body>
    </html>
  );
}
