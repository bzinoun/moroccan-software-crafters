"use client";

import type { Event } from "@/content/types";
import { meetupPhotoUrl } from "@/lib/derive";
import { countLabel, frenchSpacing } from "@/lib/french";
import { eventLinks, featuredMeta } from "@/lib/home-data";
import { PageLink } from "../PageLink";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { TagList } from "../TagList";
import { openPhoto } from "./photoLink";

// Spec: the "FeaturedEvents, FeatureCard" entry in msca-design/COMPONENTS.md.
// The photo is a link to the first photo file, so it works without
// JavaScript. With JavaScript a plain click calls `onOpenPhotos` (the section
// wires it to the lightbox) and the link does not navigate.
// Layout: three columns from `lg` (1024px), row cards (photo 40 percent wide)
// from `sm` (640px), stacked cards below.

type FeaturedEventsProps = {
  /** `featuredEvents(events)`: the three newest meetups with photos. */
  events: Event[];
  /** Called with the event whose photo link was clicked. */
  onOpenPhotos: (event: Event) => void;
};

const CARD =
  "flex flex-col overflow-hidden rounded-card bg-white shadow-card sm:flex-row lg:flex-col";

// The card clips what overflows, so the focus indicator is drawn inside the photo.
const THUMB =
  "group relative aspect-16/10 w-full cursor-zoom-in overflow-hidden bg-paper-2 no-underline focus-visible:-outline-offset-3 sm:aspect-auto sm:w-2/5 sm:shrink-0 lg:aspect-16/10 lg:w-full";

const PHOTO =
  "size-full object-cover motion-safe:transition-[scale] motion-safe:duration-400 motion-safe:ease-standard motion-safe:group-hover:scale-104";

// Line height `normal` keeps the pill height of the design.
const COUNT =
  "absolute right-2.5 bottom-2.5 rounded-full bg-ink/78 px-2.25 py-1 text-s78 leading-[normal] text-white";

function photosLabel(count: number, title: string): string {
  return frenchSpacing(
    count === 1
      ? `Voir la photo de ${title}`
      : `Voir les ${count} photos de ${title}`,
  );
}

function FeatureCard({
  event,
  onOpenPhotos,
}: {
  event: Event;
  onOpenPhotos: () => void;
}) {
  const photos = event.photos ?? [];
  const first = photos[0];
  const links = eventLinks(event);
  return (
    <Reveal as="article" className={CARD}>
      {first ? (
        <a
          href={meetupPhotoUrl(first)}
          aria-label={photosLabel(photos.length, event.title)}
          className={THUMB}
          onClick={openPhoto(onOpenPhotos)}
        >
          <Photo src={meetupPhotoUrl(first)} alt="" className={PHOTO} />
          <span className={COUNT}>{countLabel(photos.length, "photo")}</span>
        </a>
      ) : null}
      <div className="flex flex-1 flex-col px-5.5 pt-5 pb-5.5">
        <p className="mb-[0.35rem] text-s82 text-muted">
          {frenchSpacing(featuredMeta(event))}
        </p>
        <h3 className="text-s120">{frenchSpacing(event.title)}</h3>
        {event.summary ? (
          <p className="text-s95 text-ink-soft">
            {frenchSpacing(event.summary)}
          </p>
        ) : null}
        <TagList tags={event.topics} max={4} />
        {links.length ? (
          <div className="mt-auto flex flex-wrap gap-3.5 text-s90 font-semibold">
            {links.map((link) => (
              <PageLink
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="inline-flex min-h-11 items-center"
              >
                {link.label}
                {/* The same label repeats on every card: the event names it. */}
                <span className="sr-only">
                  {frenchSpacing(`, ${event.title}`)}
                </span>
              </PageLink>
            ))}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

export function FeaturedEvents({ events, onOpenPhotos }: FeaturedEventsProps) {
  if (events.length === 0) return null;
  return (
    <div className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {events.map((event) => (
        <FeatureCard
          key={event.id}
          event={event}
          onOpenPhotos={() => onOpenPhotos(event)}
        />
      ))}
    </div>
  );
}
