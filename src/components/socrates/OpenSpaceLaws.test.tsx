import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadSocrates } from "@/content/load";
import { socratesLaws } from "@/lib/pages-data";
import { OpenSpaceLaws } from "./OpenSpaceLaws";

// Props come from content/socrates.json (openspace.laws), as the page passes them.
const laws = () => socratesLaws(loadSocrates());

describe("OpenSpaceLaws", () => {
  it("is an ordered list of the four laws, titles as level 3 headings", () => {
    render(<OpenSpaceLaws laws={laws()} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(
      within(items[0]).getByRole("heading", {
        level: 3,
        name: "Qui que soient les gens qui viennent, ce sont les bonnes personnes.",
      }),
    ).toBeInTheDocument();
    expect(items[0]).toHaveTextContent(
      "Une session à trois peut être la meilleure du week-end.",
    );
  });

  it("keeps the order of the JSON", () => {
    render(<OpenSpaceLaws laws={laws()} />);
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual([
      "Qui que soient les gens qui viennent, ce sont les bonnes personnes.",
      "Quoi qu'il arrive, c'est la seule chose qui pouvait arriver.",
      "Ça commence quand ça commence.",
      "La loi des deux pieds.",
    ]);
  });

  it("sets the last law apart on the deep green band", () => {
    render(<OpenSpaceLaws laws={laws()} />);
    const items = screen.getAllByRole("listitem");
    expect(items[3]).toHaveClass("bg-green-deep");
    expect(items[3]).toHaveTextContent("La loi des deux pieds.");
    for (const item of items.slice(0, 3)) {
      expect(item).not.toHaveClass("bg-green-deep");
    }
  });
});
