"use client";

import { useState } from "react";
import type { Event, Home } from "@/content/types";
import { photoItems } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import {
  eventsByYear,
  featuredEvents,
  filterEvents,
  timelineMoreLabel,
} from "@/lib/home-data";
import { Button } from "../Button";
import { useLightbox } from "../Lightbox";
import { Section } from "../Section";
import { SectionFoot } from "../SectionFoot";
import { SectionHead } from "../SectionHead";
import { EventTimeline } from "./EventTimeline";
import { FeaturedEvents } from "./FeaturedEvents";
import { FilterChips } from "./FilterChips";

// Spec: the entries "FeaturedEvents, FeatureCard", "FilterChips" and
// "EventTimeline, YearGroup, TimelineItem, EventBadge" in
// msca-design/COMPONENTS.md; port of the #historique section of the former `index.html` (`git show 1353207:index.html`) and
// of the history part of the former `assets/js/home.js` (`git show 1353207:assets/js/home.js`).

type HistorySectionProps = {
  /** `home.history`. */
  history: Home["history"];
  /** Every event, newest first (`loadEvents()`). */
  events: Event[];
};

// Static in the former `index.html`, not in home.json.
const FILTERS_LABEL = "Filtrer les événements";
const TIMELINE_ID = "timeline";

export function HistorySection({ history, events }: HistorySectionProps) {
  const lightbox = useLightbox();
  const [filter, setFilter] = useState(history.filters[0]?.value ?? "all");
  const [expanded, setExpanded] = useState(false);
  const limit = history.limit || 6;
  const all = filterEvents(events, filter);
  const hasMore = !expanded && all.length > limit;
  // After the more button, focus moves to the first event it revealed.
  const focusId = expanded ? all[limit]?.id : undefined;
  return (
    <Section id="historique" variant="alt">
      <SectionHead
        eyebrow={history.eyebrow}
        title={history.title}
        lead={frenchSpacing(history.lead)}
      />
      <FeaturedEvents
        events={featuredEvents(events)}
        onOpenPhotos={(event) => lightbox.open(photoItems(event), 0)}
      />
      <FilterChips
        label={FILTERS_LABEL}
        options={history.filters}
        value={filter}
        onChange={(value) => {
          setFilter(value);
          setExpanded(false);
        }}
      />
      <EventTimeline
        id={TIMELINE_ID}
        groups={eventsByYear(events, filter, expanded ? undefined : limit)}
        focusId={focusId}
      />
      {hasMore ? (
        <SectionFoot>
          <Button
            variant="ghost"
            aria-controls={TIMELINE_ID}
            aria-expanded={false}
            onClick={() => setExpanded(true)}
          >
            {frenchSpacing(
              timelineMoreLabel(
                history.more || "Voir les {n} événements",
                all.length,
              ),
            )}
          </Button>
        </SectionFoot>
      ) : null}
    </Section>
  );
}
