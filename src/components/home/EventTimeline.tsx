"use client";

import { useEffect, useId, useRef } from "react";
import type { Event, EventType } from "@/content/types";
import { cn, tv } from "@/lib/cn";
import { fmtDate, TYPE_LABEL } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { timelineWhere, type YearGroup } from "@/lib/home-data";
import { TagList } from "../TagList";

// Spec: the "HistorySection, FeaturedEvents, FilterChips, EventTimeline, EventBadge" entry in
// msca-design/COMPONENTS.md. Every event is in the HTML. A visitor with
// JavaScript sees only the events in `shownIds` (the chosen type and the more
// button); the others carry the `js:hidden` variant, so the page does not shift at load.
// The items stack below `sm` (640px) and the year sticks at 90px from `sm` only.

type EventTimelineProps = {
  /** `eventsByYear(events, "all")`: every event, gathered by year. */
  groups: YearGroup[];
  /** Id of the root, for `aria-controls` on the more button. */
  id?: string;
  /**
   * Ids of the events that a visitor with JavaScript sees. Absent: all of them.
   * A year with no shown event is collapsed as a whole.
   */
  shownIds?: ReadonlySet<string>;
  /**
   * Id of the event whose item takes the focus when it appears: the first one
   * that the more button reveals. The item gets `tabIndex={-1}`.
   */
  focusId?: string;
};

// Only the meetup badge color has a token; the others are used once (TOKENS.md).
const eventBadgeStyles = tv({
  base: "justify-self-start rounded-full px-2.25 py-1 text-s72 font-bold tracking-[0.05em] whitespace-nowrap uppercase sm:justify-self-end",
  variants: {
    kind: {
      meetup: "bg-green-soft text-green-dark",
      socrates: "bg-[#fbe4e5] text-red-dark",
      codesnack: "bg-[#fff4cc] text-[#7a5b00]",
      online: "bg-[#e3f1fa] text-[#1f5f80]",
    },
  },
});

function EventBadge({ kind }: { kind: EventType }) {
  return <span className={eventBadgeStyles({ kind })}>{TYPE_LABEL[kind]}</span>;
}

const GROUP =
  "grid grid-cols-1 gap-2 border-t border-line py-4.5 sm:grid-cols-[120px_1fr] sm:gap-6";

const YEAR = "m-0 self-start text-[2rem] text-green sm:sticky sm:top-22.5";

const ITEM =
  "grid grid-cols-1 items-start gap-1 rounded-sm border border-line bg-white px-4.5 py-3.5 sm:grid-cols-[92px_1fr_auto] sm:gap-4";

// Collapses an element for a visitor with JavaScript (the rule is in globals.css).
const COLLAPSED = "js:hidden";

function TimelineItem({
  event,
  focus,
  shown,
}: {
  event: Event;
  focus: boolean;
  shown: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);

  // The item that the more button reveals takes the focus once, when it mounts.
  useEffect(() => {
    if (focus) ref.current?.focus();
  }, [focus]);

  return (
    <li
      ref={ref}
      tabIndex={focus ? -1 : undefined}
      className={cn(ITEM, !shown && COLLAPSED)}
    >
      <time
        dateTime={event.date}
        className="pt-0.5 text-s85 font-medium text-muted"
      >
        {fmtDate(event.date, { day: false })}
      </time>
      <div>
        <h4 className="mb-[0.15rem] font-body text-s102 font-semibold">
          {frenchSpacing(event.title)}
        </h4>
        <div className="text-s88 text-ink-soft">
          {frenchSpacing(timelineWhere(event))}
        </div>
        <TagList tags={event.topics} max={6} className="mt-2 mb-0" />
      </div>
      <EventBadge kind={event.type} />
    </li>
  );
}

export function EventTimeline({
  groups,
  id,
  shownIds,
  focusId,
}: EventTimelineProps) {
  const base = useId();
  if (groups.length === 0) return null;
  const isShown = (event: Event) => shownIds?.has(event.id) ?? true;
  return (
    <div id={id}>
      {groups.map((group) => {
        const headingId = `${base}-${group.year}`;
        return (
          <section
            key={group.year}
            aria-labelledby={headingId}
            className={cn(GROUP, !group.items.some(isShown) && COLLAPSED)}
          >
            <h3 id={headingId} className={YEAR}>
              {group.year}
            </h3>
            <ol role="list" className="m-0 grid list-none gap-3 p-0">
              {group.items.map((event) => (
                <TimelineItem
                  key={event.id}
                  event={event}
                  focus={event.id === focusId}
                  shown={isShown(event)}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
