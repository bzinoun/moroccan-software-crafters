import type { Offer } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";
import { OfferGrid } from "./OfferGrid";

// Spec: the "OfferGrid, OffersSection" entry in msca-design/COMPONENTS.md.
// The #offres section: a centered head, the offer cards and the pricing note,
// all from content/offers.json. No offer, no section.

type OffersSectionProps = {
  eyebrow: string;
  title: string;
  lead: string;
  note: string;
  /** `loadOffers().items`. */
  items: Offer[];
};

export function OffersSection({
  eyebrow,
  title,
  lead,
  note,
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
      <p className="mt-7 text-center text-s92 text-muted">
        {frenchSpacing(note)}
      </p>
    </Section>
  );
}
