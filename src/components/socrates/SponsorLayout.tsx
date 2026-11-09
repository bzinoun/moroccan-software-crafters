import type { ReactNode } from "react";
import { frenchSpacing } from "@/lib/french";
import { FormPanel } from "../FormPanel";
import { Lead } from "../Lead";
import { FaqList } from "../home/Faq";

// Spec: the "PackageGrid, ChooseLevelLink, SponsorLayout, SponsorForm, SponsoringSection" entry in msca-design/COMPONENTS.md.
// Two columns from `lg`: the intro with the FAQ (0.9fr) and the white form
// panel (1.1fr), 72px under the offers. The panel stays white with ink text
// inside the dark section.

type SponsorLayoutProps = {
  /** `loadSponsoring().form.title`. */
  title: string;
  /** `loadSponsoring().form.lead`. */
  lead: string;
  /** `loadSponsoring().faq`. */
  faq: { q: string; a: string }[];
  /** The form (and its thanks panel). */
  children: ReactNode;
};

export function SponsorLayout({
  title,
  lead,
  faq,
  children,
}: SponsorLayoutProps) {
  return (
    <div className="mt-18 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h3 className="text-s180">{frenchSpacing(title)}</h3>
        <Lead tone="dark" className="text-s105">
          {lead}
        </Lead>
        <FaqList id="sponsor-faq" tone="dark" items={faq} className="mt-7" />
      </div>
      <FormPanel id="sponsor-funnel" spacing="snug">
        {children}
      </FormPanel>
    </div>
  );
}
