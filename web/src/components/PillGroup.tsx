import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "Form primitives" entry in msca-design/COMPONENTS.md; port of
// `.pills` and `.pill`.

type PillGroupProps = Omit<ComponentProps<"div">, "role"> & {
  /** `radiogroup` for single choice pills, `group` (default) for checkboxes. */
  role?: "group" | "radiogroup";
};

/** The wrapping row of pills. Name it with `aria-labelledby` or `aria-label`. */
export function PillGroup({
  role = "group",
  className,
  ...props
}: PillGroupProps) {
  return (
    <div
      role={role}
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    />
  );
}

type PillProps = Omit<ComponentProps<"input">, "type" | "children"> & {
  type: "radio" | "checkbox";
  children: string;
};

/**
 * A choice drawn as a pill. The native input stays in the page (focusable,
 * transparent); the checked pill turns ink with white text, and keyboard focus
 * marks the pill in green.
 */
export function Pill({ type, children, className, ...props }: PillProps) {
  return (
    <label className={cn("relative", className)}>
      <input
        type={type}
        className="peer pointer-events-none absolute opacity-0"
        {...props}
      />
      <span className="inline-block cursor-pointer rounded-full border-[1.5px] border-line bg-white px-4 py-[0.55rem] text-[0.93rem] font-medium peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green">
        {frenchSpacing(children)}
      </span>
    </label>
  );
}
