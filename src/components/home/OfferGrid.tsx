import type { Offer } from "@/content/types";
import { tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { offerHref } from "@/lib/home-data";
import { Button } from "../Button";
import { Reveal } from "../Reveal";

// Spec: the "OfferGrid, OffersSection" entry in msca-design/COMPONENTS.md.
// Each card links to the host funnel with its own formule.

type Tone = "light" | "dark";

// The highlighted card sets `data-highlighted`; its edge color depends on the tone.
const cardStyles = tv({
  base: "relative flex flex-col rounded-card border-[1.5px] px-6.5 py-7",
  variants: {
    tone: {
      light:
        "border-line bg-white data-highlighted:border-green data-highlighted:shadow-lift",
      dark: "border-white/16 bg-white/5 text-cream data-highlighted:border-sage",
    },
  },
});

const textStyles = tv({
  slots: {
    title: "mb-[0.2rem]",
    flag: "absolute -top-3.25 left-6.5 rounded-full px-2.75 py-1.25 text-s74 font-bold tracking-[0.06em] uppercase",
    // Below lg the cards are one column, so the tagline needs no reserved height.
    tagline: "text-s95 lg:min-h-[3em]",
    subhead: "mt-[1.1rem] mb-2 font-body text-s78 tracking-[0.08em] uppercase",
  },
  variants: {
    tone: {
      light: {
        flag: "bg-green text-white",
        tagline: "text-ink-soft",
        subhead: "text-muted",
      },
      dark: {
        title: "text-white",
        flag: "bg-sage text-green-deep",
        tagline: "text-on-dark-muted",
        subhead: "text-on-dark-muted",
      },
    },
  },
});

// A 10px square with soft corners: the green post-it for what we bring, the
// yellow one for what the company brings.
const bulletStyles = tv({
  base: "relative pl-6 before:absolute before:top-[0.45em] before:left-0 before:size-2.5 before:rounded-[3px] before:border-[1.5px] before:content-['']",
  variants: {
    kind: {
      get: "before:border-green before:bg-postit-green",
      give: "before:border-[#c9a400] before:bg-postit-yellow",
    },
  },
});

// The last list leaves room for the button.
const listStyles = tv({
  base: "m-0 grid list-none gap-[0.45rem] p-0 text-s93",
  variants: { last: { true: "mb-[1.6rem]" } },
});

// The highlighted offer is the solid button; on a dark card it loses its glow.
function offerButtonVariant(tone: Tone, highlight: boolean) {
  if (highlight) return tone === "dark" ? "primary-flat" : "primary";
  return tone === "dark" ? "ghost-on-dark" : "ghost";
}

function BulletList({
  texts,
  kind,
  last = false,
}: {
  texts: string[];
  kind: "get" | "give";
  last?: boolean;
}) {
  return (
    <ul role="list" className={listStyles({ last })}>
      {texts.map((text, index) => (
        <li key={`${index}-${text}`} className={bulletStyles({ kind })}>
          {frenchSpacing(text)}
        </li>
      ))}
    </ul>
  );
}

function OfferCard({ offer, tone }: { offer: Offer; tone: Tone }) {
  const highlight = offer.highlight === true;
  const text = textStyles({ tone });
  return (
    <Reveal
      as="article"
      className={cardStyles({ tone })}
      data-highlighted={highlight ? "" : undefined}
    >
      {offer.badge ? (
        <span className={text.flag()}>{frenchSpacing(offer.badge)}</span>
      ) : null}
      <h3 className={text.title()}>{frenchSpacing(offer.name)}</h3>
      <p className={text.tagline()}>{frenchSpacing(offer.tagline)}</p>
      <h4 className={text.subhead()}>Vous apportez</h4>
      <BulletList texts={offer.youProvide} kind="give" />
      <h4 className={text.subhead()}>Nous apportons</h4>
      <BulletList texts={offer.weProvide} kind="get" last />
      <Button
        href={offerHref(offer)}
        variant={offerButtonVariant(tone, highlight)}
        className="mt-auto self-start"
      >
        Choisir cette formule
        {/* The same label repeats on every card: the offer names it. */}
        <span className="sr-only">{frenchSpacing(`, ${offer.name}`)}</span>
      </Button>
    </Reveal>
  );
}

type OfferGridProps = {
  /** `loadOffers().items`. */
  items: Offer[];
  /** `dark` for the set of offers inside a dark `Section`. */
  tone?: Tone;
};

export function OfferGrid({ items, tone = "light" }: OfferGridProps) {
  if (items.length === 0) return null;
  return (
    <div className="mx-auto grid max-w-140 items-stretch gap-5.5 lg:max-w-none lg:grid-cols-3">
      {items.map((offer) => (
        <OfferCard key={offer.id} offer={offer} tone={tone} />
      ))}
    </div>
  );
}
