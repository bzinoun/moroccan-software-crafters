import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { Photo } from "../Photo";

// Spec: the "HomeHero, Polaroid" entry in msca-design/COMPONENTS.md.
// A white-framed photo (10px at the sides and top, 34px at the bottom for the
// handwritten caption) inside the hero collage. The photo is decorative.
// The index picks the slot: width, height, offset, tilt and layer. Heights and
// the second width are smaller below `lg`.
const SLOT = [
  "top-0 left-[2%] z-2 h-52.5 w-3/5 -rotate-3 lg:h-65",
  "top-30 right-0 z-4 h-45 w-1/2 rotate-4 lg:h-60 lg:w-[54%]",
  "bottom-0 left-0 z-3 h-40 w-1/2 -rotate-[1.5deg] lg:h-52.5",
] as const;

/** How many photos of a collage have a slot. */
export const POLAROID_SLOTS = SLOT.length;

type PolaroidProps = {
  /** Position in the collage, from 0. The first three have their own slot. */
  index: number;
  src: string;
  caption: string;
};

export function Polaroid({ index, src, caption }: PolaroidProps) {
  return (
    <figure
      className={cn(
        "absolute rounded-[3px] bg-white px-2.5 pt-2.5 pb-8.5 shadow-lift",
        SLOT[index],
      )}
    >
      <Photo eager src={src} alt="" className="size-full object-cover" />
      <figcaption className="absolute right-3 bottom-1.5 left-3 overflow-hidden font-hand text-s115 text-ellipsis whitespace-nowrap text-ink-soft">
        {frenchSpacing(caption)}
      </figcaption>
    </figure>
  );
}
