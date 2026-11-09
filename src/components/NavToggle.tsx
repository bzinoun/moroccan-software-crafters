"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// One bar of the burger. When the menu is open the bars morph into a cross:
// the outer two move 7px toward the middle and rotate, the middle one fades.
const bar =
  "block h-0.5 w-6 bg-ink motion-safe:transition-[translate,rotate,opacity] motion-safe:duration-200 motion-safe:ease-standard";

// The mobile menu: a native disclosure, so it opens and closes with no script
// and the browser exposes its state to assistive technology. The script only
// adds what a disclosure lacks: Escape closes it and returns the focus to the
// summary, and a click on a link closes it (a link to the page itself does not
// reload). The nav links come from the server component as children. Below
// `lg` the panel sits under the header; from `lg` up this whole component is
// gone and the header shows its own row of links.
export function NavToggle({ children }: { children: ReactNode }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      const details = detailsRef.current;
      if (event.key !== "Escape" || !details?.open) return;
      details.open = false;
      summaryRef.current?.focus();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a") && detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  return (
    <details ref={detailsRef} className="group ml-auto lg:hidden">
      <summary
        ref={summaryRef}
        className="flex size-11 cursor-pointer list-none flex-col items-center justify-center gap-[5px] [&::-webkit-details-marker]:hidden"
      >
        <span className="sr-only">Menu</span>
        <span
          aria-hidden="true"
          className={cn(
            bar,
            "group-open:translate-y-[7px] group-open:rotate-45",
          )}
        ></span>
        <span
          aria-hidden="true"
          className={cn(bar, "group-open:opacity-0")}
        ></span>
        <span
          aria-hidden="true"
          className={cn(
            bar,
            "group-open:-translate-y-[7px] group-open:-rotate-45",
          )}
        ></span>
      </summary>
      <nav
        className="absolute inset-x-0 top-18 flex flex-col border-b border-line bg-paper px-4 pt-2 pb-4 shadow-lift"
        aria-label="Navigation principale"
        onClick={closeOnLink}
      >
        {children}
      </nav>
    </details>
  );
}
