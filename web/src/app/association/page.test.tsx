import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AssociationPage, { metadata } from "./page";

describe("association page metadata", () => {
  it("takes the title and the description from content/association.json", () => {
    expect(metadata.title).toBe("L'association · Moroccan Software Crafters");
    expect(metadata.description).toBe(
      "Moroccan Software Crafters est une association à but non lucratif qui stimule et promeut les valeurs du Software Craftsmanship au Maroc : meetups, SoCraTes Maroc, une communauté ouverte à tous depuis 2019.",
    );
  });

  it("sets the Open Graph tags of association.html on the route", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: "L'association · Moroccan Software Crafters",
      description:
        "Une communauté, pas une marque. Mission, principes, histoire et façons de contribuer.",
      url: "https://bzinoun.github.io/moroccan-software-crafters/association/",
      images: [
        "https://bzinoun.github.io/moroccan-software-crafters/assets/img/meetups/2026-03-innovx-1.jpg",
      ],
    });
  });
});

describe("AssociationPage", () => {
  it("opens with the page hero: title, group photo, post-it and the four facts", () => {
    const { container } = render(<AssociationPage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Une communauté, pas une marque.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Photo de groupe d'un meetup" }),
    ).toHaveAttribute("src", "/assets/img/meetups/2026-03-innovx-1.jpg");
    expect(screen.getByText("Depuis 2019")).toBeInTheDocument();
    const facts = container.querySelector("section ul") as HTMLElement;
    expect(within(facts).getAllByRole("listitem")).toHaveLength(4);
    expect(within(facts).getByText("entreprises hôtes")).toBeInTheDocument();
    expect(
      within(facts).getByText("éditions de SoCraTes Maroc"),
    ).toBeInTheDocument();
  });

  it("renders the sections in the order and with the ids of association.html", () => {
    const { container } = render(<AssociationPage />);
    const ids = Array.from(container.querySelectorAll("section[id]")).map(
      (s) => s.id,
    );
    expect(ids).toEqual([
      "mission",
      "principes",
      "histoire",
      "entreprises",
      "contribuer",
    ]);
  });

  it("ends with the contact band that opens the LinkedIn page", () => {
    render(<AssociationPage />);
    expect(
      screen.getByRole("link", { name: "Écrire sur LinkedIn" }),
    ).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/moroccansoftwarecrafters/",
    );
  });

  it("closes with a tight band named by its title, with the host funnel link", () => {
    const { container } = render(<AssociationPage />);
    const sections = container.querySelectorAll("section");
    const last = sections[sections.length - 1];
    expect(last).toHaveClass("py-14");
    expect(last).toHaveAccessibleName("Nous écrire");
    expect(
      screen.getByRole("link", { name: "Accueillir un meetup" }),
    ).toHaveAttribute("href", "/accueillir/");
  });

  it("shows the hosts wall of 16 companies and the milestones of the history", () => {
    const { container } = render(<AssociationPage />);
    expect(
      within(container.querySelector("#logo-wall") as HTMLElement).getAllByRole(
        "img",
      ),
    ).toHaveLength(16);
    expect(container.querySelectorAll("#history > li")).toHaveLength(7);
  });
});
