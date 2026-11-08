import type { Sticker } from "@/content/types";
import type { LogoTile } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { toRoute } from "@/lib/routes";
import { Button } from "../Button";
import { LogoWall } from "./LogoWall";
import { Section } from "../Section";
import { SectionFoot } from "../SectionFoot";
import { SectionHead } from "../SectionHead";

// Spec: the "LogoWall, LogoTile, LogoSticker" entry in msca-design/COMPONENTS.md.
// The #partenaires section of the former `index.html` (`git show 1353207:index.html`). The head and the sticker come from
// content/companies.json; the two buttons are literal copy of the former `index.html`.

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
      <SectionHead
        align="center"
        eyebrow={frenchSpacing(eyebrow)}
        title={frenchSpacing(title)}
        lead={frenchSpacing(lead)}
      />
      <LogoWall id="logo-wall" tiles={tiles} sticker={sticker} />
      <SectionFoot>
        <Button href={toRoute("accueillir.html")}>Rejoindre les hôtes</Button>
        <Button variant="ghost" href={toRoute("socrates.html#sponsoring")}>
          Soutenir SoCraTes Maroc
        </Button>
      </SectionFoot>
    </Section>
  );
}
