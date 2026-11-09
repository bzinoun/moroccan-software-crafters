import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants/config";
import { cn, tv } from "@/lib/cn";
import { Container } from "./Container";

// Spec: the "Section" entry in msca-design/COMPONENTS.md.
// A page band with the site wrap inside. Pages alternate plain and alt.
// The dark variant restyles what the section holds: white h2 and h3, a sage
// emphasis without the hand-drawn mark, a sage focus indicator.
// Eyebrow and lead follow through their own props: `tone="dark"` on
// SectionHead, Eyebrow and Lead. A Button on this surface uses the
// `primary-flat` or `ghost-on-dark` variant.
// Anchor scroll offset: the base layer sets `scroll-padding-top: 84px` on
// `html`, which clears the 72px header for every `id` target.
const sectionStyles = tv({
  base: "",
  variants: {
    variant: {
      plain: "",
      alt: "bg-sage-soft",
      dark: "bg-green-deep text-cream **:focus-visible:outline-sage [&_h2]:text-white [&_h2_em]:bg-none [&_h2_em]:text-sage [&_h3]:text-white",
    },
    tight: {
      true: "py-14",
      false: "py-22",
    },
  },
  defaultVariants: { variant: "plain", tight: false },
});

type SectionProps = VariantProps<typeof sectionStyles> &
  ComponentPropsWithoutRef<"section"> & {
    /** Classes for the `Container` inside the section. */
    containerClassName?: string;
  };

export function Section({
  variant,
  tight,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionStyles({ variant, tight }), className)}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
