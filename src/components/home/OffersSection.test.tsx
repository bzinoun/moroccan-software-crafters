import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OffersSection } from "./OffersSection";

// A fixture written here: the section draws the head, the note and the offers it gets.
const items = [
  {
    id: "alpha",
    name: "Offre Alpha",
    tagline: "Le format simple.",
    youProvide: ["Une salle"],
    weProvide: ["Organisation et accueil"],
  },
  {
    id: "beta",
    name: "Offre Beta",
    highlight: true,
    badge: "Nouveau",
    tagline: "Un format porté par votre marque.",
    youProvide: ["Le financement"],
    weProvide: ["Tout le format Alpha", "Un talk"],
  },
  {
    id: "gamma",
    name: "Offre Gamma",
    tagline: "Le format, animé pour vos équipes.",
    youProvide: ["Vos équipes"],
    weProvide: ["Préparation", "Synthèse écrite"],
  },
];

const props = {
  eyebrow: "Accueillir un meetup",
  title: "Trois façons de recevoir.",
  lead: "Une formule pour chaque besoin.",
  items,
};

describe("OffersSection", () => {
  it("renders no section, and no orphan heading or note, without an offer", () => {
    const { container } = render(<OffersSection {...props} items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is the #offres anchor, named by its title", () => {
    render(<OffersSection {...props} />);
    const region = screen.getByRole("region", {
      name: props.title,
    });
    expect(region).toHaveAttribute("id", "offres");
  });

  it("shows the eyebrow and the lead", () => {
    render(<OffersSection {...props} />);
    expect(screen.getByText("Accueillir un meetup")).toBeInTheDocument();
    expect(screen.getByText(props.lead)).toBeInTheDocument();
  });

  it("renders one card per offer, in the given order, with a level 3 name", () => {
    render(<OffersSection {...props} />);
    const names = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(names).toEqual(items.map((item) => item.name));
  });
});
