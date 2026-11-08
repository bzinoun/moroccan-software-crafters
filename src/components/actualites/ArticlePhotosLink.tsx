"use client";

import type { MouseEvent } from "react";
import type { PhotoItem } from "@/lib/derive";
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

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // A click with a modifier key or another button keeps the browser default
    // (new tab, new window, download).
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    lightbox.open(photos, 0);
  }

  return (
    <a href={first.src} onClick={handleClick}>
      {label}
    </a>
  );
}
