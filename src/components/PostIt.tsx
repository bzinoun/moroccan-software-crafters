import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants/config";
import { cn, tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "PostIt" entry in msca-design/COMPONENTS.md.
// The hand-made note: Caveat 1.35rem, ink on a post-it color, square corners.
// The parent sets rotation, position and width through `className`.
// The line height is an arbitrary property, not `leading-*`: tailwind-merge
// drops a `leading-*` utility when a caller adds a text size, and an arbitrary
// property is never merged away.
const postItStyles = tv({
  base: "w-[170px] p-[16px_18px_20px] font-hand text-s135 [line-height:1.15] text-ink shadow-postit",
  variants: {
    color: {
      yellow: "bg-postit-yellow",
      pink: "bg-postit-pink",
      green: "bg-postit-green",
      blue: "bg-postit-blue",
      orange: "bg-postit-orange",
    },
  },
  defaultVariants: { color: "yellow" },
});

type PostItProps = VariantProps<typeof postItStyles> &
  ComponentPropsWithoutRef<"div"> & {
    /** Small line under the text, in the body font (the year on a topic note). */
    caption?: string;
  };

export function PostIt({
  color,
  caption,
  className,
  children,
  ...props
}: PostItProps) {
  return (
    <div className={cn(postItStyles({ color }), className)} {...props}>
      {typeof children === "string" ? frenchSpacing(children) : children}
      {caption ? (
        <small className="mt-1.5 block font-body text-[0.7rem] tracking-[0.02em] text-ink-soft">
          {frenchSpacing(caption)}
        </small>
      ) : null}
    </div>
  );
}
