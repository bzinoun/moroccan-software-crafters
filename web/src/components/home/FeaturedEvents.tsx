"use client";

import type { Event } from "@/content/types";
import { meetupPhotoUrl } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { eventLinks, featuredMeta } from "@/lib/home-data";
import { Reveal } from "../Reveal";
import { TagList } from "../TagList";

// Spec: the "FeaturedEvents, FeatureCard" entry in msca-design/COMPONENTS.md;
// port of the featured cards of assets/js/home.js and of `.featured` and
// `.feature-card` in assets/css/style.css. The photo button opens the photos
// of its event through `onOpenPhotos` (the section wires it to the lightbox).
// Old layout: three columns, one column of row cards (photo 40 percent wide)
// below 960px, stacked cards below 600px. The nearest default breakpoints are
// `lg` (1024px) and `sm` (640px).

type FeaturedEventsProps = {
  /** `featuredEvents(events)`: the three newest meetups with photos. */
  events: Event[];
  /** Called with the event whose photo button was clicked. */
  onOpenPhotos: (event: Event) => void;
};

const CARD =
  "flex flex-col overflow-hidden rounded-card bg-card shadow-card sm:flex-row lg:flex-col";

// The card clips what overflows, so the focus indicator is drawn inside the photo.
const THUMB =
  "group relative focus-visible:-outline-offset-3 aspect-16/10 w-full cursor-zoom-in overflow-hidden bg-paper-2 sm:aspect-auto sm:w-2/5 sm:shrink-0 lg:aspect-16/10 lg:w-full";

const PHOTO =
  "size-full object-cover motion-safe:transition-[scale] motion-safe:duration-400 motion-safe:ease-[ease] motion-safe:group-hover:scale-104";

// The old pill sat in a button with the browser font settings: line height
// `normal` keeps its old height.
const COUNT =
  "absolute right-2.5 bottom-2.5 rounded-full bg-[rgba(29,27,25,0.78)] px-[9px] py-1 text-[0.78rem] leading-[normal] text-white";

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
        <button
          type="button"
          aria-label={frenchSpacing(
            `Voir les ${photos.length} photos de ${event.title}`,
          )}
          className={THUMB}
          onClick={onOpenPhotos}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- exported site, images are unoptimized */}
          <img
            src={meetupPhotoUrl(first)}
            alt=""
            loading="lazy"
            className={PHOTO}
          />
          <span className={COUNT}>{photos.length} photos</span>
        </button>
      ) : null}
      <div className="flex flex-1 flex-col px-5.5 pt-5 pb-5.5">
        <p className="mb-[0.35rem] text-[0.82rem] text-muted">
          {frenchSpacing(featuredMeta(event))}
        </p>
        <h3 className="text-[1.2rem]">{frenchSpacing(event.title)}</h3>
        {event.summary ? (
          <p className="text-[0.95rem] text-ink-soft">
            {frenchSpacing(event.summary)}
          </p>
        ) : null}
        <TagList tags={event.topics} max={4} />
        {links.length ? (
          <div className="mt-auto flex flex-wrap gap-3.5 text-[0.9rem] font-semibold">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

export function FeaturedEvents({ events, onOpenPhotos }: FeaturedEventsProps) {
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
