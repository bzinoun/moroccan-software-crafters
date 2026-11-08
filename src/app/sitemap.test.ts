import { describe, expect, it } from "vitest";
import { loadArticles, loadSite } from "@/content/load";
import type { PageId } from "@/content/types";
import { pageRoute } from "@/lib/routes";
import sitemap, { dynamic } from "./sitemap";

// A Record forces this list to name every page id: a new page id fails the typecheck here.
const PAGE_IDS = Object.keys({
  home: true,
  meetup: true,
  socrates: true,
  news: true,
  association: true,
  host: true,
} satisfies Record<PageId, true>) as PageId[];

const { baseUrl } = loadSite();
const urls = () => sitemap().map((entry) => entry.url);

describe("sitemap", () => {
  it("is prerendered for the static export", () => {
    expect(dynamic).toBe("force-static");
  });

  it("lists every page route with an absolute URL", () => {
    expect(urls()).toEqual(
      expect.arrayContaining(
        PAGE_IDS.map((id) => `${baseUrl}${pageRoute(id)}`),
      ),
    );
  });

  it("lists the page of every article", () => {
    const articlePages = loadArticles().items.map(
      (a) => `${baseUrl}/actualites/${a.slug}/`,
    );
    expect(articlePages.length).toBeGreaterThan(0);
    expect(urls()).toEqual(expect.arrayContaining(articlePages));
  });

  it("lists nothing else than the pages and the articles", () => {
    expect(urls()).toHaveLength(PAGE_IDS.length + loadArticles().items.length);
  });

  it("dates the page of an article by the date of the article", () => {
    const dated = Object.fromEntries(
      sitemap().map((entry) => [entry.url, entry.lastModified]),
    );
    for (const a of loadArticles().items) {
      expect(dated[`${baseUrl}/actualites/${a.slug}/`]).toBe(a.date);
    }
  });

  it("gives no date to a page that has none", () => {
    const entry = sitemap().find((e) => e.url === `${baseUrl}/meetup/`);
    expect(entry?.lastModified).toBeUndefined();
  });

  it("has no duplicate URL and every URL ends with a slash", () => {
    const list = urls();
    expect(new Set(list).size).toBe(list.length);
    expect(list.filter((url) => !url.endsWith("/"))).toEqual([]);
  });
});
