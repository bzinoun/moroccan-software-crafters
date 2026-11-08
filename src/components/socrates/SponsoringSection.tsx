import type { FormSite } from "@/lib/forms";
import { frenchSpacing } from "@/lib/french";
import type { TrustLogo } from "@/lib/home-data";
import type { PackageCard, SponsorLevel } from "@/lib/pages-data";
import type { Sponsoring } from "@/content/types";
import { Card, CardGrid } from "../CardGrid";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";
import { LogoRow } from "../home/LogoRow";
import { PackageGrid } from "./PackageGrid";
import { SponsorForm } from "./SponsorForm";
import { SponsorLayout } from "./SponsorLayout";

// The #sponsoring section of the former `socrates.html` (`git show 1353207:socrates.html`): the dark band with the arguments, the
// trusted partners, the three packages, the in-kind card, the note, and the
// form beside its FAQ. Texts come from content/sponsoring.json.

type SponsoringSectionProps = {
  /** `loadSponsoring()`. */
  sponsoring: Sponsoring;
  /** `trustLogos(sponsoring, loadCompanies().items)`. */
  trust: TrustLogo[];
  /** `sponsorPackages(sponsoring)`. */
  packages: readonly PackageCard[];
  /** `sponsorLevels(sponsoring)`. */
  levels: { options: readonly SponsorLevel[]; defaultValue: string };
  /** Package id to level value, from `levelForPackage()`. */
  packageLevels: Readonly<Record<string, string>>;
  /** The parts of `site.json` the form reads. */
  site: FormSite;
};

export function SponsoringSection({
  sponsoring: sp,
  trust,
  packages,
  levels,
  packageLevels,
  site,
}: SponsoringSectionProps) {
  return (
    <Section variant="dark" id="sponsoring" aria-labelledby="sponsoring-title">
      <SectionHead
        tone="dark"
        marker="khatam"
        eyebrow={sp.eyebrow}
        title={sp.title}
        lead={sp.lead}
        titleId="sponsoring-title"
      />
      <div id="arguments">
        <CardGrid items={sp.arguments} columns={2} tone="dark" />
      </div>
      <div className="mt-10 mb-14 rounded-card border border-sage/35 bg-sage/10 px-6.5 py-6">
        <h3 id="trust-title" className="mb-[0.4rem] text-[1.4rem]">
          {frenchSpacing(sp.trust.title)}
        </h3>
        <LogoRow
          id="trust-logos"
          logos={trust}
          aria-labelledby="trust-title"
          className="mt-3.5 mb-4.5"
        />
      </div>
      <PackageGrid packages={packages} />
      <div id="in-kind" className="mt-5.5">
        <Card tone="dark" title={sp.inKind.title} text={sp.inKind.text} />
      </div>
      <p className="mt-7 mb-0 text-center text-[0.92rem] text-on-dark-muted">
        {frenchSpacing(sp.note)}
      </p>
      <SponsorLayout title={sp.form.title} lead={sp.form.lead} faq={sp.faq}>
        <SponsorForm
          site={site}
          levels={levels}
          packageLevels={packageLevels}
          successText={sp.form.success}
        />
      </SponsorLayout>
    </Section>
  );
}
