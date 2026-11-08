import type { ComponentProps } from "react";
import { cn, tv } from "@/lib/cn";

// The white card that holds a lead form (the host funnel and the SoCraTes
// sponsor form): round corners, white background, ink text, a raised look. The ink
// text stays on the card inside a dark section. The funnel is `roomy`, the
// sponsor panel `snug`.

const panelStyles = tv({
  base: "rounded-[20px] bg-white text-ink shadow-lift",
  variants: {
    spacing: {
      roomy: "px-4.5 py-5.5 sm:p-8",
      snug: "p-7",
    },
  },
  defaultVariants: { spacing: "roomy" },
});

type FormPanelProps = ComponentProps<"div"> & {
  spacing?: "roomy" | "snug";
};

export function FormPanel({ spacing, className, ...props }: FormPanelProps) {
  return <div className={cn(panelStyles({ spacing }), className)} {...props} />;
}
