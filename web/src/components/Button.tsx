import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "tailwind-variants/config";
import { cn, tv } from "@/lib/cn";
import { isExternal } from "@/lib/routes";

// Values come from the "Buttons" section of msca-design/COMPONENTS.md.
// Hover lifts the button by 1px; a disabled button stays flat.
export const buttonStyles = tv({
  base: [
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-transparent",
    "font-body text-base leading-none font-semibold no-underline",
    "motion-safe:transition-[translate,background-color,box-shadow] motion-safe:duration-150 motion-safe:ease-[ease]",
    "hover:-translate-y-px",
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0",
  ],
  variants: {
    variant: {
      primary:
        "bg-red text-white shadow-[0_6px_18px_rgba(193,39,45,0.28)] hover:bg-red-dark",
      ghost: "border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
    },
    size: {
      md: "px-[1.35rem] py-[0.85rem]",
      // tailwind-merge drops an earlier leading-* when a later text-* size follows,
      // so the small size repeats leading-none after its own font size.
      sm: "px-[1.05rem] py-[0.6rem] text-[0.92rem] leading-none",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

type Styles = VariantProps<typeof buttonStyles>;

type AsLink = Styles &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string };
type AsButton = Styles &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

export type ButtonProps = AsLink | AsButton;

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, href, ...rest } = props;
    const classes = cn(buttonStyles({ variant, size }), className);
    // next/link adds the base path to internal routes; external URLs stay plain anchors.
    return isExternal(href) ? (
      <a className={classes} href={href} {...rest} />
    ) : (
      <Link className={classes} href={href} {...rest} />
    );
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
