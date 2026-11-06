"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// One bar of the burger. When the menu is open the bars morph into a cross:
// the outer two move 7px toward the middle and rotate, the middle one fades.
const bar =
  "block h-0.5 w-6 bg-ink motion-safe:transition-[translate,rotate,opacity] motion-safe:duration-200 motion-safe:ease-[ease]";

// Burger button plus the main nav, ported from `initNav` in assets/js/cms.js.
// The nav links come from the server component as children; this component
// only owns the open state. Below `lg` the nav is a panel under the header,
// hidden until `data-open="true"`. From `lg` up it is a row and the burger is hidden.
export function NavToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <>
      <button
        className="group ml-auto flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px] p-0 lg:hidden"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span
          className={cn(
            bar,
            "group-aria-expanded:translate-y-[7px] group-aria-expanded:rotate-45",
          )}
        ></span>
        <span className={cn(bar, "group-aria-expanded:opacity-0")}></span>
        <span
          className={cn(
            bar,
            "group-aria-expanded:-translate-y-[7px] group-aria-expanded:-rotate-45",
          )}
        ></span>
      </button>
      <nav
        className="flex gap-[1.4rem] max-lg:absolute max-lg:inset-x-0 max-lg:top-18 max-lg:hidden max-lg:flex-col max-lg:gap-0 max-lg:border-b max-lg:border-line max-lg:bg-paper max-lg:px-4 max-lg:pt-2 max-lg:pb-4 max-lg:shadow-lift max-lg:data-[open=true]:flex lg:ml-auto"
        id="nav"
        aria-label="Navigation principale"
        data-open={open}
        onClick={closeOnLink}
      >
        {children}
      </nav>
    </>
  );
}
