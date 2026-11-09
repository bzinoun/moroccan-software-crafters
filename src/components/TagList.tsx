import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

type TagListProps = Omit<ComponentPropsWithoutRef<"ul">, "children"> & {
  /** Topics of an event or an article. Nothing renders when empty or missing. */
  tags?: readonly string[];
  /** Show only the first `max` tags (feature card 4, timeline 6). */
  max?: number;
};

// Spec: the "TagList" entry in msca-design/COMPONENTS.md.
// Pills of topics. The default margins are 0.2rem above and 1rem below; the
// timeline and the article cards pass their own through `className`.
export function TagList({ tags, max, className, ...props }: TagListProps) {
  if (!tags || tags.length === 0) return null;
  const shown = max === undefined ? tags : tags.slice(0, max);
  return (
    <ul
      role="list"
      className={cn(
        "mt-[0.2rem] mb-4 flex list-none flex-wrap gap-1.5 p-0",
        className,
      )}
      {...props}
    >
      {shown.map((tag, index) => (
        <li
          key={`${index}-${tag}`}
          className="rounded-full bg-paper-2 px-[9px] py-[3px] text-s76 text-ink-soft"
        >
          {frenchSpacing(tag)}
        </li>
      ))}
    </ul>
  );
}
