import { describe, expect, it } from "vitest";
import { dynamic } from "./sitemap";
import sitemap from "./sitemap";

const BASE = "https://bzinoun.github.io/moroccan-software-crafters";

describe("sitemap", () => {
  it("is prerendered for the static export", () => {
    expect(dynamic).toBe("force-static");
  });

  it("lists the 6 pages and the 4 articles", () => {
    expect(sitemap()).toHaveLength(10);
  });

  it("lists each page with an absolute URL and a trailing slash", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual(
      expect.arrayContaining([
        `${BASE}/`,
        `${BASE}/meetup/`,
        `${BASE}/association/`,
        `${BASE}/actualites/`,
        `${BASE}/socrates/`,
        `${BASE}/accueillir/`,
      ]),
    );
  });

  it("lists an article page", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${BASE}/actualites/innovx-l-impact-reel-de-l-ia/`);
  });

  it("has no duplicate URL and every URL ends with a slash", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.endsWith("/"))).toBe(true);
  });
});
