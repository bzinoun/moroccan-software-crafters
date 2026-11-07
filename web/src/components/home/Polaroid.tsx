import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "HomeHero, PolaroidCollage, Polaroid" entry in msca-design/COMPONENTS.md.
// A white-framed photo (10px at the sides and top, 34px at the bottom for the
// handwritten caption) inside the hero collage. The photo is decorative.
// The index picks the slot of the old p1, p2 and p3 rules: width, height,
// offset, tilt and layer. Heights and the second width are smaller below `lg`
// (the old 900px query).
const SLOT = [
  "top-0 left-[2%] z-2 h-[210px] w-3/5 -rotate-3 lg:h-[260px]",
  "top-[120px] right-0 z-4 h-[180px] w-1/2 rotate-4 lg:h-[240px] lg:w-[54%]",
  "bottom-0 left-0 z-3 h-[160px] w-1/2 -rotate-[1.5deg] lg:h-[210px]",
] as const;

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
        "absolute rounded-[3px] bg-white px-2.5 pt-2.5 pb-[34px] shadow-lift",
        SLOT[index],
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- exported site, images are unoptimized */}
      <img src={src} alt="" className="size-full object-cover" />
      <figcaption className="absolute right-3 bottom-1.5 left-3 overflow-hidden font-hand text-[1.15rem] text-ellipsis whitespace-nowrap text-ink-soft">
        {frenchSpacing(caption)}
      </figcaption>
    </figure>
  );
}
