import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

/**
 * The error box of a form. It stays in the page with `role="alert"` and hides
 * itself with the matching attribute while it has no message, so a message that
 * arrives later is announced. Children may hold a link.
 */
export function FormAlert({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const empty = children == null || children === false || children === "";
  return (
    <div
      role="alert"
      hidden={empty}
      className={cn(
        "mt-4 rounded-sm bg-[#fdecec] px-3.5 py-3 text-s92 text-red-dark",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? frenchSpacing(children) : children}
    </div>
  );
}
