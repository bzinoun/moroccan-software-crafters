import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Sticker } from "@/content/types";
import type { LogoTile } from "@/lib/derive";
import { PartnersSection } from "./PartnersSection";

// Fixtures written here: the section draws the head, tiles and sticker it gets.
const TILES: LogoTile[] = [
  {
    id: "acme",
    name: "Acme Corp",
    label: "Hôte d'un meetup",
    href: "https://www.linkedin.com/company/acme/",
    logoSrc: "/assets/img/logos/acme.png",
    monogram: "AC",
    hosted: 1,
    sponsored: 0,
  },
  {
    id: "globex",
    name: "Globex Solutions",
    label: "Partenaire SoCraTes",
    href: null,
    logoSrc: "/assets/img/logos/globex.png",
    monogram: "GS",
    hosted: 0,
    sponsored: 1,
  },
  {
    id: "initech",
    name: "Initech",
    label: "",
    href: null,
    logoSrc: null,
    monogram: "IN",
    hosted: 0,
    sponsored: 0,
  },
];
const STICKER: Sticker = {
  title: "Votre logo ici ?",
  text: "Recevez la communauté.",
  label: "Accueillir un meetup",
  href: "/accueillir/",
};
const HEAD = {
  eyebrow: "Ils nous font confiance",
  title: "Les entreprises qui nous soutiennent.",
  lead: "En accueillant un meetup, ou en finançant une édition.",
};

function renderPartners() {
  return render(<PartnersSection {...HEAD} tiles={TILES} sticker={STICKER} />);
}

describe("PartnersSection", () => {
  it("is the #partenaires section", () => {
    const { container } = renderPartners();
    expect(container.querySelector("section")).toHaveAttribute(
      "id",
      "partenaires",
    );
  });

  it("opens with the eyebrow, the title as a level 2 heading and the lead", () => {
    renderPartners();
    expect(screen.getByText(HEAD.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: HEAD.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(HEAD.lead)).toBeInTheDocument();
  });

  it("shows one tile per company, then the host sticker", () => {
    const { container } = renderPartners();
    const section = container.querySelector("section") as HTMLElement;
    const sticker = within(section).getByRole("link", {
      name: /Votre logo ici/,
    });
    expect(sticker).toHaveAttribute("href", "/accueillir/");
    const wall = sticker.parentElement as HTMLElement;
    expect(wall.children).toHaveLength(TILES.length + 1);
    expect(wall.lastElementChild).toBe(sticker);
    for (const tile of TILES) {
      expect(within(wall).getByText(tile.name)).toBeInTheDocument();
    }
    expect(wall.querySelectorAll("img")).toHaveLength(
      TILES.filter((tile) => tile.logoSrc).length,
    );
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
