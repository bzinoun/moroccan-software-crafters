import type { ComponentProps } from "react";
import { cn, tv } from "@/lib/cn";

// Spec: the "Form primitives" entry in msca-design/COMPONENTS.md.
// The look is shared with `Select` and `TextArea`.
// Focus: green edge and a 3px green halo, plus a transparent focus line that
// forced-colors mode paints. Invalid: red edge, also while focused.
// The normal weight and the normal line height reset what the browser gives a
// form control.
export const controlStyles = tv({
  base: "w-full rounded-sm border-[1.5px] border-line bg-white px-[0.9rem] py-3 font-body text-base leading-[normal] font-normal text-ink focus:border-green focus:ring-3 focus:ring-green/15 focus:outline-hidden aria-invalid:border-red aria-invalid:focus:border-red motion-safe:transition-[border-color,box-shadow] motion-safe:duration-150",
});

/**
 * Native input, controlled or not. Pass `type` (text, email, tel, url, date,
 * number), `name`, `autoComplete`, `required` and the rest as on `<input>`.
 * Put it in a `Field` to get the label, the help and the error wiring.
 */
export function TextInput({
  type = "text",
  className,
  ...props
}: ComponentProps<"input">) {
  // Preflight removes the inner padding of a date field, which makes it 2px
  // shorter than the other controls: restore their 48px.
  return (
    <input
      type={type}
      className={cn(controlStyles(), type === "date" && "min-h-12", className)}
      {...props}
    />
  );
}
