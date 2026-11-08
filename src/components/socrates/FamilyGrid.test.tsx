import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadSocrates } from "@/content/load";
import { socratesFamily } from "@/lib/pages-data";
import { FamilyGrid } from "./FamilyGrid";

const items = () => socratesFamily(loadSocrates());

describe("FamilyGrid", () => {
  it("lists the nine events of the family with name and country", () => {
    render(<FamilyGrid items={items()} />);
    const rows = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(rows).toHaveLength(9);
    expect(rows[0]).toHaveTextContent("SoCraTesAllemagne");
    expect(rows[1]).toHaveTextContent("SoCraTes FRFrance");
    expect(rows[7]).toHaveTextContent("CodeFreezeFinlande");
    expect(rows[8]).toHaveTextContent("I T.A.K.E.Roumanie");
  });

  it("shows a decorative, lazy logo from assets/img/socrates", () => {
    const { container } = render(<FamilyGrid items={items()} />);
    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(9);
    expect(imgs[0]).toHaveAttribute(
      "src",
      "/assets/img/socrates/socrates-de.png",
    );
    expect(imgs[8]).toHaveAttribute("src", "/assets/img/socrates/itake.png");
    for (const img of imgs) {
      expect(img).toHaveAttribute("alt", "");
      expect(img).toHaveAttribute("loading", "lazy");
    }
  });
});
