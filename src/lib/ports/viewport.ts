// Port: where an element sits in the viewport, and when it comes into view.

export type Unwatch = () => void;

export type Viewport = {
  /** Height of the viewport, in px. */
  height(): number;
  /** Distance from the top of the viewport to the top of the element, in px. */
  topOf(element: Element): number;
  /** False when the browser cannot report visibility: the content then just shows. */
  canWatch(): boolean;
  /** Calls `onVisible` when the element enters the viewport. Returns the stop function. */
  watch(
    element: Element,
    options: { rootMargin: string },
    onVisible: () => void,
  ): Unwatch;
};

type ObserverConstructor = new (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) => Pick<IntersectionObserver, "observe" | "disconnect">;

/**
 * The viewport on top of an IntersectionObserver class. `observerClass` is read
 * at each call, and a test passes an in-memory class in place of the browser one.
 */
export function observerViewport(
  observerClass: () => ObserverConstructor | undefined,
): Viewport {
  return {
    height: () => window.innerHeight,
    topOf: (element) => element.getBoundingClientRect().top,
    canWatch: () => observerClass() !== undefined,
    watch(element, { rootMargin }, onVisible) {
      const Observer = observerClass();
      if (Observer === undefined) return () => {};
      const observer = new Observer(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) onVisible();
        },
        { rootMargin },
      );
      observer.observe(element);
      return () => observer.disconnect();
    },
  };
}

export const browserViewport = observerViewport(() =>
  typeof IntersectionObserver === "undefined"
    ? undefined
    : IntersectionObserver,
);
