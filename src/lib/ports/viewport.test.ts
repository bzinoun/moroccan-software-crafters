import { describe, expect, it } from "vitest";
import { observerViewport } from "./viewport";

// An observer class that keeps what the adapter gives it and lets a test send entries.
class InMemoryObserver {
  static instances: InMemoryObserver[] = [];
  observed: Element[] = [];
  disconnected = false;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    InMemoryObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  disconnect() {
    this.disconnected = true;
  }

  send(...flags: boolean[]) {
    const entries = flags.map((isIntersecting) => ({ isIntersecting }));
    this.callback(entries as IntersectionObserverEntry[], this as never);
  }
}

function setup() {
  InMemoryObserver.instances = [];
  const viewport = observerViewport(() => InMemoryObserver);
  const visits: string[] = [];
  const element = document.createElement("div");
  const stop = viewport.watch(
    element,
    { rootMargin: "0px 0px -60px 0px" },
    () => visits.push("visible"),
  );
  return {
    viewport,
    visits,
    element,
    stop,
    observer: InMemoryObserver.instances[0]!,
  };
}

describe("observerViewport", () => {
  it("watches the element with the root margin it is given", () => {
    const { element, observer } = setup();
    expect(observer.observed).toEqual([element]);
    expect(observer.options).toEqual({ rootMargin: "0px 0px -60px 0px" });
  });

  it("ignores an entry that does not intersect", () => {
    const { observer, visits } = setup();
    observer.send(false);
    expect(visits).toEqual([]);
  });

  it("calls back when an entry intersects", () => {
    const { observer, visits } = setup();
    observer.send(false, true);
    expect(visits).toEqual(["visible"]);
  });

  it("disconnects the observer when it is stopped", () => {
    const { observer, stop } = setup();
    stop();
    expect(observer.disconnected).toBe(true);
  });

  it("cannot watch where the browser has no observer class", () => {
    const viewport = observerViewport(() => undefined);
    expect(viewport.canWatch()).toBe(false);
    const stop = viewport.watch(
      document.createElement("div"),
      { rootMargin: "0px" },
      () => {},
    );
    expect(() => stop()).not.toThrow();
  });

  it("can watch where the browser has an observer class", () => {
    expect(observerViewport(() => InMemoryObserver).canWatch()).toBe(true);
  });
});
