import type { Offer } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";
import { OfferGrid } from "./OfferGrid";

// Spec: the "OfferGrid, OfferCard" entry in msca-design/COMPONENTS.md.
// The #offres section of index.html: a centered head, the offer cards and the
// pricing note, all from content/offers.json.

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
  return (
    <Section id="offres" aria-labelledby="offres-title">
      <SectionHead
        align="center"
        eyebrow={frenchSpacing(eyebrow)}
        title={frenchSpacing(title)}
        lead={frenchSpacing(lead)}
        titleId="offres-title"
      />
      <OfferGrid items={items} />
      <p className="mt-7 text-center text-[0.92rem] text-muted">
        {frenchSpacing(note)}
      </p>
    </Section>
  );
}
