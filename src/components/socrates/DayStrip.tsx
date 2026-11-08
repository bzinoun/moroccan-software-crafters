import { frenchSpacing } from "@/lib/french";

// Spec: the "DayStrip" entry in msca-design/COMPONENTS.md; port of `.days`.
// One bordered panel. One column below `sm` (old 560px), two columns to `lg`
// (old 900px), four from `lg`. The divider lines follow the layout: a top line
// under the first row in the stacked and two-column layouts, a left line between
// the four columns.

type Day = { day: string; title: string; text: string };

type DayStripProps = {
  /** `loadSocrates().schedule.days`. */
  days: readonly Day[];
  /** `loadSocrates().schedule.note`; nothing renders when empty. */
  note?: string;
};

const CELL =
  "border-t border-line px-5.5 pt-6.5 pb-7 first:border-t-0 sm:border-t-0 sm:border-l sm:first:border-l-0 sm:nth-3:border-l-0 sm:nth-[n+3]:border-t lg:nth-3:border-l lg:nth-[n+3]:border-t-0";

export function DayStrip({ days, note }: DayStripProps) {
  return (
    <>
      <ol
        role="list"
        className="m-0 grid list-none grid-cols-1 overflow-hidden rounded-card border border-line bg-white p-0 sm:grid-cols-2 lg:grid-cols-4"
      >
        {days.map((day) => (
          <li key={day.day} className={CELL}>
            <span className="font-hand text-[1.7rem] leading-none text-green">
              {frenchSpacing(day.day)}
            </span>
            <h3 className="mt-2 mb-[0.4rem] text-[1.15rem]">
              {frenchSpacing(day.title)}
            </h3>
            <p className="m-0 text-[0.93rem] text-ink-soft">
              {frenchSpacing(day.text)}
            </p>
          </li>
        ))}
      </ol>
      {note ? (
        <p className="mt-3.5 mb-[1em] text-[0.88rem] text-muted">
          {frenchSpacing(note)}
        </p>
      ) : null}
    </>
  );
}
