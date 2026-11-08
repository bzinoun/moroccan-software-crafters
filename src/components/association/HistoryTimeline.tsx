import { frenchSpacing } from "@/lib/french";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";

// Spec: the "HistoryTimeline, AssociationHistory" entry in msca-design/COMPONENTS.md.
// A vertical line runs behind a red dot on each milestone. The line and the
// dots are pseudo-elements, so the markup stays a plain ordered list. The
// layout changes at `sm`.

export type Milestone = { year: string; title: string; text: string };

type HistoryTimelineProps = {
  /** `loadAssociation().timeline.items`. */
  items: readonly Milestone[];
};

export function HistoryTimeline({ items }: HistoryTimelineProps) {
  if (items.length === 0) return null;
  return (
    <ol
      role="list"
      className="relative m-0 list-none p-0 before:absolute before:top-2.5 before:bottom-2.5 before:left-[61px] before:w-0.5 before:bg-line before:content-[''] sm:before:left-17.5"
    >
      {items.map((item) => (
        <li
          key={`${item.year}-${item.title}`}
          className="relative grid grid-cols-[48px_1fr] gap-7 py-3.5 after:absolute after:top-6 after:left-[55px] after:size-3.5 after:rounded-full after:border-3 after:border-red after:bg-paper after:content-[''] sm:grid-cols-[56px_1fr] sm:gap-9 sm:after:left-16"
        >
          <span className="text-right font-display text-s115 leading-[1.2] font-semibold text-green sm:text-s150">
            {frenchSpacing(item.year)}
          </span>
          <div>
            <h3 className="mb-[0.2rem] text-s115">
              {frenchSpacing(item.title)}
            </h3>
            <p className="m-0 max-w-[62ch] text-s95 text-ink-soft">
              {frenchSpacing(item.text)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

type AssociationHistoryProps = {
  /** `loadAssociation().timeline`. */
  history: { eyebrow: string; title: string; items: readonly Milestone[] };
};

const TITLE_ID = "history-title";

// The #histoire section: a head, then the timeline. Without milestones there
// is nothing to introduce, so the section is not rendered.
export function AssociationHistory({ history }: AssociationHistoryProps) {
  if (history.items.length === 0) return null;
  return (
    <Section id="histoire" aria-labelledby={TITLE_ID}>
      <SectionHead
        eyebrow={history.eyebrow}
        title={history.title}
        titleId={TITLE_ID}
      />
      <HistoryTimeline items={history.items} />
    </Section>
  );
}
