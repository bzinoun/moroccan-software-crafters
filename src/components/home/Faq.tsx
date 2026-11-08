import type { ComponentPropsWithoutRef } from "react";
import { cn, tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { Section } from "../Section";
import { SectionHead } from "../SectionHead";

type FaqItem = { q: string; a: string };

// Native details and summary: no state, Enter and Space work in the browser.
// The plus is a span that assistive technology skips, not generated content,
// so a screen reader does not read it; the open details turns it 45 degrees.
const faqStyles = tv({
  slots: {
    item: "group border-b",
    summary:
      "flex cursor-pointer list-none justify-between gap-4 py-4.5 text-s105 font-semibold [&::-webkit-details-marker]:hidden",
    icon: "shrink-0 text-2xl leading-none group-open:rotate-45 motion-safe:transition-[rotate] motion-safe:duration-200",
    answer: "mb-4.5",
  },
  variants: {
    tone: {
      default: {
        item: "border-line",
        icon: "text-green",
        answer: "text-ink-soft",
      },
      dark: {
        item: "border-white/16",
        icon: "text-sage",
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
  if (items.length === 0) return null;
  return (
    <div className={cn("mx-auto max-w-205", className)} {...props}>
      {items.map(({ q, a }, index) => (
        <details key={`${index}-${q}`} className={styles.item()}>
          <summary className={styles.summary()}>
            {frenchSpacing(q)}
            <span aria-hidden="true" className={styles.icon()}>
              +
            </span>
          </summary>
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
// The #faq section: centered head, then the question list. No question, no section.
export function Faq({ eyebrow, title, items }: FaqProps) {
  if (items.length === 0) return null;
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
