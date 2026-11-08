import { describe, expect, it } from "vitest";
import { loadSite } from "@/content/load";
import robots, { dynamic } from "./robots";

describe("robots", () => {
  it("is prerendered for the static export", () => {
    expect(dynamic).toBe("force-static");
  });

  it("allows every crawler and points to the sitemap of the site", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${loadSite().baseUrl}/sitemap.xml`,
    });
  });
});
