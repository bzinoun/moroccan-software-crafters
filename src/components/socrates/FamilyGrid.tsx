import { frenchSpacing } from "@/lib/french";
import type { FamilyItem } from "@/lib/pages-data";
import { Photo } from "../Photo";

// Spec: the "FamilyGrid" entry in msca-design/COMPONENTS.md; port of `.family`.
// The old list kept the browser defaults for a list (a 40px start padding and a
// 17px bottom margin): the port keeps them so the cards sit where they did.

type FamilyGridProps = {
  /** `socratesFamily(loadSocrates())`: the logo url is final, base path included. */
  items: readonly FamilyItem[];
};

export function FamilyGrid({ items }: FamilyGridProps) {
  return (
    <ul
      role="list"
      className="mt-0 mb-[17px] grid list-none grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3.5 pl-10"
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-card border border-line bg-white px-2.5 pt-4 pb-3 text-center"
        >
          <Photo
            src={item.logoSrc}
            alt=""
            width={72}
            height={72}
            className="mx-auto mb-2 size-18 object-contain"
          />
          <b className="block text-[0.85rem] font-semibold">
            {frenchSpacing(item.name)}
          </b>
          <span className="text-[0.76rem] text-muted">
            {frenchSpacing(item.country)}
          </span>
        </li>
      ))}
    </ul>
  );
}
