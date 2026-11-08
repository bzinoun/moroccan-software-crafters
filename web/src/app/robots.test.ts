import { describe, expect, it } from "vitest";
import robots, { dynamic } from "./robots";

describe("robots", () => {
  it("is prerendered for the static export", () => {
    expect(dynamic).toBe("force-static");
  });

  it("allows every crawler and points to the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap:
        "https://bzinoun.github.io/moroccan-software-crafters/sitemap.xml",
    });
  });
});
