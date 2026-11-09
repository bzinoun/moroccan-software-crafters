import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FamilyItem } from "@/lib/pages-data";
import { FamilyGrid } from "./FamilyGrid";

// Items as `socratesFamily` gives them (logo url final), written by hand.
const ITEMS: FamilyItem[] = [
  {
    id: "socrates-de",
    name: "SoCraTes",
    country: "Allemagne",
    logoSrc: "/assets/img/socrates/socrates-de.png",
  },
  {
    id: "socrates-fr",
    name: "SoCraTes FR",
    country: "France",
    logoSrc: "/assets/img/socrates/socrates-fr.png",
  },
  {
    id: "itake",
    name: "I T.A.K.E.",
    country: "Roumanie",
    logoSrc: "/assets/img/socrates/itake.png",
  },
];

describe("FamilyGrid", () => {
  it("lists every event of the family, in order, with name and country", () => {
    render(<FamilyGrid items={ITEMS} />);
    const rows = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(rows).toHaveLength(ITEMS.length);
    expect(rows[0]).toHaveTextContent("SoCraTesAllemagne");
    expect(rows[1]).toHaveTextContent("SoCraTes FRFrance");
    expect(rows[2]).toHaveTextContent("I T.A.K.E.Roumanie");
  });

  it("shows a decorative, lazy logo with the given url", () => {
    const { container } = render(<FamilyGrid items={ITEMS} />);
    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(ITEMS.length);
    expect(imgs[0]).toHaveAttribute(
      "src",
      "/assets/img/socrates/socrates-de.png",
    );
    expect(imgs[2]).toHaveAttribute("src", "/assets/img/socrates/itake.png");
    for (const img of imgs) {
      expect(img).toHaveAttribute("alt", "");
      expect(img).toHaveAttribute("loading", "lazy");
    }
  });
});

describe("FamilyGrid with no item", () => {
  it("renders nothing: no empty list", () => {
    const { container } = render(<FamilyGrid items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("FamilyGrid layout", () => {
  // jsdom has no layout: the wrapping, centered rows are the only contract,
  // so the test checks the two classes that make them (no start indent either).
  it("wraps the cards in centered rows, so a short last row sits in the middle", () => {
    render(<FamilyGrid items={ITEMS} />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("flex-wrap", "justify-center");
    expect(list).not.toHaveClass("pl-10");
  });
});
