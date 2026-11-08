import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "ZoomSplit, NumberedList" entry in msca-design/COMPONENTS.md; port
// of `.numbered`. An ordered list: a green-outlined circle with the counter,
// then a bold title and its text. The circle is decorative (the list already
// numbers its items), so the counter is concealed from assistive technology.

export type NumberedItem = { title: string; text: string };

type NumberedListProps = {
  /** `loadMeetup().marketplace.steps`. */
  items: readonly NumberedItem[];
  className?: string;
};

export function NumberedList({ items, className }: NumberedListProps) {
  if (items.length === 0) return null;
  return (
    <ol role="list" className={cn("m-0 grid list-none gap-4 p-0", className)}>
      {items.map((item, i) => (
        <li
          key={item.title}
          className="grid grid-cols-[44px_1fr] items-start gap-3.5"
        >
          <span
            aria-hidden="true"
            className="grid size-10 -rotate-6 place-items-center rounded-full border-2 border-green font-display text-[1.2rem] font-semibold text-green"
          >
            {i + 1}
          </span>
          <div>
            <strong className="block text-[1.05rem]">
              {frenchSpacing(item.title)}
            </strong>
            <span className="text-[0.95rem] text-ink-soft">
              {frenchSpacing(item.text)}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
