import { frenchSpacing } from "@/lib/french";
import { cn } from "@/lib/cn";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";

// Spec: the "HistoryTimeline" entry in msca-design/COMPONENTS.md; port of
// `.history` (association page, #histoire). A vertical line runs behind a red
// dot on each milestone. The line and the dots are pseudo-elements, so the
// markup stays a plain ordered list. The old 600px query maps to `sm`.

export type Milestone = { year: string; title: string; text: string };

type HistoryTimelineProps = {
  /** `loadAssociation().timeline.items`. */
  items: readonly Milestone[];
  id?: string;
  className?: string;
};

export function HistoryTimeline({
  items,
  id,
  className,
}: HistoryTimelineProps) {
  if (items.length === 0) return null;
  return (
    <ol
      id={id}
      role="list"
      className={cn(
        "relative m-0 list-none p-0 before:absolute before:top-2.5 before:bottom-2.5 before:left-[61px] before:w-0.5 before:bg-line sm:before:left-[70px]",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.year}
          className="relative grid grid-cols-[48px_1fr] gap-7 py-3.5 after:absolute after:top-6 after:left-[55px] after:size-3.5 after:rounded-full after:border-[3px] after:border-red after:bg-paper sm:grid-cols-[56px_1fr] sm:gap-9 sm:after:left-16"
        >
          <span className="text-right font-display text-[1.15rem] leading-[1.2] font-semibold text-green sm:text-[1.5rem]">
            {frenchSpacing(item.year)}
          </span>
          <div>
            <h3 className="mb-[0.2rem] text-[1.15rem]">
              {frenchSpacing(item.title)}
            </h3>
            <p className="m-0 max-w-[62ch] text-[0.95rem] text-ink-soft">
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

// The #histoire section of the former `association.html` (`git show 1353207:association.html`).
export function AssociationHistory({ history }: AssociationHistoryProps) {
  return (
    <Section id="histoire">
      <SectionHead
        eyebrow={frenchSpacing(history.eyebrow)}
        title={frenchSpacing(history.title)}
      />
      <HistoryTimeline id="history" items={history.items} />
    </Section>
  );
}
