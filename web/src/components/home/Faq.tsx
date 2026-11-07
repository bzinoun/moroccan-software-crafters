import type { ComponentPropsWithoutRef } from "react";
import { cn, tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";

type FaqItem = { q: string; a: string };

// Native details and summary: no state, Enter and Space work in the browser.
// The plus is the ::after of the summary; the open details turns it 45 degrees.
const faqStyles = tv({
  slots: {
    item: "group border-b",
    summary: [
      "flex cursor-pointer list-none justify-between gap-4 py-4.5 text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden",
      "after:shrink-0 after:text-2xl after:leading-none after:content-['+']",
      "group-open:after:rotate-45 motion-safe:after:transition-[rotate] motion-safe:after:duration-200",
    ],
    answer: "mb-4.5",
  },
  variants: {
    tone: {
      default: {
        item: "border-line",
        summary: "after:text-green",
        answer: "text-ink-soft",
      },
      dark: {
        item: "border-white/14",
        summary: "after:text-sage",
        answer: "text-on-dark",
      },
    },
  },
  defaultVariants: { tone: "default" },
});

type FaqListProps = {
  /** `loadHome().faq.items`. Answers are plain text. */
  items: FaqItem[];
  /** `dark` inside a dark `Section`: translucent lines, on-dark answers, sage plus. */
  tone?: "default" | "dark";
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

export function FaqList({
  items,
  tone = "default",
  className,
  ...props
}: FaqListProps) {
  const styles = faqStyles({ tone });
  return (
    <div className={cn("mx-auto max-w-[820px]", className)} {...props}>
      {items.map(({ q, a }) => (
        <details key={q} className={styles.item()}>
          <summary className={styles.summary()}>{frenchSpacing(q)}</summary>
          <p className={styles.answer()}>{frenchSpacing(a)}</p>
        </details>
      ))}
    </div>
  );
}

type FaqProps = {
  eyebrow: string;
  title: string;
  /** `loadHome().faq.items`. */
  items: FaqItem[];
};

// Spec: the "Faq, FaqItem" entry in msca-design/COMPONENTS.md.
// The #faq section of index.html: centered head, then the question list.
export function Faq({ eyebrow, title, items }: FaqProps) {
  return (
    <Section variant="alt" id="faq" aria-labelledby="faq-title">
      <SectionHead
        align="center"
        eyebrow={eyebrow}
        title={title}
        titleId="faq-title"
      />
      <FaqList items={items} />
    </Section>
  );
}
