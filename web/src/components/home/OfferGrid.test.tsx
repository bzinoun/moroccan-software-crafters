import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { OfferGrid } from "./OfferGrid";

// Props are the real values of content/offers.json, written out as literals.
const items: Offer[] = [
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

function card(name: string) {
  const heading = screen.getByRole("heading", { level: 3, name });
  const article = heading.closest("article");
  if (!article) throw new Error(`no card around ${name}`);
  return article;
}

describe("OfferGrid cards", () => {
  it("renders one card per offer, in file order, named by a level 3 heading", () => {
    render(<OfferGrid items={items} />);
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual([
      "Hôte communautaire",
      "Meetup partenaire",
      "Craft session privée",
    ]);
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("shows the price exactly as in the JSON and the tagline", () => {
    render(<OfferGrid items={items} />);
    const partner = within(card("Meetup partenaire"));
    expect(partner.getByText("À partir de 12 000 MAD")).toBeInTheDocument();
    expect(
      partner.getByText(
        "Un meetup ouvert à la communauté, porté par votre marque employeur.",
      ),
    ).toBeInTheDocument();
    expect(
      within(card("Hôte communautaire")).getByText("Gratuit"),
    ).toBeInTheDocument();
  });

  it("shows Sur devis when the offer has no price or an empty one", () => {
    const [first] = items;
    render(
      <OfferGrid
        items={[
          { ...first, id: "a", name: "Sans prix", price: undefined },
          { ...first, id: "b", name: "Prix vide", price: "" },
        ]}
      />,
    );
    expect(within(card("Sans prix")).getByText("Sur devis")).toBeVisible();
    expect(within(card("Prix vide")).getByText("Sur devis")).toBeVisible();
  });

  it("puts a narrow no-break space before the colon of the tagline", () => {
    render(<OfferGrid items={items} />);
    const tagline = within(card("Hôte communautaire")).getByText(/Le format/);
    expect(tagline.textContent).toBe(
      "Le format historique : vous ouvrez vos portes, on s'occupe du reste.",
    );
  });
});

describe("OfferGrid lists", () => {
  it("lists what the company brings, then what the community brings", () => {
    render(<OfferGrid items={items} />);
    const community = within(card("Hôte communautaire"));
    expect(
      community.getAllByRole("heading", { level: 4 }).map((h) => h.textContent),
    ).toEqual(["Vous apportez", "Nous apportons"]);

    const [give, get] = community.getAllByRole("list");
    expect(
      within(give)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual([
      "Une salle de 40 à 80 places, un samedi matin",
      "Wifi, écran ou projecteur",
      "Café et petit-déjeuner",
    ]);
    expect(
      within(get)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual([
      "Organisation, inscriptions Luma et accueil",
      "Annonce et récap sur LinkedIn (3 600+ abonnés)".replace(" ", " "),
      "Facilitation : flash talks, marketplace, cercles",
      "Mot d'accueil de 10 min pour votre équipe",
    ]);
  });

  it("gives the give list a yellow bullet and the other list a green one", () => {
    render(<OfferGrid items={items} />);
    const [give, get] = within(card("Hôte communautaire")).getAllByRole("list");
    expect(within(give).getAllByRole("listitem")[0]).toHaveClass(
      "before:bg-postit-yellow",
    );
    expect(within(get).getAllByRole("listitem")[0]).toHaveClass(
      "before:bg-postit-green",
    );
  });
});

describe("OfferGrid badge and highlight", () => {
  it("shows the badge only on the offer that has one", () => {
    render(<OfferGrid items={items} />);
    expect(
      within(card("Meetup partenaire")).getByText("Nouveau"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Nouveau")).toHaveLength(1);
  });

  it("marks only the highlighted card with the green border and the lift shadow", () => {
    render(<OfferGrid items={items} />);
    expect(card("Meetup partenaire")).toHaveClass(
      "border-green",
      "shadow-lift",
    );
    expect(card("Hôte communautaire")).not.toHaveClass("border-green");
    expect(card("Craft session privée")).not.toHaveClass("shadow-lift");
  });
});

describe("OfferGrid actions", () => {
  it("links each card to the host funnel with its own formule", () => {
    render(<OfferGrid items={items} />);
    const expected: Record<string, string> = {
      "Hôte communautaire": "/accueillir/?formule=communautaire",
      "Meetup partenaire": "/accueillir/?formule=partenaire",
      "Craft session privée": "/accueillir/?formule=prive",
    };
    for (const [name, href] of Object.entries(expected)) {
      const link = within(card(name)).getByRole("link", {
        name: "Choisir cette formule",
      });
      expect(link).toHaveAttribute("href", href);
    }
  });

  it("makes the button of the highlighted offer solid and the others ghost", () => {
    render(<OfferGrid items={items} />);
    const link = (name: string) =>
      within(card(name)).getByRole("link", { name: "Choisir cette formule" });
    expect(link("Meetup partenaire")).toHaveClass("bg-red");
    expect(link("Hôte communautaire")).toHaveClass("border-ink");
    expect(link("Hôte communautaire")).not.toHaveClass("bg-red");
    expect(link("Craft session privée")).toHaveClass("border-ink");
  });
});

describe("OfferGrid layout guards", () => {
  it("is one column up to lg, at most 560px wide, then three columns", () => {
    render(<OfferGrid items={items} />);
    const grid = card("Hôte communautaire").parentElement;
    expect(grid).toHaveClass(
      "grid",
      "max-w-[560px]",
      "lg:max-w-none",
      "lg:grid-cols-3",
    );
  });

  it("pushes the button to the bottom of the card", () => {
    render(<OfferGrid items={items} />);
    const link = within(card("Hôte communautaire")).getByRole("link", {
      name: "Choisir cette formule",
    });
    expect(link).toHaveClass("mt-auto", "self-start");
  });
});

describe("OfferGrid dark tone", () => {
  it("uses a translucent card, a sage highlight border and a sage price", () => {
    render(<OfferGrid items={items} tone="dark" />);
    expect(card("Hôte communautaire")).toHaveClass("bg-white/5");
    expect(card("Meetup partenaire")).toHaveClass("border-sage");
    expect(card("Meetup partenaire")).not.toHaveClass("shadow-lift");
    expect(
      within(card("Meetup partenaire")).getByText("À partir de 12 000 MAD"),
    ).toHaveClass("text-sage");
    expect(within(card("Meetup partenaire")).getByText("Nouveau")).toHaveClass(
      "bg-sage",
    );
  });

  it("keeps the solid button flat and outlines the others in white", () => {
    render(<OfferGrid items={items} tone="dark" />);
    const link = (name: string) =>
      within(card(name)).getByRole("link", { name: "Choisir cette formule" });
    const solid = link("Meetup partenaire");
    expect(solid).toHaveClass("bg-red");
    expect(
      solid.className.split(" ").filter((c) => c.startsWith("shadow")),
    ).toEqual([]);
    expect(link("Hôte communautaire")).toHaveClass(
      "border-white",
      "text-white",
    );
    expect(link("Hôte communautaire")).not.toHaveClass("border-ink");
    expect(link("Hôte communautaire")).toHaveClass("mt-auto", "self-start");
  });
});

describe("OfferGrid list semantics", () => {
  it("keeps the list role explicit on both lists of every card", () => {
    const { container } = render(<OfferGrid items={items} />);
    const lists = container.querySelectorAll("ul");
    expect(lists).toHaveLength(items.length * 2);
    for (const list of lists) expect(list).toHaveAttribute("role", "list");
  });
});
