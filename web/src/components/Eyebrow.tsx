import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants/config";
import { cn, tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "Eyebrow, Lead, SectionHead, SectionFoot" entry in msca-design/COMPONENTS.md.
// The small capitalized label above a title. The marker before the text is a
// pseudo-element: a 22px by 2px rule, or the 14px eight-point star (khatam)
// for SoCraTes content. On dark surfaces the marker takes the text color.
export const eyebrowStyles = tv({
  base: "mb-4 inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.08em] uppercase",
  variants: {
    tone: {
      default: "text-red before:bg-red",
      dark: "text-sage before:bg-current",
      cream: "text-cream before:bg-current",
    },
    marker: {
      rule: "before:h-0.5 before:w-[22px] before:content-['']",
      khatam:
        "before:size-3.5 before:content-[''] before:[clip-path:polygon(50%_0%,64.6%_14.6%,85.4%_14.6%,85.4%_35.4%,100%_50%,85.4%_64.6%,85.4%_85.4%,64.6%_85.4%,50%_100%,35.4%_85.4%,14.6%_85.4%,14.6%_64.6%,0%_50%,14.6%_35.4%,14.6%_14.6%,35.4%_14.6%)]",
      // Tailwind gives any before: utility a content value, so the empty
      // pseudo-element would stay a flex item. Remove it from the layout.
      none: "before:hidden",
    },
  },
  defaultVariants: { tone: "default", marker: "rule" },
});

type EyebrowProps = VariantProps<typeof eyebrowStyles> &
  ComponentPropsWithoutRef<"p">;

export function Eyebrow({
  tone,
  marker,
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <p className={cn(eyebrowStyles({ tone, marker }), className)} {...props}>
      {typeof children === "string" ? frenchSpacing(children) : children}
    </p>
  );
}
