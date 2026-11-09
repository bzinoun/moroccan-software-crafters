import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { frenchSpacing } from "@/lib/french";
import { PageFrame } from "../PageFrame";

// Where /api/leads sends a visitor whose form posted without script.
// Visitors with script see the success panel in the form instead.
export const metadata: Metadata = {
  title: "Demande reçue · Moroccan Software Crafters",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
  robots: { index: false, follow: false },
};

export default function Merci() {
  return (
    <PageFrame>
      <Section>
        <h1 className="font-display text-ink">
          {frenchSpacing("Merci, demande bien reçue.")}
        </h1>
        <p className="mt-4 mb-8 text-ink-soft">
          {frenchSpacing(
            "L'équipe revient vers vous sous 48 heures, par le moyen de contact que vous avez choisi.",
          )}
        </p>
        <Button href="/">{frenchSpacing("Retour à l'accueil")}</Button>
      </Section>
    </PageFrame>
  );
}
