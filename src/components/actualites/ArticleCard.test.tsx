import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadArticles } from "@/content/load";
import { articleCards } from "@/lib/pages-data";
import { ArticleCard } from "./ArticleCard";

// content/articles.json, newest first: the announcement, then three recaps.
const cards = articleCards(loadArticles());
const [announce, recap] = cards as [(typeof cards)[0], (typeof cards)[0]];

describe("ArticleCard", () => {
  it("is one link to the article route with the title as its name", () => {
    render(<ArticleCard article={recap} />);
    const link = screen.getByRole("link", {
      name: "Qui est responsable quand l'IA écrit le code ?",
    });
    expect(link).toHaveAttribute(
      "href",
      "/actualites/sg-gscm-qui-est-responsable-quand-l-ia-ecrit-le-code/",
    );
  });

  it("shows the kind, the long date, the excerpt and the tags", () => {
    render(<ArticleCard article={recap} />);
    const card = screen.getByRole("article");
    expect(within(card).getByText("Récap")).toBeInTheDocument();
    expect(within(card).getByText(/24 octobre 2026/)).toBeInTheDocument();
    expect(
      within(card).getByText(/Chez Société Générale GSCM, 110 inscrits/),
    ).toBeInTheDocument();
    expect(
      within(card)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["IA", "Responsabilité", "Sécurité"]);
  });

  it("shows the cover as a decorative lazy image", () => {
    const { container } = render(<ArticleCard article={recap} />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
    );
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("renders a card without cover and tags as text only", () => {
    const bare = { ...recap, coverSrc: null, tags: [] };
    const { container } = render(<ArticleCard article={bare} />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("marks the lead card with a full-row class and a larger title", () => {
    render(<ArticleCard article={announce} />);
    expect(announce.lead).toBe(true);
    expect(screen.getByRole("article")).toHaveClass("col-span-full");
    expect(screen.getByRole("heading", { level: 3 })).toHaveClass(
      "text-[1.9rem]",
    );
  });

  it("does not span the row for a regular card", () => {
    render(<ArticleCard article={recap} />);
    expect(recap.lead).toBe(false);
    expect(screen.getByRole("article")).not.toHaveClass("col-span-full");
  });
});
