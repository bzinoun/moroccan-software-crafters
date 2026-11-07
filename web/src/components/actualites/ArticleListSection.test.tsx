import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadArticles } from "@/content/load";
import { articleCards } from "@/lib/pages-data";
import { ArticleListSection } from "./ArticleListSection";

// content/articles.json, eyebrow, title and lead.
const articles = loadArticles();

function renderList() {
  return render(
    <ArticleListSection
      eyebrow={articles.eyebrow}
      title={articles.title}
      lead={articles.lead}
      articles={articleCards(articles)}
    />,
  );
}

describe("ArticleListSection", () => {
  it("shows the page title as the only level 1 heading", () => {
    renderList();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Récaps, annonces, appels.",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("shows the eyebrow and the lead", () => {
    renderList();
    expect(screen.getByText("Actualités")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ce qui s'est dit dans les tables rondes, et ce qui se prépare.",
      ),
    ).toBeInTheDocument();
  });

  it("lists the four articles", () => {
    renderList();
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  // The old `[data-page="news"] main > .section:first-child` rule drew the
  // zellige corner on the first section of the list.
  it("draws the zellige corner on its section", () => {
    const { container } = renderList();
    expect(container.querySelector("section")).toHaveClass("zellige-corner");
  });
});
