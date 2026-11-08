import { frenchSpacing } from "@/lib/french";
import type { EditionCard as EditionCardData } from "@/lib/pages-data";
import { Reveal } from "../Reveal";
import { Photo } from "../Photo";

// Spec: the "EditionGrid, EditionCard" entry in msca-design/COMPONENTS.md.
// One column, two from `sm`, four from `lg`.

// The cover without a photo: the sage zellige tile (`--zellige-sage` in
// globals.css) over deep green, a radial vignette on top.
const COVER_ART = {
  backgroundImage:
    "radial-gradient(circle, var(--color-green-deep) 0 34%, transparent 70%), var(--zellige-sage)",
  backgroundPosition: "center",
  backgroundSize: "auto, 32px",
} as const;

/** The year in a double khatam star: green star, cream edge, a sage inner line. */
function YearStar({ year }: { year: string }) {
  return (
    <span className="relative grid aspect-square w-[62%] max-w-[200px] place-items-center pt-[0.1em] font-display text-[clamp(2rem,3.2vw,2.6rem)] font-semibold text-cream">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
      >
        <polygon
          points="50 2 64.1 16.1 83.9 16.1 83.9 35.9 98 50 83.9 64.1 83.9 83.9 64.1 83.9 50 98 35.9 83.9 16.1 83.9 16.1 64.1 2 50 16.1 35.9 16.1 16.1 35.9 16.1"
          className="fill-green stroke-cream"
          strokeWidth="1.5"
        />
        <polygon
          points="50 12 61.1 23.1 76.9 23.1 76.9 38.9 88 50 76.9 61.1 76.9 76.9 61.1 76.9 50 88 38.9 76.9 23.1 76.9 23.1 61.1 12 50 23.1 38.9 23.1 23.1 38.9 23.1"
          className="fill-none stroke-sage"
          strokeWidth="1"
        />
      </svg>
      <span className="relative">{year}</span>
    </span>
  );
}

export function EditionCard({ edition }: { edition: EditionCardData }) {
  return (
    <Reveal
      as="article"
      className="flex flex-col overflow-hidden rounded-card border border-line bg-white"
    >
      <div
        className="relative grid aspect-4/3 place-items-center overflow-hidden bg-green-deep"
        style={edition.photoSrc ? undefined : COVER_ART}
      >
        {edition.photoSrc ? (
          <Photo
            src={edition.photoSrc}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <YearStar year={edition.year} />
        )}
        <span className="absolute top-3 left-3 -rotate-4 bg-postit-yellow px-3 py-1 font-hand text-s130 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
          {frenchSpacing(edition.edition)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-5 pt-4.5 pb-5">
        <h3 className="m-0 text-s115">{frenchSpacing(edition.title)}</h3>
        <span className="min-h-[3.2em] text-s88 text-muted">
          {frenchSpacing(edition.where)}
        </span>
        <div className="mt-1.5 mb-1 flex gap-4">
          <div>
            <b className="block font-display text-s140 leading-none font-bold text-green">
              {edition.participants}
            </b>
            <span className="text-s76 text-muted">crafters</span>
          </div>
          <div>
            <b className="block font-display text-s140 leading-none font-bold text-green">
              {edition.partners}
            </b>
            <span className="text-s76 text-muted">partenaires</span>
          </div>
        </div>
        <p className="m-0 text-s92 text-ink-soft">
          {frenchSpacing(edition.text)}
        </p>
      </div>
    </Reveal>
  );
}

type EditionGridProps = {
  /** `socratesEditionCards(loadSocrates())`, oldest first. */
  editions: readonly EditionCardData[];
};

export function EditionGrid({ editions }: EditionGridProps) {
  if (editions.length === 0) return null;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {editions.map((edition) => (
        <EditionCard
          key={`${edition.year}-${edition.edition}`}
          edition={edition}
        />
      ))}
    </div>
  );
}
