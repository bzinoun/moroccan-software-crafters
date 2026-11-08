import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OffersSection } from "./OffersSection";

// Props are the real values of content/offers.json, written out as literals.
const items = [
  {
    id: "communautaire",
    name: "Hôte communautaire",
    price: "Gratuit",
    tagline:
      "Le format historique : vous ouvrez vos portes, on s'occupe du reste.",
    youProvide: [
      "Une salle de 40 à 80 places, un samedi matin",
      "Wifi, écran ou projecteur",
      "Café et petit-déjeuner",
    ],
    weProvide: [
      "Organisation, inscriptions Luma et accueil",
      "Annonce et récap sur LinkedIn (3 600+ abonnés)",
      "Facilitation : flash talks, marketplace, cercles",
      "Mot d'accueil de 10 min pour votre équipe",
    ],
  },
  {
    id: "partenaire",
    name: "Meetup partenaire",
    price: "À partir de 12 000 MAD",
    highlight: true,
    badge: "Nouveau",
    tagline:
      "Un meetup ouvert à la communauté, porté par votre marque employeur.",
    youProvide: [
      "Le financement de l'édition",
      "Une salle si vous en avez une (sinon on en trouve une)",
    ],
    weProvide: [
      "Tout le format communautaire",
      "Co-branding de l'affiche, de la page Luma et du récap",
      "Un talk de 20 min pour un de vos experts",
      "Un espace recrutement pendant le networking",
      "Bilan post-événement : inscriptions, présence, thèmes discutés",
    ],
  },
  {
    id: "prive",
    name: "Craft session privée",
    price: "À partir de 25 000 MAD",
    tagline: "Le format meetup, animé pour vos équipes tech, sur vos sujets.",
    youProvide: [
      "Vos équipes (15 à 80 personnes)",
      "Une demi-journée en semaine ou le samedi",
    ],
    weProvide: [
      "Préparation avec vos tech leads",
      "Animation par des crafters de la communauté",
      "Open space, coding dojo ou kata au choix (IA et qualité, TDD, legacy…)",
      "Synthèse écrite des cercles et des actions",
    ],
  },
];

const props = {
  eyebrow: "Accueillir un meetup",
  title: "Trois façons de recevoir la communauté.",
  lead: "Le meetup communautaire reste gratuit. Les formules payantes financent l'association et SoCraTes Maroc.",
  note: "Tarifs indicatifs hors taxes, ajustés selon le nombre de participants et la logistique.",
  items,
};

describe("OffersSection", () => {
  it("is the #offres anchor, named by its title", () => {
    render(<OffersSection {...props} />);
    const region = screen.getByRole("region", {
      name: "Trois façons de recevoir la communauté.",
    });
    expect(region).toHaveAttribute("id", "offres");
  });

  it("shows the eyebrow, the lead and the pricing note", () => {
    render(<OffersSection {...props} />);
    expect(screen.getByText("Accueillir un meetup")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Le meetup communautaire reste gratuit. Les formules payantes financent l'association et SoCraTes Maroc.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tarifs indicatifs hors taxes, ajustés selon le nombre de participants et la logistique.",
      ),
    ).toBeInTheDocument();
  });

  it("takes the eyebrow marker out of the layout so the centered label stays centered", () => {
    render(<OffersSection {...props} />);
    expect(screen.getByText("Accueillir un meetup")).toHaveClass(
      "before:hidden",
    );
  });

  it("renders one card per offer, in file order, with a level 3 name", () => {
    render(<OffersSection {...props} />);
    const names = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(names).toEqual([
      "Hôte communautaire",
      "Meetup partenaire",
      "Craft session privée",
    ]);
  });
});
