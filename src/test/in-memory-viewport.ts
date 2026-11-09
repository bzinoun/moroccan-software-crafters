import type { Unwatch, Viewport } from "@/lib/ports/viewport";

export type Watch = {
  element: Element;
  rootMargin: string;
  stopped: boolean;
  onVisible: () => void;
};

type Options = {
  /** Top of every element, in px. Default: well below the fold. */
  top?: number;
  /** Viewport height, in px. Default 768. */
  height?: number;
  /** False: the browser cannot report visibility. Default true. */
  canWatch?: boolean;
};

/**
 * A viewport with no layout: every element sits at `top`, and a test decides
 * when the watched elements come into view with `becomeVisible()`.
 */
export function inMemoryViewport(options: Options = {}) {
  let top = options.top ?? 2000;
  const height = options.height ?? 768;
  const canWatch = options.canWatch ?? true;
  const watches: Watch[] = [];
  const viewport: Viewport = {
    height: () => height,
    topOf: () => top,
    canWatch: () => canWatch,
    watch(element, { rootMargin }, onVisible): Unwatch {
      const watch: Watch = { element, rootMargin, stopped: false, onVisible };
      watches.push(watch);
      return () => {
        watch.stopped = true;
      };
    },
  };
  function report(entry: { isIntersecting: boolean }) {
    if (!entry.isIntersecting) return;
    for (const watch of watches.filter((w) => !w.stopped)) watch.onVisible();
  }
  return {
    ...viewport,
    watches,
    placeAt(next: number) {
      top = next;
    },
    /**
     * Reports one observer entry to every running watch. Like the browser
     * adapter, a watch hears about an entry that intersects only. Wrap it in `act`.
     */
    report,
    /** Reports every watch that is still running as in view. Wrap it in `act`. */
    becomeVisible() {
      report({ isIntersecting: true });
    },
  };
}
