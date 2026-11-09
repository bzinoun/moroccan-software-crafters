// Port: scroll the page to an element, by id.

export type Scroller = {
  toElement(id: string, behavior: ScrollBehavior): void;
};

export const browserScroller: Scroller = {
  toElement(id, behavior) {
    // jsdom and old browsers lack scrollIntoView: nothing to scroll then.
    document.getElementById(id)?.scrollIntoView?.({ behavior, block: "start" });
  },
};
