import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SocratesPage, { metadata } from "./page";

// Expected values are literals read from content/socrates.json,
// content/sponsoring.json and socrates.html.
function renderPage() {
  return render(<SocratesPage />);
}

describe("socrates metadata", () => {
  it("takes the title and the description of socrates.json", () => {
    expect(metadata.title).toBe(
      "SoCraTes Maroc · La conférence Software Craft & Testing",
    );
    expect(metadata.description).toMatch(
      /^SoCraTes Maroc est une unconference : quatre jours d'open space/,
    );
  });

  it("carries the social tags of socrates.html", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: "SoCraTes Maroc · Devenir partenaire",
      description:
        "Quatre jours d'unconference entre crafters. Trois niveaux de partenariat pour la 5e édition.",
      url: "https://bzinoun.github.io/moroccan-software-crafters/socrates/",
      images: [
        "https://bzinoun.github.io/moroccan-software-crafters/assets/img/meetups/2022-03-socrates-groupe.jpg",
      ],
    });
  });
});

describe("SocratesPage", () => {
  it("has the section ids of the old page, in order", () => {
    const { container } = renderPage();
    const ids = [...container.querySelectorAll("section[id]")].map((s) => s.id);
    expect(ids).toEqual([
      "unconference",
      "regles",
      "deroule",
      "editions",
      "famille",
      "valeurs",
      "sponsoring",
      "partenaires",
    ]);
  });

  it("alternates plain, alt and dark bands as the old page does", () => {
    const { container } = renderPage();
    const bands = [...container.querySelectorAll("section[id]")].map((s) =>
      s.classList.contains("bg-green-deep")
        ? "dark"
        : s.classList.contains("bg-sage-soft")
          ? "alt"
          : "plain",
    );
    expect(bands).toEqual([
      "plain",
      "alt",
      "plain",
      "alt",
      "plain",
      "alt",
      "dark",
      "plain",
    ]);
  });

  it("opens with the dark hero: the only level 1 heading, photo, status, facts and two buttons", () => {
    const { container } = renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(
      "Quatre jours entre crafters, sans programme.",
    );
    expect(h1.querySelector("em")).toHaveTextContent("sans programme");
    expect(
      screen.getByText(
        "Software Craft & Testing · édition marocaine depuis 2022",
      ),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-hero-photo]")).toHaveStyle({
      backgroundImage: 'url("/assets/img/meetups/2022-03-socrates-groupe.jpg")',
    });
    expect(
      screen.getByText(
        (_, el) =>
          el?.tagName === "P" &&
          el.textContent ===
            "Prochaine édition\u202f: après le Ramadan 2027, Bouznika",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("30 → 50")).toBeInTheDocument();
    expect(screen.getByText("3 pays")).toBeInTheDocument();
    const hero = h1.closest("section") as HTMLElement;
    const primary = within(hero).getByRole("link", {
      name: "Devenir partenaire",
    });
    expect(primary).toHaveAttribute("href", "#sponsoring");
    const secondary = within(hero).getByRole("link", {
      name: "Site de l'édition",
    });
    expect(secondary).toHaveAttribute("href", "https://socrates-ma.github.io/");
    expect(secondary).toHaveAttribute("target", "_blank");
    expect(secondary).toHaveAttribute("rel", "noopener");
  });

  it("#unconference: head, lead and the three pillars", () => {
    renderPage();
    const section = screen.getByRole("region", {
      name: "Ce n'est pas une conférence. C'est une retraite de travail.",
    });
    expect(section).toHaveAttribute("id", "unconference");
    expect(within(section).getAllByRole("article")).toHaveLength(3);
    expect(
      within(section).getByRole("heading", { level: 3, name: "Des personnes" }),
    ).toBeInTheDocument();
  });

  it("#regles: the four laws, the grid formats and #formats", () => {
    const { container } = renderPage();
    const section = container.querySelector("#regles") as HTMLElement;
    expect(within(section).getByRole("list")).toHaveTextContent(
      "La loi des deux pieds.",
    );
    expect(within(section).getAllByRole("listitem")).toHaveLength(4);
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: "Ce qu'on trouve sur la grille",
      }),
    ).toBeInTheDocument();
    const formats = section.querySelector("#formats") as HTMLElement;
    expect(within(formats).getAllByRole("article")).toHaveLength(4);
    expect(
      within(formats).getByRole("heading", { level: 3, name: "Discussion" }),
    ).toBeInTheDocument();
  });

  it("#deroule: four days and the note", () => {
    const { container } = renderPage();
    const section = container.querySelector("#deroule") as HTMLElement;
    expect(within(section).getAllByRole("listitem")).toHaveLength(4);
    expect(section).toHaveTextContent("Arrivée et World Café");
    expect(section).toHaveTextContent(
      "arrivée le jeudi à 15 h, départ le dimanche à 13 h",
    );
  });

  it("#editions: four edition cards", () => {
    const { container } = renderPage();
    const section = container.querySelector("#editions") as HTMLElement;
    expect(within(section).getAllByRole("article")).toHaveLength(4);
    expect(section).toHaveTextContent("The View Bouznika");
  });

  it("#famille: lead and nine events", () => {
    const { container } = renderPage();
    const section = container.querySelector("#famille") as HTMLElement;
    expect(section).toHaveTextContent("Le Maroc a rejoint la famille en 2022.");
    expect(within(section).getAllByRole("listitem")).toHaveLength(9);
  });

  it("#valeurs: four values", () => {
    const { container } = renderPage();
    const section = container.querySelector("#valeurs") as HTMLElement;
    expect(within(section).getAllByRole("article")).toHaveLength(4);
    expect(
      within(section).getByRole("heading", { level: 3, name: "Bienveillant" }),
    ).toBeInTheDocument();
  });

  it("#sponsoring: three packages, each linking to #sponsor-form, and the form", () => {
    const { container } = renderPage();
    const section = container.querySelector("#sponsoring") as HTMLElement;
    const buttons = within(section).getAllByRole("link", {
      name: "Choisir ce niveau",
    });
    expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      expect(button).toHaveAttribute("href", "#sponsor-form");
    }
    expect(section.querySelector("form#sponsor-form")).not.toBeNull();
    expect(section.querySelector("#sponsor-funnel")).not.toBeNull();
    expect(section.querySelector("#sponsor-faq")).not.toBeNull();
  });

  it("#partenaires: centered head and the sponsors wall with the sponsor sticker", () => {
    const { container } = renderPage();
    const section = container.querySelector("#partenaires") as HTMLElement;
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "Onze entreprises, quatre éditions.",
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText("Ils ont soutenu SoCraTes Maroc"),
    ).toBeInTheDocument();
    const wall = section.querySelector("#sponsors-wall") as HTMLElement;
    expect(wall).not.toBeNull();
    expect(
      within(wall).getByRole("link", { name: /Votre logo ici/ }),
    ).toHaveAttribute("href", "#sponsor-funnel");
    // Eleven companies appear in the sponsors[] of events.json, plus the sticker.
    expect(wall.children).toHaveLength(12);
    expect(wall).toHaveTextContent("McKinsey & Company");
  });
});
