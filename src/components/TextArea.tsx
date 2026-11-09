import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlStyles } from "./TextInput";

/** Native textarea, controlled or not: at least 96px high, vertical handle only. */
export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(controlStyles(), "min-h-24 resize-y", className)}
      {...props}
    />
  );
}
