import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FactList, type Fact } from "./FactList";

// content/meetup.json, hero.facts.
const MEETUP_FACTS: Fact[] = [
  { value: "9 h 30 → 14 h", label: "un samedi, toutes les 6 à 8 semaines" },
  { value: "~100", label: "inscrits par édition" },
  { value: "50", label: "places retenues sur place" },
  { value: "0 MAD", label: "pour les participants" },
];

describe("FactList", () => {
  it("renders one list item per fact with its value and its label", () => {
    render(<FactList items={MEETUP_FACTS} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent(
      "9 h 30 → 14 hun samedi, toutes les 6 à 8 semaines",
    );
    expect(within(items[3]).getByText("0 MAD")).toBeInTheDocument();
    expect(within(items[3]).getByText("pour les participants")).toBeVisible();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<FactList items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("puts a narrow no-break space before a colon in a value or a label", () => {
    render(
      <FactList
        items={[{ value: "Édition : 2027", label: "Date : à venir" }]}
      />,
    );
    const item = screen.getByRole("listitem");
    expect(item.textContent).toBe("Édition : 2027Date : à venir");
  });

  it("is a white card with a green value in the light tone", () => {
    render(<FactList items={MEETUP_FACTS} />);
    const item = screen.getAllByRole("listitem")[0];
    expect(item).toHaveClass("bg-card", "border-line");
    expect(within(item).getByText("9 h 30 → 14 h")).toHaveClass("text-green");
  });

  it("is a translucent cell with a sage value in the dark tone", () => {
    render(<FactList items={MEETUP_FACTS} tone="dark" />);
    const item = screen.getAllByRole("listitem")[0];
    expect(item).toHaveClass("bg-white/7", "border-white/16");
    expect(item).not.toHaveClass("bg-card");
    expect(within(item).getByText("9 h 30 → 14 h")).toHaveClass("text-sage");
  });

  it("merges a caller className over the default columns", () => {
    render(
      <FactList
        items={MEETUP_FACTS}
        className="mt-8 sm:grid-cols-[repeat(2,1fr)]"
      />,
    );
    const list = screen.getByRole("list");
    expect(list).toHaveClass("mt-8", "sm:grid-cols-[repeat(2,1fr)]");
    expect(list).not.toHaveClass("sm:grid-cols-[repeat(4,1fr)]");
    expect(list).toHaveClass("grid-cols-[repeat(2,1fr)]");
  });

  it("sizes the columns to their content like the old 1fr tracks, never to equal widths", () => {
    // minmax(0,1fr) (the two equal columns of Tailwind) would clip "9 h 30 → 14 h" at 375px.
    render(<FactList items={MEETUP_FACTS} />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass(
      "grid-cols-[repeat(2,1fr)]",
      "sm:grid-cols-[repeat(4,1fr)]",
    );
    expect(list).not.toHaveClass("grid-cols-2");
    expect(list).not.toHaveClass("sm:grid-cols-4");
  });
});
