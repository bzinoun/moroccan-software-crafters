import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ArticleCard } from "@/lib/pages-data";
import { ArticleTeaser } from "./ArticleTeaser";

const recap: ArticleCard = {
  slug: "recap-one",
  href: "/actualites/recap-one/",
  kind: "Récap",
  title: "Who is responsible when AI writes the code?",
  excerpt: "A hundred registered crafters and one question at the center.",
  dateLabel: "24 octobre 2026",
  coverSrc: "/assets/img/test-cover.jpg",
  tags: ["AI", "Responsibility", "Security"],
  lead: false,
};
const announce: ArticleCard = { ...recap, slug: "call", lead: true };

describe("ArticleTeaser", () => {
  it("is one link to the article route with the title as its name", () => {
    render(<ArticleTeaser article={recap} />);
    expect(screen.getByRole("link", { name: recap.title })).toHaveAttribute(
      "href",
      recap.href,
    );
  });

  it("names the card with a level 2 heading, under the page title", () => {
    render(<ArticleTeaser article={recap} />);
    expect(
      screen.getByRole("heading", { level: 2, name: recap.title }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  it("shows the kind, the date label, the excerpt and the tags", () => {
    render(<ArticleTeaser article={recap} />);
    const card = screen.getByRole("article");
    expect(within(card).getByText("Récap")).toBeInTheDocument();
    expect(within(card).getByText(/24 octobre 2026/)).toBeInTheDocument();
    expect(within(card).getByText(recap.excerpt)).toBeInTheDocument();
    expect(
      within(card)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(recap.tags);
  });

  it("shows the cover as a decorative lazy image", () => {
    const { container } = render(<ArticleTeaser article={recap} />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", recap.coverSrc);
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("renders a card without cover and tags as text only", () => {
    const bare = { ...recap, coverSrc: null, tags: [] };
    const { container } = render(<ArticleTeaser article={bare} />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });

  // The class is the only trace of the lead layout: it spans the full row.
  it("makes the lead card span the full row of the grid", () => {
    render(<ArticleTeaser article={announce} />);
    expect(screen.getByRole("article")).toHaveClass("col-span-full");
  });

  it("does not span the row for a regular card", () => {
    render(<ArticleTeaser article={recap} />);
    expect(screen.getByRole("article")).not.toHaveClass("col-span-full");
  });
});
