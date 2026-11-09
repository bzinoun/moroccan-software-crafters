import { frenchSpacing } from "@/lib/french";
import { withKeys } from "@/lib/keys";

// Spec: the "ZoomSplit, NumberedList" entry in msca-design/COMPONENTS.md.
// An ordered list: a green-outlined circle with the counter, then a bold title
// and its text. The circle is decorative (the list already numbers its items),
// so the counter is concealed from assistive technology.

export type NumberedItem = { title: string; text: string };

type NumberedListProps = {
  /** `loadMeetup().marketplace.steps`. */
  items: readonly NumberedItem[];
};

export function NumberedList({ items }: NumberedListProps) {
  if (items.length === 0) return null;
  return (
    <ol role="list" className="m-0 grid list-none gap-4 p-0">
      {withKeys(items, (i) => `${i.title}-${i.text}`).map(
        ({ key, item }, i) => (
          <li
            key={key}
            className="grid grid-cols-[44px_1fr] items-start gap-3.5"
          >
            <span
              aria-hidden="true"
              className="grid size-10 -rotate-6 place-items-center rounded-full border-2 border-green font-display text-s120 font-semibold text-green"
            >
              {i + 1}
            </span>
            <div>
              <strong className="block text-s105">
                {frenchSpacing(item.title)}
              </strong>
              <span className="text-s95 text-ink-soft">
                {frenchSpacing(item.text)}
              </span>
            </div>
          </li>
        ),
      )}
    </ol>
  );
}
