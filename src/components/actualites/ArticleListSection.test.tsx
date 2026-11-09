import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ArticleCard } from "@/lib/pages-data";
import { ArticleListSection } from "./ArticleListSection";

const articles: ArticleCard[] = ["one", "two", "three"].map((slug, i) => ({
  slug,
  href: `/actualites/${slug}/`,
  kind: "Annonce",
  title: `Article ${slug}`,
  excerpt: `Excerpt ${slug}`,
  dateLabel: "24 octobre 2026",
  coverSrc: null,
  tags: [],
  lead: i === 0,
}));

function renderList() {
  return render(
    <ArticleListSection
      eyebrow="News"
      title="Recaps, news, calls."
      lead="What the round tables said, and what comes next."
      articles={articles}
    />,
  );
}

describe("ArticleListSection", () => {
  it("shows the page title as the only level 1 heading", () => {
    renderList();
    expect(
      screen.getByRole("heading", { level: 1, name: "Recaps, news, calls." }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("shows the eyebrow and the lead", () => {
    renderList();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(
      screen.getByText("What the round tables said, and what comes next."),
    ).toBeInTheDocument();
  });

  it("is a section named by the page title", () => {
    const { container } = renderList();
    expect(screen.getByRole("region", { name: "Recaps, news, calls." })).toBe(
      container.querySelector("section"),
    );
  });

  it("names each card with a level 2 heading, with no level skipped", () => {
    renderList();
    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(articles.map((a) => a.title));
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  it("lists one article per card", () => {
    renderList();
    expect(screen.getAllByRole("article")).toHaveLength(articles.length);
  });
});
