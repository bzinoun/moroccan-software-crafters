import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

// Spec: the "Eyebrow, Lead, SectionHead, SectionFoot" entry in msca-design/COMPONENTS.md.
// The centered line of buttons under a section: 36px below the content,
// several buttons share one wrapping row. A paragraph, so the base layer
// paragraph margin applies. The native attribute
// that hides an element works here: Tailwind's reset forces `display: none` for it.
export function SectionFoot({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "mt-9 flex flex-wrap justify-center gap-[0.8rem]",
        className,
      )}
      {...props}
    />
  );
}
