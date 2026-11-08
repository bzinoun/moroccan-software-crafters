import { afterEach, describe, expect, it, vi } from "vitest";
import { scrollBehavior } from "./motion";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubMatchMedia(reduce: boolean) {
  const matchMedia = vi.fn((query: string) => ({
    matches: reduce && query === "(prefers-reduced-motion: reduce)",
  }));
  vi.stubGlobal("matchMedia", matchMedia);
  return matchMedia;
}

describe("scrollBehavior", () => {
  it("scrolls smoothly when the person accepts motion", () => {
    const matchMedia = stubMatchMedia(false);
    expect(scrollBehavior()).toBe("smooth");
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
  });

  it("jumps at once when the person asks for reduced motion", () => {
    stubMatchMedia(true);
    expect(scrollBehavior()).toBe("auto");
  });

  it("jumps at once when matchMedia does not exist", () => {
    vi.stubGlobal("matchMedia", undefined);
    expect(scrollBehavior()).toBe("auto");
  });
});
