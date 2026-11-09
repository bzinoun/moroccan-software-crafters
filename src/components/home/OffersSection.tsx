import type { Offer } from "@/content/types";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";
import { OfferGrid } from "./OfferGrid";

// Spec: the "OfferGrid, OffersSection" entry in msca-design/COMPONENTS.md.
// The #offres section: a centered head, and the offer cards,
// all from content/offers.json. No offer, no section.

type OffersSectionProps = {
  eyebrow: string;
  title: string;
  lead: string;
  /** `loadOffers().items`. */
  items: Offer[];
};

export function OffersSection({
  eyebrow,
  title,
  lead,
  items,
}: OffersSectionProps) {
  if (items.length === 0) return null;
  return (
    <Section id="offres" aria-labelledby="offres-title">
      <SectionHead
        align="center"
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        titleId="offres-title"
      />
      <OfferGrid items={items} />
    </Section>
  );
}
