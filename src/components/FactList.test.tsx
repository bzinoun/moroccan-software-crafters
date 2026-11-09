import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FactList, type Fact } from "./FactList";

const FACTS: Fact[] = [
  { value: "9 h → 14 h", label: "un samedi matin" },
  { value: "~100", label: "inscrits par édition" },
  { value: "50", label: "places sur place" },
  { value: "0 MAD", label: "pour les participants" },
];

describe("FactList", () => {
  it("renders one list item per fact with its value then its label", () => {
    render(<FactList items={FACTS} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(FACTS.length);
    expect(items[0]).toHaveTextContent("9 h → 14 hun samedi matin");
    expect(within(items[3]!).getByText("0 MAD")).toBeInTheDocument();
    expect(within(items[3]!).getByText("pour les participants")).toBeVisible();
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
    expect(item.textContent).toBe("Édition\u202f: 2027Date\u202f: à venir");
  });

  it("gives the dark tone its own value color", () => {
    render(
      <>
        <FactList items={[{ value: "Clair", label: "a" }]} />
        <FactList items={[{ value: "Sombre", label: "b" }]} tone="dark" />
      </>,
    );
    expect(screen.getByText("Clair")).toHaveClass("text-green");
    expect(screen.getByText("Sombre")).toHaveClass("text-sage");
    expect(screen.getByText("Sombre")).not.toHaveClass("text-green");
  });

  it("lets a caller className replace the default wide columns", () => {
    render(<FactList items={FACTS} className="sm:grid-cols-[repeat(2,1fr)]" />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("sm:grid-cols-[repeat(2,1fr)]");
    expect(list).not.toHaveClass("sm:grid-cols-[repeat(4,1fr)]");
  });
});
