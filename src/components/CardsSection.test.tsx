import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CardItem } from "./CardGrid";
import { CardsSection } from "./CardsSection";

const CARDS: CardItem[] = [
  {
    title: "Premier",
    text: "Un texte.",
    href: "/meetup/",
    label: "Le déroulé",
  },
  {
    title: "Deuxième",
    text: "Un autre texte.",
    href: "/socrates/#sponsoring",
    label: "Voir les formules",
  },
  { title: "Troisième", text: "Sans lien." },
  {
    title: "Quatrième",
    text: "Lien externe.",
    href: "https://example.com/page",
    label: "Nous écrire",
  },
];

function renderSection(
  props: Partial<React.ComponentProps<typeof CardsSection>> = {},
) {
  return render(
    <CardsSection
      id="mission"
      eyebrow="Ce qu'on fait"
      title="Un titre de section."
      items={CARDS}
      columns={4}
      {...props}
    />,
  );
}

describe("CardsSection", () => {
  it("renders a section with the given anchor id", () => {
    const { container } = renderSection({ id: "contribuer" });
    expect(container.querySelector("section")).toHaveAttribute(
      "id",
      "contribuer",
    );
  });

  it("renders nothing for no card: no orphan heading", () => {
    const { container } = renderSection({ items: [] });
    expect(container).toBeEmptyDOMElement();
  });

  it("opens with the eyebrow and the title as a level 2 heading", () => {
    renderSection();
    expect(screen.getByText("Ce qu'on fait")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Un titre de section." }),
    ).toBeInTheDocument();
  });

  it("renders one card per item", () => {
    renderSection();
    expect(screen.getAllByRole("article")).toHaveLength(CARDS.length);
  });

  it("links internal cards to their routes", () => {
    renderSection();
    expect(screen.getByRole("link", { name: "Le déroulé →" })).toHaveAttribute(
      "href",
      "/meetup/",
    );
    expect(
      screen.getByRole("link", { name: "Voir les formules →" }),
    ).toHaveAttribute("href", "/socrates/#sponsoring");
  });

  it("opens an external card link in a new tab", () => {
    renderSection();
    const external = screen.getByRole("link", { name: "Nous écrire →" });
    expect(external).toHaveAttribute("href", "https://example.com/page");
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener");
  });

  it("renders no link for a card without href", () => {
    renderSection({ items: [CARDS[2]!] });
    const card = screen.getByRole("article");
    expect(within(card).queryByRole("link")).toBeNull();
  });

  it("uses a background for the alt variant and none for the plain one", () => {
    const { container, rerender } = renderSection();
    expect(container.querySelector("section")).not.toHaveClass("bg-sage-soft");
    rerender(
      <CardsSection
        id="mission"
        variant="alt"
        eyebrow="Ce qu'on fait"
        title="Un titre de section."
        items={CARDS}
        columns={4}
      />,
    );
    expect(container.querySelector("section")).toHaveClass("bg-sage-soft");
  });

  it("shows the lead under the title and names the section by its title", () => {
    renderSection({
      id: "pour-qui",
      titleId: "who-title",
      title: "Un titre.",
      lead: "Un chapeau d'une phrase.",
    });
    expect(screen.getByText("Un chapeau d'une phrase.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Un titre." })).toHaveAttribute(
      "id",
      "pour-qui",
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute(
      "id",
      "who-title",
    );
  });

  it("is no landmark when no titleId is given", () => {
    renderSection();
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("passes the marker to the eyebrow", () => {
    const { rerender } = renderSection({ eyebrow: "Valeurs" });
    expect(screen.getByText("Valeurs")).toHaveClass("before:w-5.5");
    rerender(
      <CardsSection
        id="mission"
        marker="khatam"
        eyebrow="Valeurs"
        title="Un titre."
        items={CARDS}
        columns={4}
      />,
    );
    expect(screen.getByText("Valeurs")).toHaveClass("before:size-3.5");
  });
});
