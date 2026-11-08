import { cn, tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { PageLink } from "./PageLink";
import { Reveal } from "./Reveal";

// Spec: the "CardGrid, Card" entry in msca-design/COMPONENTS.md.

export type CardItem = {
  title: string;
  text: string;
  /** A route (`/meetup/#proposer`) or an external URL. */
  href?: string;
  /** Link text; the arrow is added. Default "En savoir plus". */
  label?: string;
};

const DEFAULT_LABEL = "En savoir plus";

const cardStyles = tv({
  slots: {
    card: "rounded-card border px-5.5 py-6",
    title: "mb-[0.4rem] text-s115",
    text: "m-0 text-s95",
  },
  variants: {
    tone: {
      light: { card: "border-line bg-white", text: "text-ink-soft" },
      dark: {
        card: "border-white/16 bg-white/5",
        title: "text-white",
        text: "text-on-dark",
      },
    },
  },
  defaultVariants: { tone: "light" },
});

type CardProps = CardItem & {
  /** `dark` for a card inside a dark `Section`. */
  tone?: "light" | "dark";
  className?: string;
};

export function Card({ title, text, href, label, tone, className }: CardProps) {
  const styles = cardStyles({ tone });
  const linkClass = "mt-3 inline-block text-s90 font-semibold";
  // An empty label or href counts as a missing one.
  const linkText = `${frenchSpacing(label || DEFAULT_LABEL)} →`;
  return (
    <Reveal as="article" className={cn(styles.card(), className)}>
      <h3 className={styles.title()}>{frenchSpacing(title)}</h3>
      <p className={styles.text()}>{frenchSpacing(text)}</p>
      {href ? (
        <PageLink className={linkClass} href={href}>
          {linkText}
        </PageLink>
      ) : null}
    </Reveal>
  );
}

// Columns are mobile first. Three columns use six tracks from `lg`: each card spans two, so an
// incomplete last row stays centered (two left over: columns 2 to 5; one:
// columns 3 and 4). On the two-column layout between `sm` and `lg`, a lone
// last card takes the whole row.
const gridStyles = tv({
  base: "grid grid-cols-1 gap-5",
  variants: {
    columns: {
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-2 lg:grid-cols-6 lg:*:col-span-2 lg:[&>:last-child:nth-child(3n+1)]:col-start-3 sm:max-lg:[&>:last-child:nth-child(odd)]:col-span-full lg:[&>:nth-last-child(2):nth-child(3n+1)]:col-start-2",
      4: "sm:grid-cols-2 lg:grid-cols-4",
    },
  },
});

type CardGridProps = {
  items: readonly CardItem[];
  columns: 2 | 3 | 4;
  /** `dark` for cards inside a dark `Section`. */
  tone?: "light" | "dark";
  className?: string;
};

export function CardGrid({ items, columns, tone, className }: CardGridProps) {
  if (items.length === 0) return null;
  return (
    <div className={cn(gridStyles({ columns }), className)}>
      {items.map((item, index) => (
        <Card key={`${index}-${item.title}`} {...item} tone={tone} />
      ))}
    </div>
  );
}
