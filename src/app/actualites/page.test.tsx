import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadArticles } from "@/content/load";
import { frenchSpacing } from "@/lib/french";
import NewsPage, { metadata } from "./page";

const articles = loadArticles();

describe("/actualites/ page", () => {
  it("sets the title and description of the news page from the content", () => {
    expect(metadata.title).toBe(articles.meta.title);
    expect(metadata.description).toBe(articles.meta.description);
  });

  it("shares the news page under its own title with the lead as description", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: articles.meta.title,
      description: articles.lead,
    });
  });

  it("renders the title and one card per article", () => {
    render(<NewsPage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: frenchSpacing(articles.title),
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(articles.items.length);
  });
});
