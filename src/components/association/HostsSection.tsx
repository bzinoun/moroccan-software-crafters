import type { Sticker } from "@/content/types";
import type { LogoTile } from "@/lib/derive";
import { LogoWall } from "../home/LogoWall";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";

// Spec: the "PartnersSection, LogoWall, LogoTile, LogoSticker, LogoImage, Monogram" entry in
// msca-design/COMPONENTS.md (compact wall). The #entreprises section: a
// centered head without lead, then the compact wall of every company and the
// host sticker. The tiles come from `hostsWall()`.

type HostsSectionProps = {
  /** `loadCompanies().eyebrow`. */
  eyebrow: string;
  /** `loadCompanies().title`. */
  title: string;
  /** `hostsWall(companies, events).tiles`. */
  tiles: LogoTile[];
  /** `hostsWall(companies, events).sticker`. */
  sticker: Sticker;
};

const TITLE_ID = "hosts-title";

export function HostsSection({
  eyebrow,
  title,
  tiles,
  sticker,
}: HostsSectionProps) {
  return (
    <Section id="entreprises" variant="alt" aria-labelledby={TITLE_ID}>
      <SectionHead
        align="center"
        eyebrow={eyebrow}
        title={title}
        titleId={TITLE_ID}
      />
      <LogoWall compact tiles={tiles} sticker={sticker} />
    </Section>
  );
}
