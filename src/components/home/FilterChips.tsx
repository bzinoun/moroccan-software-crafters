"use client";

import type { HistoryFilter } from "@/content/types";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "FilterChips" entry in msca-design/COMPONENTS.md; port of
// `.filters` and `.chip` in the former `assets/css/style.css` (`git show 1353207:assets/css/style.css`) and of the chips of
// former `assets/js/home.js` (`git show 1353207:assets/js/home.js`). A single choice: the pressed chip is the current value.

type FilterChipsProps = {
  /** Accessible name of the group ("Filtrer les événements" on the home page). */
  label: string;
  /** `home.history.filters`, in display order. */
  options: readonly HistoryFilter[];
  /** Value of the pressed chip. */
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

// The old chip set its font with the `font` shorthand, which resets the line
// height to `normal`: `leading-[normal]` keeps the old chip height.
const CHIP =
  "cursor-pointer rounded-full border-[1.5px] border-line bg-card px-[0.95rem] py-[0.45rem] font-body text-[0.9rem] leading-[normal] font-medium text-ink-soft aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white";

export function FilterChips({
  label,
  options,
  value,
  onChange,
  className,
}: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("mb-8 flex flex-wrap gap-2", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          className={CHIP}
          onClick={() => onChange(option.value)}
        >
          {frenchSpacing(option.label)}
        </button>
      ))}
    </div>
  );
}
