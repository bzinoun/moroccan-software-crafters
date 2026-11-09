import { frenchSpacing } from "@/lib/french";
import type { FamilyItem } from "@/lib/pages-data";
import { Photo } from "../Photo";

// Spec: the "OpenSpaceLaws, DayStrip, EditionGrid, FamilyGrid" entry in msca-design/COMPONENTS.md.
// Cards wrap in centered rows: two per row on a phone, five on a wide screen
// (nine cards give 5 + 4), and a short last row sits in the middle.

type FamilyGridProps = {
  /** `socratesFamily(loadSocrates())`: the logo url is final, base path included. */
  items: readonly FamilyItem[];
};

export function FamilyGrid({ items }: FamilyGridProps) {
  if (items.length === 0) return null;
  return (
    <ul
      role="list"
      className="mx-auto mt-0 mb-[17px] flex max-w-[956px] list-none flex-wrap justify-center gap-3.5 pl-0"
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="w-[calc(50%-7px)] rounded-card border border-line bg-white px-2.5 pt-4 pb-3 text-center sm:w-45"
        >
          <Photo
            src={item.logoSrc}
            alt=""
            width={72}
            height={72}
            className="mx-auto mb-2 size-18 object-contain"
          />
          <b className="block text-s85 font-semibold">
            {frenchSpacing(item.name)}
          </b>
          <span className="text-s76 text-muted">
            {frenchSpacing(item.country)}
          </span>
        </li>
      ))}
    </ul>
  );
}
