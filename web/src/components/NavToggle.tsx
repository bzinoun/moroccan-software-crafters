"use client";

import { useState, type MouseEvent, type ReactNode } from "react";

// Burger button plus the main nav, ported from `initNav` in assets/js/cms.js.
// The nav links come from the server component as children; this component
// only owns the open state.
export function NavToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <>
      <button
        className="nav-toggle"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav
        className={open ? "nav open" : "nav"}
        id="nav"
        aria-label="Navigation principale"
        onClick={closeOnLink}
      >
        {children}
      </nav>
    </>
  );
}
