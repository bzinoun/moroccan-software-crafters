import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Lead } from "@/components/Lead";
import { fmtDate } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { Photo } from "../Photo";

// Spec: the "HostLayout (HostHero, ProcessSteps, ProofCard)" entry in
// msca-design/COMPONENTS.md; port of `.host-hero`, `.host-layout`, `.host-aside`,
// `.steps` and `.proof`.

type HostHeroProps = { eyebrow: string; title: string; lead: string };

/** The page opening: eyebrow, level 1 title and lead, with the zellige corner. */
export function HostHero({ eyebrow, title, lead }: HostHeroProps) {
  return (
    <section className="zellige-corner pt-14 pb-6">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{frenchSpacing(title)}</h1>
        <Lead>{lead}</Lead>
      </Container>
    </section>
  );
}

export type ProcessStep = { title: string; text: string };

/** What happens after the request: numbered steps with a green round digit. */
export function ProcessSteps({ steps }: { steps: readonly ProcessStep[] }) {
  return (
    <ol role="list" className="my-7 grid list-none gap-[18px] p-0">
      {steps.map((step, index) => (
        <li key={step.title} className="grid grid-cols-[38px_1fr] gap-3.5">
          <b
            aria-hidden="true"
            className="grid size-[38px] place-items-center rounded-full bg-green font-display font-bold text-white"
          >
            {index + 1}
          </b>
          <div>
            <strong className="block">{frenchSpacing(step.title)}</strong>
            <span className="text-[0.93rem] text-ink-soft">
              {frenchSpacing(step.text)}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export type ProofEdition = {
  host?: string;
  /** "YYYY-MM-DD". */
  date: string;
  registrations?: number;
};

// The text of the former `accueillir.html` (`git show 1353207:accueillir.html`) before the script rewrites it from the events.
const FALLBACK_PROOF = "Société Générale GSCM, 24 octobre 2026, 110 inscrits.";

type ProofCardProps = {
  /** Final URL of the photo. */
  src: string;
  alt: string;
  /** The latest meetup of `events.json`, or null to keep the text of the prerendered page. */
  edition: ProofEdition | null;
};

/** The photo of the last meetup with one sentence about it. */
export function ProofCard({ src, alt, edition }: ProofCardProps) {
  const detail = edition
    ? `${[edition.host, fmtDate(edition.date, { long: true })]
        .filter(Boolean)
        .join(", ")}${
        edition.registrations ? `, ${edition.registrations} inscrits` : ""
      }.`
    : FALLBACK_PROOF;
  return (
    <div className="flex items-center gap-3.5 rounded-card border border-line bg-white p-3.5">
      <Photo
        src={src}
        alt={alt}
        width={92}
        height={70}
        className="h-[70px] w-[92px] rounded-sm object-cover"
      />
      <p id="proof-text" className="m-0 text-[0.9rem] text-ink-soft">
        <strong>{frenchSpacing("Dernière édition :")}</strong>{" "}
        {frenchSpacing(detail)}
      </p>
    </div>
  );
}

type HostLayoutProps = {
  /** The left column: the steps, the proof card, the link to the meetup page. */
  aside: ReactNode;
  /** The funnel. */
  children: ReactNode;
};

/** Two columns from `lg` (aside pinned at 100px), stacked below. */
export function HostLayout({ aside, children }: HostLayoutProps) {
  return (
    <Container className="grid items-start gap-12 pb-22 lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="lg:sticky lg:top-[100px]">{aside}</aside>
      {children}
    </Container>
  );
}
