import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Two fields side by side from `sm` (old query 600px), stacked below. */
export function FieldRow({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)} {...props} />
  );
}
