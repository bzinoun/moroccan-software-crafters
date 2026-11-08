import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { Photo } from "./Photo";

// Spec: the "StepRows, StepRow, TipList" entry in msca-design/COMPONENTS.md;
// port of `.step-row`, `.time-tag`, `.kicker` and `.tips`, and of the steps
// code of the former `assets/js/pages.js` (`git show 1353207:assets/js/pages.js`).

export type Step = {
  /** Anchor id of the row. */
  id: string;
  /** "9 h 30 → 10 h 15". */
  time: string;
  title: string;
  /** Handwritten line above the title. */
  kicker: string;
  /** Final photo URL (base path included): `meetupPhotoUrl(step.photo)`. */
  image: string;
  text: string;
  tips?: readonly string[];
};

type TipListProps = {
  tips: readonly string[];
  className?: string;
};

// Mini post-its: yellow, green on even items, tilted either way.
export function TipList({ tips, className }: TipListProps) {
  if (tips.length === 0) return null;
  return (
    <ul
      role="list"
      className={cn(
        "mx-0 mt-[1.2rem] mb-0 grid list-none gap-[0.6rem] p-0",
        className,
      )}
    >
      {tips.map((tip) => (
        <li
          key={tip}
          className="w-fit max-w-full rotate-[-0.6deg] bg-postit-yellow px-3.5 pt-2.5 pb-3 font-hand text-[1.25rem] [line-height:1.2] shadow-[0_6px_12px_rgba(0,0,0,0.08)] even:rotate-[0.8deg] even:bg-postit-green"
        >
          {frenchSpacing(tip)}
        </li>
      ))}
    </ul>
  );
}

type StepRowProps = { step: Step };

// Two equal columns from `md` (old query 860px); the photo comes first on
// mobile. Even rows move the photo to the right.
export function StepRow({ step }: StepRowProps) {
  return (
    <article
      id={step.id}
      className="group grid items-center gap-5 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-2 md:gap-12 md:py-11"
    >
      <div className="relative md:group-even:order-2">
        <Photo
          src={step.image}
          alt=""
          className="aspect-[4/3] w-full rounded-card object-cover shadow-lift"
        />
        <span className="absolute top-3.5 left-3.5 rounded-full bg-ink px-[11px] py-1.5 text-[0.82rem] font-semibold text-white">
          {frenchSpacing(step.time)}
        </span>
      </div>
      <div>
        <div className="mb-[0.2rem] font-hand text-[1.6rem] leading-[1.1] text-green">
          {frenchSpacing(step.kicker)}
        </div>
        <h3 className="text-[1.8rem]">{frenchSpacing(step.title)}</h3>
        <p className="text-ink-soft">{frenchSpacing(step.text)}</p>
        <TipList tips={step.tips ?? []} />
      </div>
    </article>
  );
}

type StepRowsProps = {
  steps: readonly Step[];
  className?: string;
};

export function StepRows({ steps, className }: StepRowsProps) {
  if (steps.length === 0) return null;
  return (
    <div className={className}>
      {steps.map((step) => (
        <StepRow key={step.id} step={step} />
      ))}
    </div>
  );
}
