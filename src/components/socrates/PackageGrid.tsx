import { tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import type { PackageCard } from "@/lib/pages-data";
import { Reveal } from "../Reveal";
import { ChooseLevelLink } from "./ChooseLevelLink";

// Spec: port of `.offers` and `.offer` of the former `socrates.html` (`git show 1353207:socrates.html`), on the dark section.
// One column (560px wide, centered) below `lg` (old 960px), three columns from `lg`.
// Each button is a `ChooseLevelLink`: a link to `#sponsor-form` that also tells
// `SponsorForm` which package was chosen, so it checks the matching level.

const offerStyles = tv({
  base: "relative flex flex-col rounded-card border-[1.5px] bg-white/5 px-6.5 py-7 text-cream",
  variants: {
    highlight: {
      true: "border-sage",
      false: "border-white/16",
    },
  },
  defaultVariants: { highlight: false },
});

// Tick marker of the list: a small post-it green square with a green edge.
const ITEM =
  "relative pl-6 before:absolute before:top-[0.45em] before:left-0 before:size-2.5 before:rounded-[3px] before:border-[1.5px] before:border-green before:bg-postit-green before:content-['']";

function Offer({ pack }: { pack: PackageCard }) {
  return (
    <Reveal as="article" className={offerStyles({ highlight: pack.highlight })}>
      {pack.badge ? (
        <span className="absolute -top-[13px] left-6.5 rounded-full bg-sage px-[11px] py-[5px] text-[0.74rem] font-bold tracking-[0.06em] text-green-deep uppercase">
          {frenchSpacing(pack.badge)}
        </span>
      ) : null}
      <h3 className="mb-[0.2rem]">{frenchSpacing(pack.name)}</h3>
      <div className="mb-[0.6rem] font-display text-[1.5rem] font-semibold text-sage">
        {frenchSpacing(pack.price)}
      </div>
      {pack.limit ? (
        <p className="-mt-[0.4rem] mb-[0.6rem] text-[0.8rem] text-on-dark-muted">
          {frenchSpacing(pack.limit)}
        </p>
      ) : null}
      <p className="text-[0.95rem] text-on-dark-muted lg:min-h-[3em]">
        {frenchSpacing(pack.tagline)}
      </p>
      <h4 className="mt-[1.1rem] mb-2 font-body text-[0.78rem] tracking-[0.08em] text-on-dark-muted uppercase">
        Ce qui est inclus
      </h4>
      <ul
        role="list"
        className="m-0 mb-[1.6rem] grid list-none gap-[0.45rem] p-0 text-[0.93rem]"
      >
        {pack.includes.map((line) => (
          <li key={line} className={ITEM}>
            {frenchSpacing(line)}
          </li>
        ))}
      </ul>
      <ChooseLevelLink
        packageId={pack.id}
        variant={pack.highlight ? "primary-flat" : "ghost-on-dark"}
        className="mt-auto self-start"
      >
        Choisir ce niveau
      </ChooseLevelLink>
    </Reveal>
  );
}

type PackageGridProps = {
  /** `sponsorPackages(loadSponsoring())`. */
  packages: readonly PackageCard[];
};

export function PackageGrid({ packages }: PackageGridProps) {
  return (
    <div
      id="packages"
      className="mx-auto grid max-w-[560px] items-stretch gap-5.5 lg:max-w-none lg:grid-cols-3"
    >
      {packages.map((pack) => (
        <Offer key={pack.id} pack={pack} />
      ))}
    </div>
  );
}
