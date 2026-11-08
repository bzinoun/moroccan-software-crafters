import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants/config";
import { cn, tv } from "@/lib/cn";
import { PageLink } from "./PageLink";

// Spec: the "Button" entry under "Built" in msca-design/COMPONENTS.md.
// Hover lifts the button by 1px; a disabled or aria-disabled button stays flat.
const buttonStyles = tv({
  base: [
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-transparent",
    "font-body text-base leading-none font-semibold no-underline",
    "motion-safe:transition-[translate,background-color,box-shadow] motion-safe:duration-150 motion-safe:ease-standard",
    "hover:-translate-y-px",
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0",
    // A busy button is aria-disabled, not disabled, so it keeps the focus.
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-55 aria-disabled:hover:translate-y-0",
  ],
  variants: {
    variant: {
      primary:
        "bg-red text-white shadow-[0_6px_18px] shadow-red/28 hover:bg-red-dark",
      // Red pill without the glow, for a dark surface.
      "primary-flat": "bg-red text-white hover:bg-red-dark",
      // White pill with red text, for the green band.
      inverse: "bg-white text-red hover:bg-paper hover:text-red-dark",
      ghost: "border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
      // Outlined in white, for a dark surface.
      "ghost-on-dark":
        "border-white bg-transparent text-white hover:bg-white hover:text-ink",
    },
    size: {
      md: "px-[1.35rem] py-[0.85rem]",
      // tailwind-merge drops an earlier leading-* when a later text-* size follows,
      // so the small size repeats leading-none after its own font size.
      sm: "px-[1.05rem] py-[0.6rem] text-s92 leading-none",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

type Styles = VariantProps<typeof buttonStyles>;

type AsLink = Styles &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string };
type AsButton = Styles &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonProps = AsLink | AsButton;

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, href, ...rest } = props;
    const classes = cn(buttonStyles({ variant, size }), className);
    return <PageLink className={classes} href={href} {...rest} />;
  }
  const { variant, size, className, type = "button", ...rest } = props;
  return (
    <button
      className={cn(buttonStyles({ variant, size }), className)}
      type={type}
      {...rest}
    />
  );
}
