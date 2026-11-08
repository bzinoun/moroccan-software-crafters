import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardGrid, type CardItem } from "./CardGrid";

const WHO: CardItem[] = [
  {
    title: "Vous codez",
    text: "Backend, front, mobile, data, infra : le craft ne dépend pas de la stack.",
  },
  {
    title: "Vous testez",
    text: "Les testeurs sont là depuis le premier jour, et le « T » de SoCraTes, c'est eux.",
  },
  {
    title: "Vous encadrez",
    text: "Leads, managers, CTO : venez écouter ce que vos équipes n'osent pas dire en réunion.",
  },
  {
    title: "Vous apprenez",
    text: "Étudiants et juniors : une matinée ici vaut plusieurs semaines de veille.",
  },
];

const INTERNAL: CardItem = {
  title: "Le meetup",
  text: "Un samedi matin toutes les six à huit semaines, chez une entreprise hôte à Casablanca. Gratuit, en open space : lightning talks, bubble topics, tables rondes.",
  href: "/meetup/",
  label: "Le déroulé",
};
const EXTERNAL: CardItem = {
  title: "Rejoindre l'organisation",
  text: "Accueil, photos, facilitation des tables rondes, relations avec les hôtes : il y a toujours de la place.",
  href: "https://www.linkedin.com/company/moroccansoftwarecrafters/",
  label: "Nous écrire",
};

describe("CardGrid", () => {
  it("renders one article per item with a level 3 title and the text", () => {
    render(<CardGrid items={WHO} columns={4} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(4);
    expect(
      within(cards[0]!).getByRole("heading", { level: 3, name: "Vous codez" }),
    ).toBeInTheDocument();
    expect(within(cards[3]!).getByText(WHO[3]!.text)).toBeInTheDocument();
  });

  it("renders no link for an item without href", () => {
    render(<CardGrid items={WHO} columns={4} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("links an internal href to its route with the label and an arrow", () => {
    render(<CardGrid items={[INTERNAL]} columns={3} />);
    const link = screen.getByRole("link", { name: "Le déroulé →" });
    expect(link).toHaveAttribute("href", "/meetup/");
    expect(link).not.toHaveAttribute("target");
  });

  it("maps an internal href with an anchor to its route and anchor", () => {
    render(
      <CardGrid
        items={[
          {
            title: "Proposer un lightning talk",
            text: "Cinq à dix minutes sur le sujet de votre choix, sans slides si vous préférez.",
            href: "/meetup/#proposer",
            label: "Comment faire",
          },
        ]}
        columns={4}
      />,
    );
    expect(
      screen.getByRole("link", { name: "Comment faire →" }),
    ).toHaveAttribute("href", "/meetup/#proposer");
  });

  it("opens an external href in a new tab without opener", () => {
    render(<CardGrid items={[EXTERNAL]} columns={4} />);
    const link = screen.getByRole("link", { name: "Nous écrire →" });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/moroccansoftwarecrafters/",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("falls back to the label En savoir plus", () => {
    render(
      <CardGrid
        items={[{ title: "Le meetup", text: "Texte.", href: "/meetup/" }]}
        columns={2}
      />,
    );
    expect(
      screen.getByRole("link", { name: "En savoir plus →" }),
    ).toBeInTheDocument();
  });

  it.each([
    [2, ["sm:grid-cols-2"], ["lg:grid-cols-4", "lg:grid-cols-6"]],
    [3, ["lg:grid-cols-6"], ["lg:grid-cols-4"]],
    [4, ["lg:grid-cols-4"], ["lg:grid-cols-6"]],
  ] as const)(
    "lays the items out for %s columns",
    (columns, expected, absent) => {
      const { container } = render(<CardGrid items={WHO} columns={columns} />);
      const grid = container.firstElementChild;
      expect(grid).toHaveClass(...expected);
      expect(grid).not.toHaveClass(...absent);
    },
  );

  it("merges a caller className", () => {
    const { container } = render(
      <CardGrid items={WHO} columns={4} className="mt-6" />,
    );
    expect(container.firstElementChild).toHaveClass("mt-6");
  });

  it("gives the dark tone a translucent card in place of the light card", () => {
    render(<CardGrid items={[INTERNAL]} columns={2} tone="dark" />);
    const card = screen.getByRole("article");
    expect(card).toHaveClass("bg-white/5");
    expect(card).not.toHaveClass("bg-white");
  });
});

describe("Card", () => {
  it("renders a lone card outside a grid", () => {
    render(
      <Card title="Partenariat en nature" text="Un texte." tone="light" />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Partenariat en nature" }),
    ).toBeInTheDocument();
  });

  it("puts a narrow no-break space before a colon in the title and the text", () => {
    render(<Card title="Accès : libre" text="Prix : 0 MAD" />);
    expect(screen.getByRole("heading").textContent).toBe("Accès\u202f: libre");
    expect(screen.getByText(/Prix/).textContent).toBe("Prix\u202f: 0 MAD");
  });
});
