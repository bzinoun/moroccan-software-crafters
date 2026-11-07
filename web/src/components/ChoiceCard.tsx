import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "Form primitives" entry in msca-design/COMPONENTS.md; port of
// `.choice-cards` and `.choice-card`.

/** The column of choice cards, a radio group. Name it with `aria-label` or `aria-labelledby`. */
export function ChoiceGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div role="radiogroup" className={cn("grid gap-3", className)} {...props} />
  );
}

type ChoiceCardProps = Omit<ComponentProps<"input">, "type" | "title"> & {
  title: string;
  description?: string;
  /** Printed on the right from `sm`, under the text below (old query 520px). */
  price?: string;
};

/**
 * A radio drawn as a card: a circle, a title, an optional description and
 * price. The native radio stays in the page (focusable, transparent). A checked
 * card gets a green edge and tint; keyboard focus marks the whole card.
 */
export function ChoiceCard({
  title,
  description,
  price,
  className,
  ...props
}: ChoiceCardProps) {
  return (
    <label
      className={cn(
        "relative grid cursor-pointer grid-cols-[24px_1fr] items-start gap-3.5 rounded-card border-[1.5px] border-line px-[18px] py-4 hover:border-[#cbbfa9] has-checked:border-green has-checked:bg-[#f3faf5] has-checked:hover:border-green has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-green motion-safe:transition-[border-color,background-color] motion-safe:duration-150 sm:grid-cols-[24px_1fr_auto]",
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
        className="mt-0.5 grid size-[22px] place-items-center rounded-full border-2 border-[#b9ad99] peer-checked:border-green after:hidden after:size-2.5 after:rounded-full after:bg-green after:content-[''] peer-checked:after:block"
      />
      <span>
        <strong className="block text-[1.02rem]">{frenchSpacing(title)}</strong>
        {description ? (
          <small className="text-[0.88rem] text-ink-soft">
            {frenchSpacing(description)}
          </small>
        ) : null}
      </span>
      {price ? (
        <span className="col-start-2 font-display text-[0.98rem] font-semibold whitespace-nowrap text-green sm:col-auto">
          {frenchSpacing(price)}
        </span>
      ) : null}
    </label>
  );
}
