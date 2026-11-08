import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants/config";
import { cn, tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "FactList" entry in msca-design/COMPONENTS.md.
// A row of figures: a big value and a short label in a bordered cell. Two
// columns on mobile, four from `sm`. The tracks are `1fr`, not `minmax(0,1fr)`:
// a column grows to its widest value, so "9 h 30 → 14 h" never overflows its
// cell at 375px (`grid-cols-2` would use `minmax(0,1fr)`). Inside `PageHero`
// pass `sm:grid-cols-[repeat(2,1fr)]` in `className` to keep two columns.
const factListStyles = tv({
  slots: {
    list: "m-0 grid list-none grid-cols-[repeat(2,1fr)] gap-3.5 p-0 sm:grid-cols-[repeat(4,1fr)]",
    item: "rounded-sm border px-4 py-3.5",
    value:
      "block font-display text-s160 leading-[1.1] font-semibold whitespace-nowrap",
    label: "text-s84",
  },
  variants: {
    tone: {
      light: {
        item: "border-line bg-white",
        value: "text-green",
        label: "text-ink-soft",
      },
      dark: {
        item: "border-white/16 bg-white/5",
        value: "text-sage",
        label: "text-[#cfc7bb]",
      },
    },
  },
  defaultVariants: { tone: "light" },
});

export type Fact = {
  /** The figure, as printed: "50", "0 MAD", "9 h 30 → 14 h". */
  value: string;
  /** What the figure counts. */
  label: string;
};

type FactListProps = VariantProps<typeof factListStyles> &
  Omit<ComponentPropsWithoutRef<"ul">, "children"> & {
    items: readonly Fact[];
  };

export function FactList({ items, tone, className, ...props }: FactListProps) {
  if (items.length === 0) return null;
  const styles = factListStyles({ tone });
  return (
    <ul role="list" className={cn(styles.list(), className)} {...props}>
      {items.map((fact) => (
        <li key={fact.label + fact.value} className={styles.item()}>
          <b className={styles.value()}>{frenchSpacing(fact.value)}</b>
          <span className={styles.label()}>{frenchSpacing(fact.label)}</span>
        </li>
      ))}
    </ul>
  );
}
