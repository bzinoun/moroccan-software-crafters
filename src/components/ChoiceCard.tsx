import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "Form primitives" entry in msca-design/COMPONENTS.md.

/** The column of choice cards, a radio group. Name it with `aria-label` or `aria-labelledby`. */
export function ChoiceGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div role="radiogroup" className={cn("grid gap-3", className)} {...props} />
  );
}

type ChoiceCardProps = Omit<ComponentProps<"input">, "type" | "title"> & {
  title: string;
  description?: string;
};

/**
 * A radio drawn as a card: a circle, a title, an optional description. The native radio stays in the page (focusable, transparent). A checked
 * card gets a green edge and tint; keyboard focus marks the whole card.
 */
export function ChoiceCard({
  title,
  description,
  className,
  ...props
}: ChoiceCardProps) {
  return (
    <label
      className={cn(
        "relative grid cursor-pointer grid-cols-[24px_1fr] items-start gap-3.5 rounded-card border-[1.5px] border-line px-4.5 py-4 hover:border-[#cbbfa9] has-checked:border-green has-checked:bg-[#f3faf5] has-checked:hover:border-green has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-green motion-safe:transition-[border-color,background-color] motion-safe:duration-150",
        className,
      )}
    >
      <input
        type="radio"
        className="peer pointer-events-none absolute opacity-0"
        {...props}
      />
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-5.5 place-items-center rounded-full border-2 border-[#b9ad99] peer-checked:border-green after:hidden after:size-2.5 after:rounded-full after:bg-green after:content-[''] peer-checked:after:block"
      />
      <span>
        <strong className="block text-s102">{frenchSpacing(title)}</strong>
        {description ? (
          <small className="text-s88 text-ink-soft">
            {frenchSpacing(description)}
          </small>
        ) : null}
      </span>
    </label>
  );
}
