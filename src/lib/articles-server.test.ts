import { describe, expect, it } from "vitest";
import type { Articles } from "@/content/types";
import { articleBySlug, articleSlugs } from "./articles-server";

const articles = {
  items: [
    { slug: "old", date: "2026-01-01" },
    { slug: "recap", date: "2026-10-24" },
    { slug: "news", date: "2026-10-27" },
  ],
} as Articles;

describe("articleSlugs and articleBySlug", () => {
  it("lists the slugs in file order", () => {
    expect(articleSlugs(articles)).toEqual(["old", "recap", "news"]);
  });

  it("finds an article by slug, or returns undefined", () => {
    expect(articleBySlug("recap", articles)?.date).toBe("2026-10-24");
    expect(articleBySlug("nope", articles)).toBeUndefined();
  });

  it("reads content/articles.json when no articles are given", () => {
    const slugs = articleSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(articleBySlug(slug)?.slug).toBe(slug);
    }
  });
});
