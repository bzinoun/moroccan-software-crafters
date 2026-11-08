import "server-only";

import type { Metadata } from "next";
import { loadSite } from "@/content/load";
import { absoluteMeetupPhoto } from "./derive";
import { requireMeetupPhoto } from "./images-server";

type PageMetadataInput = {
  /** Default: `site.baseUrl`, which already carries the GitHub Pages base path. */
  baseUrl?: string;
  /** Route of the page, with its slashes: `/meetup/`. */
  path: string;
  /** Document title. */
  title: string;
  /** Document description. */
  description: string;
  /** Title and description of the social cards, when they differ from the document ones. */
  share?: { title?: string; description?: string };
  /** Name of a file in `public/assets/img/meetups`, without the extension. */
  photo: string;
  type?: "website" | "article";
};

/**
 * The `metadata` of a page: title, description, canonical URL, Open Graph and
 * Twitter. Social tags need full URLs, and a page-level `openGraph`
 * replaces the layout one, so each page repeats type and url. A photo name
 * without a file fails the build.
 */
export function pageMetadata({
  baseUrl = loadSite().baseUrl,
  path,
  title,
  description,
  share = {},
  photo,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = `${baseUrl}${path}`;
  const images = [absoluteMeetupPhoto(baseUrl, requireMeetupPhoto(photo))];
  const social = {
    title: share.title ?? title,
    description: share.description ?? description,
    images,
  };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type, url, ...social },
    twitter: { card: "summary_large_image", ...social },
  };
}
