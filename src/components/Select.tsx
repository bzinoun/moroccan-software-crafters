import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlStyles } from "./TextInput";

/** Native select, controlled or not. Pass the `<option>` elements as children. */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlStyles(), className)} {...props} />;
}
