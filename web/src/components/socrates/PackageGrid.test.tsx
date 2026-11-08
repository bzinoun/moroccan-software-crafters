import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadSponsoring } from "@/content/load";
import { sponsorPackages } from "@/lib/pages-data";
import { PackageGrid } from "./PackageGrid";

const packages = () => sponsorPackages(loadSponsoring());

function offer(name: string) {
  return screen
    .getByRole("heading", { level: 3, name })
    .closest("article") as HTMLElement;
}

describe("PackageGrid", () => {
  it("shows the three levels in order with their prices", () => {
    render(<PackageGrid packages={packages()} />);
    const names = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(names).toEqual(["Supporter", "Partenaire", "Partenaire principal"]);
    expect(offer("Supporter")).toHaveTextContent("15 000 MAD");
    expect(offer("Partenaire")).toHaveTextContent("35 000 MAD");
    expect(offer("Partenaire principal")).toHaveTextContent("70 000 MAD");
  });

  it("lists what each level includes", () => {
    render(<PackageGrid packages={packages()} />);
    const supporter = offer("Supporter");
    expect(
      within(supporter).getByRole("heading", {
        level: 4,
        name: "Ce qui est inclus",
      }),
    ).toBeInTheDocument();
    const items = within(supporter).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual([
      "Logo sur le site et les visuels de l'édition",
      "1 place participant pour un membre de votre équipe",
      "Remerciement dans l'annonce et le récap LinkedIn",
    ]);
    expect(within(offer("Partenaire")).getAllByRole("listitem")).toHaveLength(
      6,
    );
    expect(
      within(offer("Partenaire principal")).getAllByRole("listitem"),
    ).toHaveLength(6);
  });

  it("flags the historic level and the single main partner", () => {
    render(<PackageGrid packages={packages()} />);
    expect(offer("Partenaire")).toHaveTextContent("Le niveau historique");
    expect(offer("Partenaire principal")).toHaveTextContent(
      "Un seul par édition",
    );
    expect(offer("Supporter")).not.toHaveTextContent("Le niveau historique");
    expect(offer("Supporter")).not.toHaveTextContent("Un seul par édition");
  });

  it("highlights only the historic level, with the filled button", () => {
    render(<PackageGrid packages={packages()} />);
    expect(offer("Partenaire")).toHaveClass("border-sage");
    expect(offer("Supporter")).not.toHaveClass("border-sage");
    const filled = within(offer("Partenaire")).getByRole("link");
    const ghost = within(offer("Supporter")).getByRole("link");
    expect(filled).toHaveClass("bg-red");
    expect(ghost).not.toHaveClass("bg-red");
    expect(ghost).toHaveClass("border-white");
  });

  it("links every 'Choisir ce niveau' to the form and names the package in data-level", () => {
    render(<PackageGrid packages={packages()} />);
    const links = screen.getAllByRole("link", { name: "Choisir ce niveau" });
    expect(links).toHaveLength(3);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "#sponsor-form",
      "#sponsor-form",
      "#sponsor-form",
    ]);
    expect(links.map((a) => a.getAttribute("data-level"))).toEqual([
      "supporter",
      "partenaire",
      "principal",
    ]);
  });

  it("falls back to 'Sur devis' for a package without a price", () => {
    render(
      <PackageGrid
        packages={[
          { ...packages()[0], id: "x", name: "Sur mesure", price: "Sur devis" },
        ]}
      />,
    );
    expect(offer("Sur mesure")).toHaveTextContent("Sur devis");
  });
});
