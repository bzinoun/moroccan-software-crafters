import { tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import type { LawItem } from "@/lib/pages-data";

// Spec: the "OpenSpaceLaws" entry in msca-design/COMPONENTS.md.
// The counter is a CSS counter on the list (the number is not in the text), so
// the ordered list keeps its own numbering for assistive technology. The main law
// (the last one) takes both columns from `md` on the deep green.
const lawStyles = tv({
  slots: {
    item: "relative rounded-card border pt-7 pr-6.5 pb-6.5 pl-19.5 before:absolute before:top-6.5 before:left-5.5 before:grid before:size-9.5 before:-rotate-8 before:place-items-center before:rounded-full before:border-2 before:font-display before:font-semibold before:content-[counter(law)] before:[counter-increment:law]",
    title: "font-display-italic",
    text: "m-0",
  },
  variants: {
    main: {
      false: {
        item: "border-line bg-white before:border-green before:text-green",
        title: "text-s125",
        text: "text-s95 text-ink-soft",
      },
      true: {
        item: "border-green-deep bg-green-deep text-cream before:border-sage before:text-sage md:col-span-full md:pr-[15%]",
        title: "text-s170 text-white",
        text: "text-s102 text-on-dark",
      },
    },
  },
  defaultVariants: { main: false },
});

type OpenSpaceLawsProps = {
  /** `socratesLaws(loadSocrates())`: the last law is flagged `main`. */
  laws: readonly LawItem[];
};

export function OpenSpaceLaws({ laws }: OpenSpaceLawsProps) {
  if (laws.length === 0) return null;
  return (
    <ol
      role="list"
      className="m-0 grid list-none gap-5 p-0 [counter-reset:law] md:grid-cols-2"
    >
      {laws.map((law, index) => {
        const styles = lawStyles({ main: law.main });
        return (
          <li key={`${index}-${law.title}`} className={styles.item()}>
            <h3 className={styles.title()}>{frenchSpacing(law.title)}</h3>
            <p className={styles.text()}>{frenchSpacing(law.text)}</p>
          </li>
        );
      })}
    </ol>
  );
}
