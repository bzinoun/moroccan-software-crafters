import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Offer } from "@/content/types";
import { OfferGrid } from "./OfferGrid";

// A fixture written here: the grid draws the offers it gets.
const items: Offer[] = [
  {
    id: "alpha",
    name: "Offre Alpha",
    price: "Gratuit",
    tagline: "Le format simple : vous ouvrez, nous faisons le reste.",
    youProvide: ["Une salle", "Un écran", "Du café"],
    weProvide: [
      "Organisation et accueil",
      "Annonce et récap",
      "Animation : talks, cercles",
    ],
  },
  {
    id: "beta",
    name: "Offre Beta",
    price: "À partir de 1 000 MAD",
    highlight: true,
    badge: "Nouveau",
    tagline: "Un format porté par votre marque.",
    youProvide: ["Le financement", "Une salle si possible"],
    weProvide: ["Tout le format Alpha", "Un talk de 20 min", "Un bilan"],
  },
  {
    id: "gamma",
    name: "Offre Gamma",
    price: "À partir de 2 500 MAD",
    tagline: "Le format, animé pour vos équipes.",
    youProvide: ["Vos équipes", "Une demi-journée"],
    weProvide: ["Préparation", "Animation", "Synthèse écrite"],
  },
];

function card(name: string) {
  const heading = screen.getByRole("heading", { level: 3, name });
  const article = heading.closest("article");
  if (!article) throw new Error(`no card around ${name}`);
  return article;
}

// Every card has the same visible label: a hidden part names the offer.
function choose(name: string) {
  return within(card(name)).getByRole("link", {
    name: `Choisir cette formule, ${name}`,
  });
}

describe("OfferGrid cards", () => {
  it("renders one card per offer, in the given order, named by a level 3 heading", () => {
    render(<OfferGrid items={items} />);
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(items.map((offer) => offer.name));
    expect(screen.getAllByRole("article")).toHaveLength(items.length);
  });

  it("shows the price exactly as given and the tagline", () => {
    render(<OfferGrid items={items} />);
    const beta = within(card("Offre Beta"));
    expect(beta.getByText("À partir de 1 000 MAD")).toBeInTheDocument();
    expect(
      beta.getByText("Un format porté par votre marque."),
    ).toBeInTheDocument();
    expect(
      within(card("Offre Alpha")).getByText("Gratuit"),
    ).toBeInTheDocument();
  });

  it("shows Sur devis when the offer has no price or an empty one", () => {
    const first = items[0]!;
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
    const tagline = within(card("Offre Alpha")).getByText(/Le format simple/);
    expect(tagline.textContent).toBe(
      "Le format simple\u202f: vous ouvrez, nous faisons le reste.",
    );
  });
});

describe("OfferGrid lists", () => {
  it("lists what the company brings, then what the community brings", () => {
    render(<OfferGrid items={items} />);
    const alpha = within(card("Offre Alpha"));
    expect(
      alpha.getAllByRole("heading", { level: 4 }).map((h) => h.textContent),
    ).toEqual(["Vous apportez", "Nous apportons"]);

    const [give, get] = alpha.getAllByRole("list") as [
      HTMLElement,
      HTMLElement,
    ];
    expect(
      within(give)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["Une salle", "Un écran", "Du café"]);
    expect(
      within(get)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual([
      "Organisation et accueil",
      "Annonce et récap",
      "Animation\u202f: talks, cercles",
    ]);
  });

  it("keeps the list role explicit on both lists of every card", () => {
    const { container } = render(<OfferGrid items={items} />);
    const lists = container.querySelectorAll("ul");
    expect(lists).toHaveLength(items.length * 2);
    for (const list of lists) expect(list).toHaveAttribute("role", "list");
  });

  it("gives the give list a yellow bullet and the other list a green one", () => {
    render(<OfferGrid items={items} />);
    const [give, get] = within(card("Offre Alpha")).getAllByRole("list") as [
      HTMLElement,
      HTMLElement,
    ];
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
    expect(within(card("Offre Beta")).getByText("Nouveau")).toBeInTheDocument();
    expect(screen.getAllByText("Nouveau")).toHaveLength(1);
  });

  it("marks only the highlighted card", () => {
    render(<OfferGrid items={items} />);
    expect(card("Offre Beta")).toHaveAttribute("data-highlighted");
    expect(card("Offre Alpha")).not.toHaveAttribute("data-highlighted");
    expect(card("Offre Gamma")).not.toHaveAttribute("data-highlighted");
  });
});

describe("OfferGrid actions", () => {
  it("links each card to the host funnel with its own formule", () => {
    render(<OfferGrid items={items} />);
    for (const offer of items) {
      expect(choose(offer.name)).toHaveAttribute(
        "href",
        `/accueillir/?formule=${offer.id}`,
      );
    }
  });

  it("gives each link of the grid its own name", () => {
    render(<OfferGrid items={items} />);
    const names = screen
      .getAllByRole("link")
      .map((link) => link.textContent)
      .map((text) => text?.replace(/\s+/g, " "));
    expect(new Set(names).size).toBe(items.length);
  });

  it("makes the button of the highlighted offer solid and the others not", () => {
    render(<OfferGrid items={items} />);
    expect(choose("Offre Beta")).toHaveClass("bg-red");
    expect(choose("Offre Alpha")).not.toHaveClass("bg-red");
    expect(choose("Offre Gamma")).not.toHaveClass("bg-red");
  });
});

describe("OfferGrid dark tone", () => {
  it("draws the cards on a translucent surface and the highlight border in sage", () => {
    render(<OfferGrid items={items} tone="dark" />);
    expect(card("Offre Alpha")).toHaveClass("bg-white/5");
    expect(card("Offre Beta")).toHaveAttribute("data-highlighted");
  });

  it("keeps every card, price and action in the dark tone", () => {
    render(<OfferGrid items={items} tone="dark" />);
    expect(screen.getAllByRole("article")).toHaveLength(items.length);
    for (const offer of items) {
      expect(choose(offer.name)).toBeVisible();
    }
  });
});

describe("OfferGrid edge cases", () => {
  it("renders nothing without an offer", () => {
    const { container } = render(<OfferGrid items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists twice the same line without a key warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const first = items[0]!;
    render(
      <OfferGrid
        items={[{ ...first, youProvide: ["Une salle", "Une salle"] }]}
      />,
    );
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
