import { describe, expect, it } from "vitest";
import { inMemoryMotion } from "@/test/in-memory-motion";
import { scrollBehavior } from "./motion";

describe("scrollBehavior", () => {
  it("scrolls smoothly when the person accepts motion", () => {
    expect(scrollBehavior(inMemoryMotion(false))).toBe("smooth");
  });

  it("jumps at once when the person asks for reduced motion", () => {
    expect(scrollBehavior(inMemoryMotion(true))).toBe("auto");
  });

  // jsdom has no matchMedia, so the real adapter cannot tell.
  it("jumps at once when matchMedia does not exist", () => {
    expect(window.matchMedia).toBeUndefined();
    expect(scrollBehavior()).toBe("auto");
  });
});
