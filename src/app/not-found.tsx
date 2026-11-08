import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { frenchSpacing } from "@/lib/french";
import { PageFrame } from "./PageFrame";

// Rendered into `404.html` by the static export. It sits inside the root
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
