import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { StatItem } from "@/lib/home-data";
import { StatsBand } from "./StatsBand";

// A fixture written here: the band draws the figures it gets, in order.
const ITEMS: StatItem[] = [
  { value: "7", label: "événements depuis 2020" },
  { value: "3", label: "entreprises hôtes" },
  { value: "~90", label: "inscrits par meetup" },
  { value: "1\u202f234", label: "abonnés" },
  { value: "2", label: "éditions" },
];

function renderBand(items: StatItem[] = ITEMS) {
  return render(<StatsBand items={items} />);
}

describe("StatsBand", () => {
  it("renders a region named Chiffres clés holding a list with one item per figure", () => {
    renderBand();
    const region = screen.getByRole("region", { name: "Chiffres clés" });
    expect(within(region).getByRole("list")).toBeInTheDocument();
    expect(within(region).getAllByRole("listitem")).toHaveLength(ITEMS.length);
  });

  it("shows each figure with its label, in the given order", () => {
    renderBand();
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(
      ITEMS.map((item) => `${item.value}${item.label}`),
    );
  });

  it("sets each figure apart from its label so the number can be styled alone", () => {
    renderBand();
    const first = screen.getAllByRole("listitem")[0]!;
    const figure = within(first).getByText("7");
    const label = within(first).getByText("événements depuis 2020");
    expect(label).not.toBe(figure);
    expect(first).toContainElement(label);
  });

  it("renders no item when there is no figure", () => {
    renderBand([]);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("uses a narrow no-break space before punctuation in a label", () => {
    renderBand([{ value: "1", label: "Déjà 1 : bravo" }]);
    // getByText would collapse U+202F into a plain space, so read textContent.
    expect(screen.getByRole("listitem").textContent).toBe(
      "1Déjà 1\u202f: bravo",
    );
  });
});

describe("StatsBand without a figure", () => {
  it("renders nothing", () => {
    const { container } = renderBand([]);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("StatsBand list semantics", () => {
  it("keeps the list role explicit, Safari drops it when the list style is none", () => {
    renderBand();
    expect(screen.getByRole("list")).toHaveAttribute("role", "list");
  });
});
