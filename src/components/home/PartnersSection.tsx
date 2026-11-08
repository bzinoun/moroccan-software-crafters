import type { Sticker } from "@/content/types";
import type { LogoTile } from "@/lib/derive";
import { Button } from "../Button";
import { LogoWall } from "./LogoWall";
import { Section } from "../Section";
import { SectionFoot } from "../SectionFoot";
import { SectionHead } from "../SectionHead";

// Spec: the "LogoWall, LogoTile, LogoSticker" entry in msca-design/COMPONENTS.md.
// The #partenaires section. The head and the sticker come from
// content/companies.json; the two buttons carry literal copy.

type PartnersSectionProps = {
  eyebrow: string;
  title: string;
  lead: string;
  /** `logoWallTiles(companies.items, events)`. */
  tiles: LogoTile[];
  /** `companies.sticker.host`. */
  sticker: Sticker;
};

export function PartnersSection({
  eyebrow,
  title,
  lead,
  tiles,
  sticker,
}: PartnersSectionProps) {
  return (
    <Section variant="alt" id="partenaires">
      <SectionHead align="center" eyebrow={eyebrow} title={title} lead={lead} />
      <LogoWall tiles={tiles} sticker={sticker} />
      <SectionFoot>
        <Button href="/accueillir/">Rejoindre les hôtes</Button>
        <Button variant="ghost" href="/socrates/#sponsoring">
          Soutenir SoCraTes Maroc
        </Button>
      </SectionFoot>
    </Section>
  );
}
