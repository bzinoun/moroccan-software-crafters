import type { Scroller } from "@/lib/ports/scroller";

export type Scroll = { id: string; behavior: ScrollBehavior };

/** A scroller that records where the page was asked to go. */
export function inMemoryScroller() {
  const scrolls: Scroll[] = [];
  const scroller: Scroller = {
    toElement(id, behavior) {
      scrolls.push({ id, behavior });
    },
  };
  return { ...scroller, scrolls };
}
