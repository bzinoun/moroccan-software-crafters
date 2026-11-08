import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { md } from "@/lib/md";
import { Prose } from "./Prose";

// First lines of the body of content/articles.json, article
// "sg-gscm-qui-est-responsable-quand-l-ia-ecrit-le-code".
const BODY =
  "Ce samedi, les Moroccan Software Crafters étaient reçus par Société Générale.\n\n## La vitesse est un multiplicateur\n\nL'IA livre plus vite.\n\n- tests\n- documentation\n\n1. lire\n2. tester\n\n> Savoir dire non.\n\nUn `merge` et un [lien](https://example.com/a).";

describe("Prose", () => {
  it("renders the elements of the Markdown output", () => {
    render(<Prose>{md(BODY)}</Prose>);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "La vitesse est un multiplicateur",
      }),
    ).toBeInTheDocument();
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(2);
    expect(
      within(lists[0]!)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["tests", "documentation"]);
    expect(screen.getByText("merge").tagName).toBe("CODE");
    expect(screen.getByRole("link", { name: "lien" })).toHaveAttribute(
      "href",
      "https://example.com/a",
    );
  });

  it("restores the list markers that the reset removes", () => {
    render(<Prose data-testid="prose">{md(BODY)}</Prose>);
    const classes = screen.getByTestId("prose").className;
    expect(classes).toContain("[&_ul]:list-disc");
    expect(classes).toContain("[&_ol]:list-decimal");
  });

  it("keeps a caller class and renders nothing inside for empty content", () => {
    render(
      <Prose data-testid="prose" className="mt-4">
        {md("")}
      </Prose>,
    );
    const prose = screen.getByTestId("prose");
    expect(prose).toHaveClass("mt-4");
    expect(prose).toBeEmptyDOMElement();
  });
});
