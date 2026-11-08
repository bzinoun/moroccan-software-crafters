import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LawItem } from "@/lib/pages-data";
import { OpenSpaceLaws } from "./OpenSpaceLaws";

// Laws as `socratesLaws` gives them: the last one is the main law.
const LAWS: LawItem[] = [
  { title: "Première loi.", text: "Texte de la première.", main: false },
  { title: "Deuxième loi.", text: "Texte de la deuxième.", main: false },
  {
    title: "La loi des deux pieds.",
    text: "Texte de la dernière.",
    main: true,
  },
];

describe("OpenSpaceLaws", () => {
  it("is an ordered list of the laws, titles as level 3 headings", () => {
    render(<OpenSpaceLaws laws={LAWS} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(LAWS.length);
    expect(
      within(items[0]!).getByRole("heading", {
        level: 3,
        name: "Première loi.",
      }),
    ).toBeInTheDocument();
    expect(items[0]).toHaveTextContent("Texte de la première.");
  });

  it("keeps the given order", () => {
    render(<OpenSpaceLaws laws={LAWS} />);
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual([
      "Première loi.",
      "Deuxième loi.",
      "La loi des deux pieds.",
    ]);
  });

  it("sets the main law apart from the others", () => {
    render(<OpenSpaceLaws laws={LAWS} />);
    const items = screen.getAllByRole("listitem");
    expect(items[2]).toHaveClass("bg-green-deep");
    for (const item of items.slice(0, 2)) {
      expect(item).not.toHaveClass("bg-green-deep");
    }
  });
});
