import type { ComponentPropsWithoutRef } from "react";
import type { Cta } from "@/content/types";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import type { SocratesEdition, TrustLogo } from "@/lib/home-data";
import { Button } from "../Button";
import { Eyebrow } from "../Eyebrow";
import { HeroEm } from "../HeroEm";
import { Lead } from "../Lead";
import { Section } from "../Section";
import { LogoRow } from "./LogoRow";
import { Photo } from "../Photo";

// Spec: the "SocratesTeaser, EditionChips, SponsorCall" entry in msca-design/COMPONENTS.md.
// The #socrates section. Texts come from content/home.json (`home.socrates`),
// the chips from `socratesEditions()`, the logos from `trustLogos()`. Both
// eyebrows carry the khatam star.

// Not in home.json: the accessible name of the trusted logos.
const TRUST_LABEL = "Partenaires présents à chaque édition";

type EditionChipsProps = Omit<ComponentPropsWithoutRef<"ul">, "children"> & {
  /** `socratesEditions(events)`, oldest first. */
  editions: SocratesEdition[];
};

/** Two columns of translucent chips: "2022 · Marrakech", "1re édition · 30 crafters". */
export function EditionChips({
  editions,
  className,
  ...props
}: EditionChipsProps) {
  if (editions.length === 0) return null;
  return (
    <ul
      role="list"
      className={cn("mt-6 mb-8 grid grid-cols-2 gap-3", className)}
      {...props}
    >
      {editions.map((edition) => (
        <li
          key={edition.id}
          className="rounded-sm border border-white/16 px-3.5 py-3"
        >
          <b className="block font-display text-[1.1rem] font-semibold text-white">
            {frenchSpacing(edition.title)}
          </b>
          <span className="text-s85 text-on-dark">
            {frenchSpacing(edition.detail)}
          </span>
        </li>
      ))}
    </ul>
  );
}

type SponsorCallProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  /** `home.socrates.sponsor`. */
  sponsor: {
    eyebrow: string;
    title: string;
    text: string;
    cta: Cta;
  };
  /** `trustLogos(loadSponsoring(), loadCompanies().items)`. */
  trust: TrustLogo[];
};

/** The sage tinted box with the partner call, the trusted logos and a ghost button. */
export function SponsorCall({
  sponsor,
  trust,
  className,
  ...props
}: SponsorCallProps) {
  return (
    <div
      className={cn(
        "mt-7 rounded-card border border-sage/35 bg-sage/10 px-6.5 py-6",
        className,
      )}
      {...props}
    >
      <Eyebrow tone="dark" marker="khatam" className="mb-2 text-s98">
        {sponsor.eyebrow}
      </Eyebrow>
      <h3 className="mb-[0.4rem] text-s140">{frenchSpacing(sponsor.title)}</h3>
      <p className="text-s98 text-on-dark">{frenchSpacing(sponsor.text)}</p>
      <LogoRow
        logos={trust}
        aria-label={TRUST_LABEL}
        className="mt-3.5 mb-4.5"
      />
      <Button variant="ghost-on-dark" href={sponsor.cta.href}>
        {frenchSpacing(sponsor.cta.label)}
      </Button>
    </div>
  );
}

type SocratesTeaserProps = {
  /** `home.socrates.eyebrow`. */
  eyebrow: string;
  /** `home.socrates.title`; may hold one `<em>` word. */
  title: string;
  /** `home.socrates.lead`. */
  lead: string;
  /** `home.socrates.cta`. */
  cta: Cta;
  /** `socratesEditions(loadEvents())`. */
  editions: SocratesEdition[];
  /** `socratesPhoto(home)`: the final URL of the group photo. */
  photoSrc: string;
  /** `home.socrates.sponsor`. */
  sponsor: SponsorCallProps["sponsor"];
  /** `trustLogos(loadSponsoring(), loadCompanies().items)`. */
  trust: TrustLogo[];
};

export function SocratesTeaser({
  eyebrow,
  title,
  lead,
  cta,
  editions,
  photoSrc,
  sponsor,
  trust,
}: SocratesTeaserProps) {
  return (
    <Section
      variant="dark"
      id="socrates"
      aria-labelledby="socrates-title"
      containerClassName="grid items-center gap-14 md:grid-cols-[1.05fr_0.95fr]"
    >
      <div>
        <Eyebrow tone="dark" marker="khatam">
          {eyebrow}
        </Eyebrow>
        <h2 id="socrates-title">
          <HeroEm text={title} />
        </h2>
        <Lead tone="dark">{lead}</Lead>
        <EditionChips editions={editions} />
        <Button href={cta.href} variant="primary-flat">
          {frenchSpacing(cta.label)}
        </Button>
        <SponsorCall sponsor={sponsor} trust={trust} />
      </div>
      {/* The alt text is not in home.json. */}
      <Photo
        src={photoSrc}
        alt="Photo de groupe des participants de SoCraTes Maroc 2022 à Marrakech"
        width={1600}
        height={1200}
        className="aspect-4/3 w-full rounded-card object-cover object-[center_75%] shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
      />
    </Section>
  );
}
