import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants/config";
import { cn, tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "Eyebrow, Lead, SectionHead, SectionFoot" entry in msca-design/COMPONENTS.md.
// The intro paragraph under a title: 1.15rem, soft ink, 60 characters wide.
// The bottom margin comes from the base layer rule for paragraphs.
export const leadStyles = tv({
  base: "max-w-[60ch] text-[1.15rem]",
  variants: {
    tone: {
      default: "text-ink-soft",
      dark: "text-on-dark",
    },
  },
  defaultVariants: { tone: "default" },
});

type LeadProps = VariantProps<typeof leadStyles> &
  ComponentPropsWithoutRef<"p">;

export function Lead({ tone, className, children, ...props }: LeadProps) {
  return (
    <p className={cn(leadStyles({ tone }), className)} {...props}>
      {typeof children === "string" ? frenchSpacing(children) : children}
    </p>
  );
}
