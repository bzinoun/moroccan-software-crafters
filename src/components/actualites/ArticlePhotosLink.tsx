"use client";

import type { PhotoItem } from "@/lib/derive";
import { openPhoto } from "../home/photoLink";
import { useLightbox } from "../Lightbox";

// The "Les N photos" entry of the links row of an article. It is a link to the
// first photo file, so it works without JavaScript; with JavaScript a plain
// click opens the lightbox instead. Needs a `LightboxProvider` above it.
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
  const first = photos[0];
  if (!first) return null;

  return (
    <a href={first.src} onClick={openPhoto(() => lightbox.open(photos, 0))}>
      {label}
    </a>
  );
}
