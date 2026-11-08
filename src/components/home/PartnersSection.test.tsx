import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadCompanies, loadEvents } from "@/content/load";
import { logoWallTiles } from "@/lib/derive";
import { PartnersSection } from "./PartnersSection";

const companies = loadCompanies();
const tiles = logoWallTiles(companies.items, loadEvents());

function renderPartners() {
  return render(
    <PartnersSection
      eyebrow={companies.eyebrow}
      title={companies.title}
      lead={companies.lead}
      tiles={tiles}
      sticker={companies.sticker.host}
    />,
  );
}

describe("PartnersSection", () => {
  it("is the #partenaires section on the alternate background", () => {
    const { container } = renderPartners();
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "partenaires");
    expect(section).toHaveClass("bg-sage-soft");
  });

  it("takes the eyebrow marker out of the layout so the centered label stays centered", () => {
    renderPartners();
    expect(screen.getByText("Ils nous font confiance")).toHaveClass(
      "before:hidden",
    );
  });

  it("opens with the centered head of content/companies.json", () => {
    renderPartners();
    expect(screen.getByText("Ils nous font confiance")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Les entreprises qui ont ouvert leurs portes ou soutenu la communauté.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "En accueillant un meetup un samedi matin, ou en finançant une édition de SoCraTes Maroc.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the 16 companies of companies.json, then the host sticker", () => {
    const { container } = renderPartners();
    const wall = container.querySelector("#logo-wall") as HTMLElement;
    expect(within(wall).getAllByRole("img")).toHaveLength(16);
    expect(
      within(wall).getByRole("link", { name: /Votre logo ici/ }),
    ).toHaveAttribute("href", "/accueillir/");
  });

  it("ends with a link to the host funnel and a link to the SoCraTes sponsoring", () => {
    renderPartners();
    expect(
      screen.getByRole("link", { name: "Rejoindre les hôtes" }),
    ).toHaveAttribute("href", "/accueillir/");
    expect(
      screen.getByRole("link", { name: "Soutenir SoCraTes Maroc" }),
    ).toHaveAttribute("href", "/socrates/#sponsoring");
  });
});
