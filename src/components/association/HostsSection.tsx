import type { Sticker } from "@/content/types";
import type { LogoTile } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { LogoWall } from "../home/LogoWall";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";

// Spec: the "LogoWall, LogoTile, LogoSticker, Monogram" entry in
// msca-design/COMPONENTS.md (compact wall). The #entreprises section of
// former `association.html` (`git show 1353207:association.html`): a centered head without lead, then the compact wall of
// every company and the host sticker. The tiles come from `hostsWall()`.

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

export function HostsSection({
  eyebrow,
  title,
  tiles,
  sticker,
}: HostsSectionProps) {
  return (
    <Section id="entreprises" variant="alt">
      <SectionHead
        align="center"
        eyebrow={frenchSpacing(eyebrow)}
        title={frenchSpacing(title)}
      />
      <LogoWall id="logo-wall" compact tiles={tiles} sticker={sticker} />
    </Section>
  );
}
