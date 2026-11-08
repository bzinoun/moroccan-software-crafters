import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NewsPage, { metadata } from "./page";

describe("/actualites/ page", () => {
  it("sets the title and description of the news page", () => {
    expect(metadata.title).toBe("Actualités · Moroccan Software Crafters");
    expect(metadata.description).toBe(
      "Récaps des meetups, annonces et appels à partenaires de Moroccan Software Crafters.",
    );
  });

  it("sets the share tags of the news page", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: "Actualités · Moroccan Software Crafters",
      description:
        "Ce qui s'est dit dans les tables rondes, et ce qui se prépare.",
    });
  });

  it("renders the title and one card per article", () => {
    render(<NewsPage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Récaps, annonces, appels.",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });
});
