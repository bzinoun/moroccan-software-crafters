"use client";

import { useMemo, useState } from "react";
import type { Event, Home } from "@/content/types";
import { photoItems } from "@/lib/derive";
import { countLabel, frenchSpacing } from "@/lib/french";
import {
  DEFAULT_HISTORY_LIMIT,
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

// Spec: the "HistorySection, FeaturedEvents, FilterChips, EventTimeline,
// EventBadge" entry in msca-design/COMPONENTS.md.
// Without JavaScript the page lists every event and shows no chip and no more
// button. With JavaScript the timeline starts on the first chip and the first
// `limit` events, and the chips and the button change which events show.

type HistorySectionProps = {
  /** `home.history`. */
  history: Home["history"];
  /** Every event, newest first (`loadEvents()`). */
  events: Event[];
};

// Not in home.json: the labels of the controls and the id the button controls.
const FILTERS_LABEL = "Filtrer les événements";
const TIMELINE_ID = "timeline";

export function HistorySection({ history, events }: HistorySectionProps) {
  const lightbox = useLightbox();
  const [filter, setFilter] = useState(history.filters[0]?.value ?? "all");
  const [expanded, setExpanded] = useState(false);
  const limit = history.limit || DEFAULT_HISTORY_LIMIT;
  const groups = useMemo(() => eventsByYear(events, "all"), [events]);
  const matching = filterEvents(events, filter);
  const shown = expanded ? matching : matching.slice(0, limit);
  const shownIds = new Set(shown.map((event) => event.id));
  const hasMore = !expanded && matching.length > limit;
  // After the more button, focus moves to the first event it revealed.
  const focusId = expanded ? matching[limit]?.id : undefined;
  const filterLabel = history.filters.find((f) => f.value === filter)?.label;
  if (events.length === 0) return null;
  return (
    <Section id="historique" variant="alt">
      <SectionHead
        eyebrow={history.eyebrow}
        title={history.title}
        lead={history.lead}
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
      <p role="status" className="sr-only not-js:hidden">
        {filterLabel
          ? frenchSpacing(
              `${filterLabel} : ${countLabel(matching.length, "événement")}`,
            )
          : ""}
      </p>
      <EventTimeline
        id={TIMELINE_ID}
        groups={groups}
        shownIds={shownIds}
        focusId={focusId}
      />
      {hasMore ? (
        <SectionFoot className="not-js:hidden">
          <Button
            variant="ghost"
            aria-controls={TIMELINE_ID}
            aria-expanded={false}
            onClick={() => setExpanded(true)}
          >
            {frenchSpacing(
              timelineMoreLabel(
                history.more || "Voir les {n} événements",
                matching.length,
              ),
            )}
          </Button>
        </SectionFoot>
      ) : null}
    </Section>
  );
}
