import { frenchSpacing } from "@/lib/french";
import { CardGrid, type CardItem } from "./CardGrid";
import { Section } from "./Section";
import { SectionHead } from "./SectionHead";

// Spec: the "CardGrid, Card" and "CardsSection" entries in msca-design/COMPONENTS.md.
// A head followed by a row of cards: #mission, #principes and #contribuer of
// association.html, #pour-qui, #proposer and #regles of meetup.html.
// Eyebrow and lead apply the French spacing themselves.

type CardsSectionProps = {
  id: string;
  /** `alt` for the sage background. */
  variant?: "plain" | "alt";
  /** Eyebrow marker; `khatam` for SoCraTes content. Default: the one of `SectionHead`. */
  marker?: "rule" | "khatam" | "none";
  eyebrow: string;
  title: string;
  /** Sentence under the title. */
  lead?: string;
  /** Id of the title. When set, the section is named by its title (a landmark). */
  titleId?: string;
  /** `loadAssociation().mission.items`, `loadMeetup().who.items`... */
  items: readonly CardItem[];
  columns: 2 | 3 | 4;
};

export function CardsSection({
  id,
  variant = "plain",
  marker,
  eyebrow,
  title,
  lead,
  titleId,
  items,
  columns,
}: CardsSectionProps) {
  return (
    <Section id={id} variant={variant} aria-labelledby={titleId}>
      <SectionHead
        marker={marker}
        eyebrow={eyebrow}
        title={frenchSpacing(title)}
        lead={lead}
        titleId={titleId}
      />
      <CardGrid items={items} columns={columns} />
    </Section>
  );
}
