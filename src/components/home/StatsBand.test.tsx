import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadEvents, loadHome, loadSite } from "@/content/load";
import { statItems } from "@/lib/home-data";
import { StatsBand } from "./StatsBand";

// Props come from the real content files, as the home page passes them.
function renderBand() {
  const items = statItems(loadHome(), loadSite(), loadEvents());
  return render(<StatsBand items={items} />);
}

describe("StatsBand", () => {
  it("renders a region named Chiffres clés holding a list of five figures", () => {
    renderBand();
    const region = screen.getByRole("region", { name: "Chiffres clés" });
    expect(within(region).getByRole("list")).toBeInTheDocument();
    expect(within(region).getAllByRole("listitem")).toHaveLength(5);
  });

  it("shows each figure with its label, in the order of content/home.json", () => {
    renderBand();
    const items = screen.getAllByRole("listitem");
    // Literals checked by hand: 21 events in events.json, 12 distinct meetup
    // hosts, mean of the last five registrations 110, 51, 119, 89, 157 = 105.2,
    // 3666 LinkedIn followers in site.json (fr-FR thousands separator is the
    // narrow no-break space U+202F), 4 SoCraTes editions.
    expect(items.map((li) => li.textContent)).toEqual([
      "21événements depuis 2019",
      "12entreprises hôtes",
      "~105inscrits par meetup (2025-26)",
      "3 666abonnés LinkedIn",
      "4éditions de SoCraTes Maroc",
    ]);
  });

  it("sets each figure apart from its label so the number can be styled alone", () => {
    renderBand();
    const first = screen.getAllByRole("listitem")[0];
    const figure = within(first).getByText("21");
    expect(figure).toHaveClass("font-display", "text-green");
    expect(within(first).getByText("événements depuis 2019")).not.toBe(figure);
  });

  it("puts the last figure on its own row below md only", () => {
    renderBand();
    const items = screen.getAllByRole("listitem");
    expect(items[4]).toHaveClass("last:col-span-full", "md:last:col-auto");
  });

  it("uses a narrow no-break space before punctuation in a label", () => {
    render(<StatsBand items={[{ value: "1", label: "Déjà 1 : bravo" }]} />);
    // getByText would collapse U+202F into a plain space, so read textContent.
    expect(screen.getByRole("listitem").textContent).toBe(
      "1Déjà 1\u202f: bravo",
    );
  });
});

describe("StatsBand list semantics", () => {
  it("keeps the list role explicit, Safari drops it when the list style is none", () => {
    renderBand();
    expect(screen.getByRole("list")).toHaveAttribute("role", "list");
  });
});
