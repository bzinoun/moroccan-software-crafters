import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ArticleCard } from "@/lib/pages-data";
import { ArticleGrid } from "./ArticleGrid";

function card(slug: string, overrides: Partial<ArticleCard> = {}): ArticleCard {
  return {
    slug,
    href: `/actualites/${slug}/`,
    kind: "Récap",
    title: `Title of ${slug}`,
    excerpt: `Excerpt of ${slug}`,
    dateLabel: "24 octobre 2026",
    coverSrc: null,
    tags: [],
    lead: false,
    ...overrides,
  };
}

const articles = [
  card("newest", { lead: true }),
  card("middle"),
  card("oldest"),
];

describe("ArticleGrid", () => {
  it("renders one card per article, in the order given, each linking to its route", () => {
    render(<ArticleGrid articles={articles} />);
    expect(screen.getAllByRole("article")).toHaveLength(articles.length);
    expect(
      screen.getAllByRole("link").map((a) => a.getAttribute("href")),
    ).toEqual(articles.map((a) => a.href));
  });

  it("renders nothing without articles", () => {
    const { container } = render(<ArticleGrid articles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
