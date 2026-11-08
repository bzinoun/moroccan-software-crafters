"use client";

import { useEffect, useRef } from "react";
import type { Event, EventType } from "@/content/types";
import { tv } from "@/lib/cn";
import { fmtDate, TYPE_LABEL } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { timelineWhere, type YearGroup } from "@/lib/home-data";
import { TagList } from "../TagList";

// Spec: the "EventTimeline, YearGroup, TimelineItem, EventBadge" entry in
// msca-design/COMPONENTS.md; port of the timeline of the former `assets/js/home.js` (`git show 1353207:assets/js/home.js`) and of
// `.year-group`, `.tl-item` and `.badge` in the former `assets/css/style.css` (`git show 1353207:assets/css/style.css`).
// The old site stacked the year and the item parts below 700px; the nearest
// default breakpoint is `sm` (640px). The year sticks at 90px from `sm` only.

type EventTimelineProps = {
  /** `eventsByYear(events, type, limit)`. */
  groups: YearGroup[];
  /** Id of the root, for `aria-controls` on the more button. */
  id?: string;
  /**
   * Id of the event whose item takes the focus when it appears: the first one
   * that the more button reveals. The item gets `tabIndex={-1}`.
   */
  focusId?: string;
};

// Only the meetup badge color has a token; the others are used once (TOKENS.md).
export const eventBadgeStyles = tv({
  base: "justify-self-start rounded-full px-[9px] py-1 text-[0.72rem] font-bold tracking-[0.05em] whitespace-nowrap uppercase sm:justify-self-end",
  variants: {
    kind: {
      meetup: "bg-green-soft text-green-dark",
      socrates: "bg-[#fbe4e5] text-red-dark",
      codesnack: "bg-[#fff4cc] text-[#7a5b00]",
      online: "bg-[#e3f1fa] text-[#1f5f80]",
    },
  },
});

export function EventBadge({ kind }: { kind: EventType }) {
  return <span className={eventBadgeStyles({ kind })}>{TYPE_LABEL[kind]}</span>;
}

const GROUP =
  "grid grid-cols-1 gap-2 border-t border-line py-4.5 sm:grid-cols-[120px_1fr] sm:gap-6";

const YEAR = "m-0 self-start text-[2rem] text-green sm:sticky sm:top-[90px]";

const ITEM =
  "grid grid-cols-1 items-start gap-1 rounded-sm border border-line bg-card px-[18px] py-3.5 sm:grid-cols-[92px_1fr_auto] sm:gap-4";

function TimelineItem({ event, focus }: { event: Event; focus: boolean }) {
  const ref = useRef<HTMLLIElement>(null);

  // The item that the more button reveals takes the focus once, when it mounts.
  useEffect(() => {
    if (focus) ref.current?.focus();
  }, [focus]);

  return (
    <li ref={ref} tabIndex={focus ? -1 : undefined} className={ITEM}>
      <time
        dateTime={event.date}
        className="pt-0.5 text-[0.85rem] font-medium text-muted"
      >
        {fmtDate(event.date, { day: false })}
      </time>
      <div>
        <h4 className="mb-[0.15rem] font-body text-[1.02rem] font-semibold">
          {frenchSpacing(event.title)}
        </h4>
        <div className="text-[0.88rem] text-ink-soft">
          {frenchSpacing(timelineWhere(event))}
        </div>
        <TagList tags={event.topics} max={6} className="mt-2 mb-0" />
      </div>
      <EventBadge kind={event.type} />
    </li>
  );
}

export function EventTimeline({ groups, id, focusId }: EventTimelineProps) {
  return (
    <div id={id}>
      {groups.map((group) => (
        <section key={group.year} className={GROUP}>
          <h3 className={YEAR}>{group.year}</h3>
          <ol role="list" className="m-0 grid list-none gap-3 p-0">
            {group.items.map((event) => (
              <TimelineItem
                key={event.id}
                event={event}
                focus={event.id === focusId}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
