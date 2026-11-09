import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageLink } from "@/components/PageLink";
import { Section } from "@/components/Section";
import { loadSite } from "@/content/load";
import { frenchSpacing } from "@/lib/french";
import { PageFrame } from "../PageFrame";

// Where /api/leads sends a visitor whose form posted without script and did
// not go through (a missing field, no consent, or the storage failed).
export const metadata: Metadata = {
  title: "Demande non envoyée · Moroccan Software Crafters",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
  robots: { index: false, follow: false },
};

export default function EnvoiImpossible() {
  const linkedin = loadSite().links.linkedin;
  return (
    <PageFrame>
      <Section>
        <h1 className="font-display text-ink">
          {frenchSpacing("Votre demande n'est pas partie.")}
        </h1>
        <p className="mt-4 text-ink-soft">
          {frenchSpacing(
            "Un champ obligatoire manque (entreprise, nom, e-mail valide, accord pour être recontacté), ou l'envoi a échoué. Revenez en arrière : vos réponses sont encore dans le formulaire.",
          )}
        </p>
        <p className="mt-3 mb-8 text-ink-soft">
          {frenchSpacing("Vous pouvez aussi nous écrire sur")}{" "}
          <PageLink href={linkedin}>LinkedIn</PageLink>.
        </p>
        <Button href="/">{frenchSpacing("Retour à l'accueil")}</Button>
      </Section>
    </PageFrame>
  );
}
