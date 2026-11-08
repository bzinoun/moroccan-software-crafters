import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadArticles } from "@/content/load";
import { articleCards } from "@/lib/pages-data";
import { ArticleGrid } from "./ArticleGrid";

describe("ArticleGrid", () => {
  it("renders one card per article, newest first, each linking to its route", () => {
    render(<ArticleGrid articles={articleCards(loadArticles())} />);
    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/actualites/appel-partenaires-socrates-5e-edition/",
      "/actualites/sg-gscm-qui-est-responsable-quand-l-ia-ecrit-le-code/",
      "/actualites/axa-craftsmanship-a-l-ere-de-l-ia/",
      "/actualites/innovx-l-impact-reel-de-l-ia/",
    ]);
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("makes only the first card a lead card", () => {
    render(<ArticleGrid articles={articleCards(loadArticles())} />);
    const [first, ...others] = screen.getAllByRole("article");
    expect(first).toHaveClass("col-span-full");
    for (const card of others) expect(card).not.toHaveClass("col-span-full");
  });

  it("renders nothing without articles", () => {
    const { container } = render(<ArticleGrid articles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
