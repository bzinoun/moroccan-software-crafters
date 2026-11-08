"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import type { PhotoItem } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { DEFAULT_GALLERY_LIMIT } from "@/lib/home-data";
import { cn } from "@/lib/cn";
import { Button } from "../Button";
import { useLightbox } from "../Lightbox";
import { Photo } from "../Photo";
import { Section } from "../Section";
import { SectionFoot } from "../SectionFoot";
import { SectionHead } from "../SectionHead";
import { openPhoto } from "./photoLink";

// Spec: the "PhotoGallery, GalleryItem" entry in msca-design/COMPONENTS.md.
// Every photo is in the HTML, each a link to its file. Without JavaScript the
// whole gallery shows and there is no more button. With JavaScript the photos
// after the first `limit` are collapsed until the more button, which moves
// focus to the first one revealed, and a plain click on a photo opens the
// lightbox. The lightbox always walks every photo, shown or not.

type PhotoGalleryProps = {
  eyebrow: string;
  title: string;
  /** Label of the more button (`home.gallery.more`). */
  more: string;
  /** `home.gallery.limit`; a missing or zero value means the default limit. */
  limit?: number;
  /** Every photo, in display order (`galleryItems(events)`). */
  items: PhotoItem[];
};

const GRID_ID = "gallery";

// Columns: the browser picks the count from the width. `md` (768px) gives 3
// and `lg` (1024px) gives 4; the gap widens at `sm`.
const GRID = "columns-2 gap-x-2.5 sm:gap-x-3.5 md:columns-3 lg:columns-4";

const ITEM =
  "group relative mb-2.5 block w-full cursor-zoom-in overflow-hidden rounded-sm break-inside-avoid no-underline sm:mb-3.5";

const PHOTO =
  "h-auto w-full motion-safe:transition-[scale] motion-safe:duration-400 motion-safe:ease-standard motion-safe:group-hover:scale-103";

// The scrim is dark enough from the first line of text down, so white text
// stays readable on a pale photo (white on 55 percent black is about 5 to 1).
const CAPTION =
  "absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent via-[rgba(0,0,0,0.6)] via-25% to-[rgba(0,0,0,0.65)] px-3 pt-5.5 pb-2.5 text-left text-s80 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-200";

function GalleryItem({
  item,
  collapsed,
  onOpen,
  ref,
}: {
  item: PhotoItem;
  /** Hidden for a visitor with JavaScript, until the more button. */
  collapsed: boolean;
  onOpen: () => void;
  ref?: Ref<HTMLAnchorElement>;
}) {
  const caption = frenchSpacing(item.caption);
  return (
    <a
      ref={ref}
      href={item.src}
      aria-label={`Agrandir : ${caption}`}
      className={cn(ITEM, collapsed && "js:hidden")}
      onClick={openPhoto(onOpen)}
    >
      <Photo src={item.src} alt={caption} className={PHOTO} />
      <span className={CAPTION}>{caption}</span>
    </a>
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
  const firstExtraRef = useRef<HTMLAnchorElement>(null);
  const [expanded, setExpanded] = useState(false);
  const shownCount = limit || DEFAULT_GALLERY_LIMIT;
  const hasMore = items.length > shownCount;

  // After the more button, focus moves to the first photo that was added.
  useEffect(() => {
    if (expanded) firstExtraRef.current?.focus();
  }, [expanded]);

  if (items.length === 0) return null;
  return (
    <Section id="galerie">
      <SectionHead eyebrow={eyebrow} title={title} />
      <div id={GRID_ID} className={GRID}>
        {items.map((item, i) => (
          <GalleryItem
            key={`${i}-${item.src}`}
            ref={i === shownCount ? firstExtraRef : undefined}
            item={item}
            collapsed={!expanded && i >= shownCount}
            onOpen={() => lightbox.open(items, i)}
          />
        ))}
      </div>
      {hasMore && !expanded ? (
        <SectionFoot className="not-js:hidden">
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
