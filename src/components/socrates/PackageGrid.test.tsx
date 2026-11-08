import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PackageGrid } from "./PackageGrid";
import { PACKAGES } from "./test-utils";

function offer(name: string) {
  return screen
    .getByRole("heading", { level: 3, name })
    .closest("article") as HTMLElement;
}

describe("PackageGrid", () => {
  it("shows the levels in order with their prices", () => {
    render(<PackageGrid packages={PACKAGES} />);
    const names = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(names).toEqual(["Supporter", "Partenaire", "Partenaire principal"]);
    expect(offer("Supporter")).toHaveTextContent("10000 MAD");
    expect(offer("Partenaire")).toHaveTextContent("20000 MAD");
    expect(offer("Partenaire principal")).toHaveTextContent("40000 MAD");
  });

  it("lists what each level includes", () => {
    render(<PackageGrid packages={PACKAGES} />);
    const supporter = offer("Supporter");
    expect(
      within(supporter).getByRole("heading", {
        level: 4,
        name: "Ce qui est inclus",
      }),
    ).toBeInTheDocument();
    const items = within(supporter).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(PACKAGES[0]!.includes);
    expect(within(offer("Partenaire")).getAllByRole("listitem")).toHaveLength(
      PACKAGES[1]!.includes.length,
    );
  });

  it("shows the badge and the limit of a level only on that level", () => {
    render(<PackageGrid packages={PACKAGES} />);
    expect(offer("Partenaire")).toHaveTextContent("Le niveau historique");
    expect(offer("Partenaire principal")).toHaveTextContent(
      "Un seul par édition",
    );
    expect(offer("Supporter")).not.toHaveTextContent("Le niveau historique");
    expect(offer("Supporter")).not.toHaveTextContent("Un seul par édition");
  });

  it("highlights only the highlighted level", () => {
    render(<PackageGrid packages={PACKAGES} />);
    expect(offer("Partenaire")).toHaveClass("border-sage");
    expect(offer("Supporter")).not.toHaveClass("border-sage");
    expect(offer("Partenaire principal")).not.toHaveClass("border-sage");
  });

  it("links every 'Choisir ce niveau' to the form", () => {
    render(<PackageGrid packages={PACKAGES} />);
    const links = screen.getAllByRole("link", { name: "Choisir ce niveau" });
    expect(links).toHaveLength(PACKAGES.length);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "#sponsor-form",
      "#sponsor-form",
      "#sponsor-form",
    ]);
  });
});

describe("PackageGrid with no package", () => {
  it("renders nothing: no empty grid", () => {
    const { container } = render(<PackageGrid packages={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
