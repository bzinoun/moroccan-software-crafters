"use client";

import { useEffect, useRef, useState } from "react";
import type { PhotoItem } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { Button } from "../Button";
import { useLightbox } from "../Lightbox";
import { Section } from "../Section";
import { SectionFoot } from "../SectionFoot";
import { SectionHead } from "../SectionHead";
import { Photo } from "../Photo";

// Spec: the "PhotoGallery, GalleryItem" entry in msca-design/COMPONENTS.md.
// Ported from the gallery of the former `assets/js/home.js` (`git show 1353207:assets/js/home.js`). The first `limit` photos show;
// the more button appends the others and moves focus to the first one added.
// The lightbox always walks every photo, shown or not.

type PhotoGalleryProps = {
  eyebrow: string;
  title: string;
  /** Label of the more button (`home.gallery.more`). */
  more: string;
  /** `home.gallery.limit`; a missing or zero value means 8, as on the old site. */
  limit?: number;
  /** Every photo, in display order (`galleryItems(events)`). */
  items: PhotoItem[];
};

const GRID_ID = "gallery";

// Old site: `columns: 4 240px` with a 14px gap (10px below 600px), so the
// browser chose 2, 3 or 4 columns from the width. Measured on the page wrap,
// 3 columns start near 780px and 4 near 1030px. The nearest default
// breakpoints are `md` and `lg`; the gap changes at `sm`.
const GRID = "columns-2 gap-x-2.5 sm:gap-x-3.5 md:columns-3 lg:columns-4";

const ITEM =
  "group relative mb-2.5 block w-full cursor-zoom-in overflow-hidden rounded-sm break-inside-avoid sm:mb-3.5";

const PHOTO =
  "h-auto w-full motion-safe:transition-[scale] motion-safe:duration-400 motion-safe:ease-[ease] motion-safe:group-hover:scale-103";

const CAPTION =
  "absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent to-[rgba(0,0,0,0.65)] px-3 pt-[22px] pb-2.5 text-left text-[0.8rem] text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-200";

function GalleryItem({
  item,
  onOpen,
}: {
  item: PhotoItem;
  onOpen: () => void;
}) {
  const caption = frenchSpacing(item.caption);
  return (
    <button
      type="button"
      aria-label={`Agrandir : ${caption}`}
      className={ITEM}
      onClick={onOpen}
    >
      <Photo src={item.src} alt={caption} className={PHOTO} />
      <span className={CAPTION}>{caption}</span>
    </button>
  );
}

export function PhotoGallery({
  eyebrow,
  title,
  more,
  limit,
  items,
}: PhotoGalleryProps) {
  const lightbox = useLightbox();
  const gridRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const shownCount = limit || 8;
  const hasMore = items.length > shownCount;
  const shown = expanded ? items : items.slice(0, shownCount);

  // After the more button, focus moves to the first photo that was added.
  useEffect(() => {
    if (!expanded) return;
    gridRef.current?.querySelectorAll("button")[shownCount]?.focus();
  }, [expanded, shownCount]);

  return (
    <Section id="galerie">
      <SectionHead eyebrow={eyebrow} title={title} />
      <div id={GRID_ID} ref={gridRef} className={GRID}>
        {shown.map((item, i) => (
          <GalleryItem
            key={item.src}
            item={item}
            onOpen={() => lightbox.open(items, i)}
          />
        ))}
      </div>
      {hasMore && !expanded ? (
        <SectionFoot>
          <Button
            variant="ghost"
            aria-controls={GRID_ID}
            aria-expanded={false}
            onClick={() => setExpanded(true)}
          >
            {frenchSpacing(more)}
          </Button>
        </SectionFoot>
      ) : null}
    </Section>
  );
}
