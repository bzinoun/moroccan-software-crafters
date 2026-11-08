import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

// The old `.wrap`: `min(1180px, 100% - 32px)` wide and centered. A width of
// `100% - 32px` capped by `max-w-wrap` gives the same box.
export function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-[calc(100%-32px)] max-w-wrap", className)}
      {...props}
    />
  );
}
