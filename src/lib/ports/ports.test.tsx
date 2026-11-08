import { render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { inMemoryClock } from "@/test/in-memory-clock";
import { inMemoryStorage } from "@/test/in-memory-storage";
import { browserPorts, PortsProvider, usePorts, type Ports } from ".";
import { browserImageProbe } from "./image-probe";
import { browserMotion, mediaQueryMotion } from "./motion";
import { browserScroller } from "./scroller";
import { browserStorage } from "./key-value-store";
import { browserViewport } from "./viewport";

afterEach(() => window.localStorage.clear());

describe("usePorts", () => {
  it("gives the browser adapters when no provider is above", () => {
    const { result } = renderHook(() => usePorts());
    expect(result.current).toBe(browserPorts);
  });

  it("replaces only the ports that the provider names", () => {
    const clock = inMemoryClock(new Date(2026, 10, 7));
    const wrapper = ({ children }: { children: ReactNode }) => (
      <PortsProvider ports={{ clock }}>{children}</PortsProvider>
    );
    const { result } = renderHook(() => usePorts(), { wrapper });
    expect(result.current.clock).toBe(clock);
    expect(result.current.storage).toBe(browserPorts.storage);
  });

  it("lets an inner provider override an outer one and keep the rest", () => {
    const outer = inMemoryStorage();
    const inner = inMemoryClock(new Date(2026, 10, 7));
    let seen: Ports | undefined;
    function Probe() {
      seen = usePorts();
      return null;
    }
    render(
      <PortsProvider ports={{ storage: outer }}>
        <PortsProvider ports={{ clock: inner }}>
          <Probe />
        </PortsProvider>
      </PortsProvider>,
    );
    expect(seen?.storage).toBe(outer);
    expect(seen?.clock).toBe(inner);
  });
});

describe("browser adapters", () => {
  it("storage reads and writes the real localStorage", () => {
    browserStorage.setItem("k", "v");
    expect(window.localStorage.getItem("k")).toBe("v");
    expect(browserStorage.getItem("k")).toBe("v");
    browserStorage.removeItem("k");
    expect(browserStorage.getItem("k")).toBeNull();
  });

  it("scroller does nothing for an id that is not in the page", () => {
    expect(() => browserScroller.toElement("missing", "smooth")).not.toThrow();
  });

  it("viewport reports no visibility watch where IntersectionObserver is absent (jsdom)", () => {
    expect(browserViewport.canWatch()).toBe(false);
    expect(browserViewport.height()).toBe(window.innerHeight);
  });

  it("image probe reports an image that has no content as failed", () => {
    expect(
      browserImageProbe.hasFailedToLoad(document.createElement("img")),
    ).toBe(true);
  });

  it("motion treats a browser without matchMedia as reduced motion (jsdom)", () => {
    expect(browserMotion.prefersReducedMotion()).toBe(true);
  });
});

describe("mediaQueryMotion", () => {
  it("asks the reduced-motion query and returns its answer", () => {
    const queries: string[] = [];
    const motion = (reduce: boolean) =>
      mediaQueryMotion(() => (query) => {
        queries.push(query);
        return { matches: reduce };
      });
    expect(motion(true).prefersReducedMotion()).toBe(true);
    expect(motion(false).prefersReducedMotion()).toBe(false);
    expect(queries).toEqual([
      "(prefers-reduced-motion: reduce)",
      "(prefers-reduced-motion: reduce)",
    ]);
  });

  it("reads the function at each call", () => {
    const source: { reader?: (query: string) => { matches: boolean } } = {};
    const motion = mediaQueryMotion(() => source.reader);
    expect(motion.prefersReducedMotion()).toBe(true);
    source.reader = () => ({ matches: false });
    expect(motion.prefersReducedMotion()).toBe(false);
  });
});
