import type { ReactNode } from "react";
import { frenchSpacing } from "@/lib/french";
import { Lead } from "../Lead";
import { FaqList } from "../home/Faq";

// Spec: the "SponsorForm, SponsorLayout" entry in msca-design/COMPONENTS.md; port of
// `.sponsor-layout`. Two columns from `lg` (old 900px): the intro with the FAQ
// (0.9fr) and the white form panel (1.1fr), 72px under the offers. The panel
// stays white with ink text inside the dark section.

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
        <h3 className="text-[1.8rem]">{frenchSpacing(title)}</h3>
        <Lead tone="dark" className="text-[1.05rem]">
          {lead}
        </Lead>
        <FaqList id="sponsor-faq" tone="dark" items={faq} className="mt-7" />
      </div>
      <div
        id="sponsor-funnel"
        className="rounded-[20px] bg-card p-7 text-ink shadow-lift"
      >
        {children}
      </div>
    </div>
  );
}
