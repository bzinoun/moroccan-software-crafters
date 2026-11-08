import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadCompanies, loadSponsoring } from "@/content/load";
import { trustLogos } from "@/lib/home-data";
import { LogoRow } from "./LogoRow";

// Props come from the real content files, as the sponsor call passes them.
const logos = () => trustLogos(loadSponsoring(), loadCompanies().items);

describe("LogoRow", () => {
  it("is a named group of the trusted partners", () => {
    render(
      <LogoRow
        logos={logos()}
        aria-label="Partenaires présents à chaque édition"
      />,
    );
    expect(
      screen.getByRole("group", {
        name: "Partenaires présents à chaque édition",
      }),
    ).toBeInTheDocument();
  });

  it("shows one logo per company in the order of sponsoring.json trust.ids", () => {
    render(<LogoRow logos={logos()} aria-label="Partenaires" />);
    // content/sponsoring.json trust.ids: mckinsey, maltem, inwi, keiken, gemography.
    // Keiken is shown with its display name.
    const images = within(screen.getByRole("group")).getAllByRole("img");
    expect(images.map((img) => img.getAttribute("alt"))).toEqual([
      "McKinsey & Company",
      "Maltem Africa",
      "inwi",
      "Keiken digital solutions",
      "Gemography",
    ]);
    expect(images.map((img) => img.getAttribute("src"))).toEqual([
      "/assets/img/logos/mckinsey.png",
      "/assets/img/logos/maltem.png",
      "/assets/img/logos/inwi.png",
      "/assets/img/logos/keiken.png",
      "/assets/img/logos/gemography.png",
    ]);
  });

  it("replaces a logo whose file cannot be loaded by its named monogram", () => {
    render(<LogoRow logos={logos()} aria-label="Partenaires" />);
    fireEvent.error(screen.getByRole("img", { name: "Maltem Africa" }));
    const monogram = screen.getByRole("img", { name: "Maltem Africa" });
    expect(monogram.tagName).toBe("SPAN");
    expect(monogram).toHaveTextContent("MA");
    expect(within(screen.getByRole("group")).getAllByRole("img")).toHaveLength(
      5,
    );
  });

  it("gives each logo its name as a title and loads it lazily", () => {
    render(<LogoRow logos={logos()} aria-label="Partenaires" />);
    const keiken = screen.getByRole("img", {
      name: "Keiken digital solutions",
    });
    expect(keiken).toHaveAttribute("title", "Keiken digital solutions");
    expect(keiken).toHaveAttribute("loading", "lazy");
  });

  it("falls back to the monogram when a company has no logo file", () => {
    render(
      <LogoRow
        logos={[
          { id: "acme", name: "Acme Corp", logoSrc: null, monogram: "AC" },
        ]}
        aria-label="Partenaires"
      />,
    );
    const fallback = screen.getByRole("img", { name: "Acme Corp" });
    expect(fallback.tagName).toBe("SPAN");
    expect(fallback).toHaveTextContent("AC");
    expect(fallback).toHaveAttribute("title", "Acme Corp");
  });

  it("renders an empty group without logos", () => {
    render(<LogoRow logos={[]} aria-label="Partenaires" />);
    expect(screen.getByRole("group")).toBeEmptyDOMElement();
  });

  it("merges the class name of the caller after its own", () => {
    render(
      <LogoRow logos={[]} aria-label="Partenaires" className="mt-3.5 mb-4.5" />,
    );
    expect(screen.getByRole("group")).toHaveClass(
      "flex",
      "flex-wrap",
      "justify-center",
      "mt-3.5",
      "mb-4.5",
    );
  });
});
