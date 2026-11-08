"use client";

import type { HistoryFilter } from "@/content/types";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "FilterChips" entry in msca-design/COMPONENTS.md.
// A single choice: the pressed chip is the current value. The chips need
// JavaScript, so a visitor without it does not see them (and the page then
// shows every event).

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

// `leading-[normal]` keeps the chip height of the design (the browser button
// default, not the body line height).
const CHIP =
  "cursor-pointer rounded-full border-[1.5px] border-line bg-white px-[0.95rem] py-[0.45rem] font-body text-s90 leading-[normal] font-medium text-ink-soft aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white";

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
      className={cn("mb-8 flex flex-wrap gap-2 not-js:hidden", className)}
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
