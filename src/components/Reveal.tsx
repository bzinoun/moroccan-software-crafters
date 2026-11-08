"use client";

import {
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";
import { cn } from "@/lib/cn";
import { usePorts } from "@/lib/ports";

type RevealProps = ComponentPropsWithoutRef<"div"> & {
  /** The element to render, so a card, list item or article keeps its own box. */
  as?: "div" | "li" | "article" | "section";
};

// Spec: the "Reveal" entry in msca-design/COMPONENTS.md.
// Fade-in on scroll: the content starts 16px low and transparent, then rises
// to rest once, when it comes within 60px of the viewport bottom.
// The server HTML carries no reveal state, so the content shows without
// JavaScript. Once mounted, the effect sets `data-reveal` to `"waiting"` and the
// observer sets it to `"shown"`. Both states sit behind `motion-safe:`, so a visitor
// who prefers reduced motion always sees the content at rest. The fade belongs
// to the shown state only: hiding on mount is instant, with no fade out.
// Content already within the reveal zone at mount is never concealed, so it does
// not paint, vanish and fade back in.
export function Reveal({
  as = "div",
  className,
  children,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;
  const { viewport } = usePorts();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !viewport.canWatch()) return;
    if (viewport.topOf(element) < viewport.height() - 60) return;
    element.dataset.reveal = "waiting";
    const unwatch = viewport.watch(
      element,
      { rootMargin: "0px 0px -60px 0px" },
      () => {
        element.dataset.reveal = "shown";
        unwatch();
      },
    );
    return unwatch;
  }, [viewport]);

  return (
    <Tag
      ref={ref}
      className={cn(
        "motion-safe:data-[reveal=shown]:transition-[opacity,translate] motion-safe:data-[reveal=shown]:duration-600 motion-safe:data-[reveal=shown]:ease-standard motion-safe:data-[reveal=waiting]:translate-y-4 motion-safe:data-[reveal=waiting]:opacity-0",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
