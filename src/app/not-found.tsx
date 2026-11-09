import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { frenchSpacing } from "@/lib/french";
import { PageFrame } from "./PageFrame";

// The root layout metadata describes the home page. The 404 page needs its own
// title, no canonical or social URL that points to the home page, and no
// indexing.
export const metadata: Metadata = {
  title: "Page introuvable · Moroccan Software Crafters",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
  robots: { index: false, follow: false },
};

// Rendered into `404.html` by the site export. It sits inside the root
// layout, which has no shell, so the frame comes from here. No page id: no
// nav link is current.
export default function NotFound() {
  return (
    <PageFrame>
      <Section>
        <h1 className="font-display text-ink">
          {frenchSpacing("Page introuvable")}
        </h1>
        <p className="mt-4 mb-8 text-ink-soft">
          {frenchSpacing("Cette page n'existe pas ou a changé d'adresse.")}
        </p>
        <Button href="/">{frenchSpacing("Retour à l'accueil")}</Button>
      </Section>
    </PageFrame>
  );
}
