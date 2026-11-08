import { frenchSpacing } from "@/lib/french";
import { Eyebrow } from "../Eyebrow";
import { Section } from "../Section";
import { NumberedList, type NumberedItem } from "./NumberedList";
import { Photo } from "../Photo";

// Spec: the "ZoomSplit, NumberedList" entry in msca-design/COMPONENTS.md; port
// of `.zoom`. A plain section holding a photo on the left (4/3, tilted
// back 1.5 degrees) and, on the right, an eyebrow, a title and a numbered list.
// The two columns start at `md` (the old site switched at 860px).

type ZoomSplitProps = {
  /** Anchor id of the section (`marketplace`). */
  id?: string;
  eyebrow: string;
  title: string;
  /** `loadMeetup().marketplace.steps`. */
  steps: readonly NumberedItem[];
  image: {
    /** Final URL, base path included: `meetupPhotoUrl(marketplace.photo)`. */
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
};

export function ZoomSplit({
  id,
  eyebrow,
  title,
  steps,
  image,
}: ZoomSplitProps) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <Section
      id={id}
      aria-labelledby={titleId}
      containerClassName="grid items-center gap-12 md:grid-cols-[1fr_1.1fr]"
    >
      <Photo
        src={image.src}
        alt={image.alt}
        width={image.width ?? 800}
        height={image.height ?? 771}
        className="aspect-[4/3] w-full -rotate-[1.5deg] rounded-card object-cover shadow-lift"
      />
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={titleId}>{frenchSpacing(title)}</h2>
        <NumberedList items={steps} />
      </div>
    </Section>
  );
}
