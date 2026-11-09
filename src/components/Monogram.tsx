import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants/config";
import { cn, tv } from "@/lib/cn";

// Spec: the "PartnersSection, LogoWall, LogoTile, LogoSticker, LogoImage, Monogram" entry in msca-design/COMPONENTS.md.
// The initials tile that stands in for a missing company logo. The initials
// come from `monogram(name)` in src/lib/derive.ts (the first letters of the
// first two words, uppercased); this component only draws them.
const monogramStyles = tv({
  base: "grid place-items-center bg-green-soft font-display font-semibold text-green-dark",
  variants: {
    size: {
      // Logo wall: the 84px logo box.
      lg: "size-21 rounded-card text-s160",
      // Compact logo wall: the 60px logo box.
      md: "size-15 rounded-card text-s120",
      // Logo row: a 56px bordered square; the text keeps the body size.
      sm: "size-14 rounded-xl border border-line",
    },
  },
  defaultVariants: { size: "lg" },
});

type MonogramProps = VariantProps<typeof monogramStyles> &
  Omit<ComponentPropsWithoutRef<"span">, "children"> & {
    initials: string;
    /** Company name. Set it when the name is not printed next to the tile. */
    label?: string;
  };

export function Monogram({
  initials,
  label,
  size,
  className,
  ...props
}: MonogramProps) {
  const accessibility = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);
  return (
    <span
      className={cn(monogramStyles({ size }), className)}
      {...accessibility}
      {...props}
    >
      {initials}
    </span>
  );
}
