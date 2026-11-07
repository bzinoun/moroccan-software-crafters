import type { Offer } from "@/content/types";
import { tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { offerHref, offerPrice } from "@/lib/home-data";
import { Button } from "../Button";
import { Reveal } from "../Reveal";

// Spec: the "OfferGrid, OfferCard" entry in msca-design/COMPONENTS.md; port of
// `.offers` and `.offer` in assets/css/style.css and of the offers block of
// assets/js/home.js. Each card links to the host funnel with its own formule.

const cardStyles = tv({
  base: "relative flex flex-col rounded-card border-[1.5px] px-6.5 py-7",
  variants: {
    tone: {
      light: "border-line bg-card",
      dark: "border-white/16 bg-white/5 text-cream",
    },
    highlight: { true: "", false: "" },
  },
  compoundVariants: [
    { tone: "light", highlight: true, class: "border-green shadow-lift" },
    { tone: "dark", highlight: true, class: "border-sage" },
  ],
  defaultVariants: { tone: "light", highlight: false },
});

const flagStyles = tv({
  base: "absolute -top-3.25 left-6.5 rounded-full px-[11px] py-[5px] text-[0.74rem] font-bold tracking-[0.06em] uppercase",
  variants: {
    tone: {
      light: "bg-green text-white",
      dark: "bg-sage text-green-deep",
    },
  },
});

const priceStyles = tv({
  base: "mb-[0.6rem] font-display text-[1.5rem] font-semibold",
  variants: { tone: { light: "text-green", dark: "text-sage" } },
});

// Below lg the cards are one column, so the tagline needs no reserved height.
const taglineStyles = tv({
  base: "text-[0.95rem] lg:min-h-[3em]",
  variants: { tone: { light: "text-ink-soft", dark: "text-on-dark-muted" } },
});

const subheadStyles = tv({
  base: "mt-[1.1rem] mb-2 font-body text-[0.78rem] tracking-[0.08em] uppercase",
  variants: { tone: { light: "text-muted", dark: "text-on-dark-muted" } },
});

// The highlighted offer is the solid button; on a dark card it loses its glow.
function offerButtonVariant(tone: "light" | "dark", highlight: boolean) {
  if (highlight) return tone === "dark" ? "primary-flat" : "primary";
  return tone === "dark" ? "ghost-on-dark" : "ghost";
}

// A 10px square with soft corners, the green post-it by default, the yellow one for the
// "you bring" list. The last list leaves room for the button.
const BULLET_BASE =
  "relative pl-6 before:absolute before:top-[0.45em] before:left-0 before:size-[10px] before:rounded-[3px] before:border-[1.5px]";
const BULLET_GET = `${BULLET_BASE} before:border-green before:bg-postit-green`;
const BULLET_GIVE = `${BULLET_BASE} before:border-[#c9a400] before:bg-postit-yellow`;

const LIST = "m-0 grid list-none gap-[0.45rem] p-0 text-[0.93rem]";
const LIST_LAST =
  "mx-0 mt-0 mb-[1.6rem] grid list-none gap-[0.45rem] p-0 text-[0.93rem]";

type OfferGridProps = {
  /** `loadOffers().items`. */
  items: Offer[];
  /** `dark` for a grid inside a dark `Section`. */
  tone?: "light" | "dark";
};

export function OfferGrid({ items, tone = "light" }: OfferGridProps) {
  return (
    <div className="mx-auto grid max-w-[560px] items-stretch gap-5.5 lg:max-w-none lg:grid-cols-3">
      {items.map((offer) => {
        const highlight = offer.highlight === true;
        return (
          <Reveal
            as="article"
            key={offer.id}
            className={cardStyles({ tone, highlight })}
          >
            {offer.badge ? (
              <span className={flagStyles({ tone })}>
                {frenchSpacing(offer.badge)}
              </span>
            ) : null}
            <h3
              className={
                tone === "dark" ? "mb-[0.2rem] text-white" : "mb-[0.2rem]"
              }
            >
              {frenchSpacing(offer.name)}
            </h3>
            <div className={priceStyles({ tone })}>
              {frenchSpacing(offerPrice(offer))}
            </div>
            <p className={taglineStyles({ tone })}>
              {frenchSpacing(offer.tagline)}
            </p>
            <h4 className={subheadStyles({ tone })}>Vous apportez</h4>
            <ul role="list" className={LIST}>
              {offer.youProvide.map((text) => (
                <li key={text} className={BULLET_GIVE}>
                  {frenchSpacing(text)}
                </li>
              ))}
            </ul>
            <h4 className={subheadStyles({ tone })}>Nous apportons</h4>
            <ul role="list" className={LIST_LAST}>
              {offer.weProvide.map((text) => (
                <li key={text} className={BULLET_GET}>
                  {frenchSpacing(text)}
                </li>
              ))}
            </ul>
            <Button
              href={offerHref(offer)}
              variant={offerButtonVariant(tone, highlight)}
              className="mt-auto self-start"
            >
              Choisir cette formule
            </Button>
          </Reveal>
        );
      })}
    </div>
  );
}
