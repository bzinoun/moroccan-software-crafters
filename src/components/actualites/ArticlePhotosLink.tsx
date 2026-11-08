"use client";

import type { PhotoItem } from "@/lib/derive";
import { useLightbox } from "../Lightbox";

// The "Les N photos" entry of the links row of an article. The old site used
// an anchor with `href="#"`; a button is the honest element for an action, and
// it looks like the other links of the row. Needs a `LightboxProvider` above it.
export function ArticlePhotosLink({
  label,
  photos,
}: {
  /** "Les 8 photos". */
  label: string;
  /** Photos of the event of the article. */
  photos: PhotoItem[];
}) {
  const lightbox = useLightbox();
  return (
    <button
      type="button"
      className="cursor-pointer font-semibold text-green underline hover:text-green-dark"
      onClick={() => lightbox.open(photos, 0)}
    >
      {label}
    </button>
  );
}
