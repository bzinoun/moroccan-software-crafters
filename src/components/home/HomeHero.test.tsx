import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHero } from "./HomeHero";

// Props are the real values of content/home.json (hero) and of the home-data
// helpers (collage photo URLs, hero note), written out as literals.
const hero = {
  eyebrow: "Software Craftsmanship · Casablanca · depuis 2019",
  title: "Des samedis matin où l'on parle <em>vraiment</em> de code.",
  lead: "Moroccan Software Crafters réunit développeurs, testeurs et ops autour du travail bien fait. Chaque édition se tient chez une entreprise hôte, et c'est la communauté qui fixe l'agenda.",
  primary: { label: "Accueillir le prochain meetup", href: "accueillir.html" },
  secondary: { label: "Voir les éditions passées", href: "#historique" },
  note: "",
  collage: [],
  postit: "Prochain hôte : votre entreprise ?",
};
const collage = [
  {
    src: "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
    caption: "SG GSCM · oct. 2026",
  },
  {
    src: "/assets/img/meetups/2026-05-axa-1.jpg",
    caption: "AXA · mai 2026",
  },
  {
    src: "/assets/img/meetups/2026-03-innovx-2.jpg",
    caption: "InnovX · mars 2026",
  },
];
const note =
  "Dernière édition : 24 octobre 2026 chez Société Générale GSCM, 110 inscrits.";

function renderHero(overrides: { note?: string } = {}) {
  return render(
    <HomeHero hero={hero} note={overrides.note ?? note} collage={collage} />,
  );
}

describe("HomeHero text and buttons", () => {
  it("renders the title, the eyebrow, the lead and the two buttons", () => {
    renderHero();
    const title = screen.getByRole("heading", { level: 1 });
    expect(title.textContent).toBe(
      "Des samedis matin où l'on parle vraiment de code.",
    );
    expect(within(title).getByText("vraiment").tagName).toBe("EM");
    expect(
      screen.getByText("Software Craftsmanship · Casablanca · depuis 2019"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/^Moroccan Software Crafters réunit/),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Accueillir le prochain meetup" }),
    ).toHaveAttribute("href", "/accueillir/");
    expect(
      screen.getByRole("link", { name: "Voir les éditions passées" }),
    ).toHaveAttribute("href", "#historique");
  });

  it("shows the hero note under the buttons, with the French narrow space", () => {
    renderHero();
    const shown = screen.getByText(/^Dernière édition/);
    expect(shown.textContent).toBe(
      "Dernière édition : 24 octobre 2026 chez Société Générale GSCM, 110 inscrits.",
    );
  });

  it("renders no note paragraph when the note is empty", () => {
    renderHero({ note: "" });
    expect(screen.queryByText(/Dernière édition/)).not.toBeInTheDocument();
  });
});

describe("HomeHero collage", () => {
  it("renders the collage as a decorative box", () => {
    const { container } = renderHero();
    const box = container.querySelector("[aria-hidden='true']");
    expect(box).not.toBeNull();
    expect(box).not.toHaveClass("hidden");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the three photos in order, with empty alt and their captions", () => {
    const { container } = renderHero();
    const photos = container.querySelectorAll("figure img");
    expect(Array.from(photos).map((img) => img.getAttribute("src"))).toEqual([
      "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
      "/assets/img/meetups/2026-05-axa-1.jpg",
      "/assets/img/meetups/2026-03-innovx-2.jpg",
    ]);
    for (const img of photos) expect(img).toHaveAttribute("alt", "");
    const captions = Array.from(container.querySelectorAll("figcaption")).map(
      (c) => c.textContent,
    );
    expect(captions).toEqual([
      "SG GSCM · oct. 2026",
      "AXA · mai 2026",
      "InnovX · mars 2026",
    ]);
  });

  it("renders the post-it with its text in the collage", () => {
    const { container } = renderHero();
    const box = container.querySelector("[aria-hidden='true']") as HTMLElement;
    const postit = within(box).getByText(/^Prochain hôte/);
    expect(postit.textContent).toBe("Prochain hôte : votre entreprise ?");
    expect(postit).toHaveClass("bg-postit-yellow", "absolute");
  });

  it("sizes the post-it at 140px and 1.15rem, then 170px and 1.35rem from lg", () => {
    renderHero();
    const postit = screen.getByText(/^Prochain hôte/);
    expect(postit).toHaveClass(
      "w-35",
      "text-[1.15rem]",
      "lg:w-[170px]",
      "lg:text-[1.35rem]",
      "rotate-[5deg]",
      "right-[6%]",
      "z-5",
    );
    expect(postit).not.toHaveClass("text-[1.35rem]", "w-[170px]");
  });

  it("keeps the post-it when the collage has no photo", () => {
    const { container } = render(
      <HomeHero hero={hero} note={note} collage={[]} />,
    );
    expect(container.querySelectorAll("figure")).toHaveLength(0);
    expect(screen.getByText(/^Prochain hôte/)).toBeInTheDocument();
  });

  it("keeps the collage in the second grid column from lg and stacks it below", () => {
    const { container } = renderHero();
    const grid = screen.getByRole("heading", { level: 1 }).closest(".grid");
    expect(grid).toHaveClass("lg:grid-cols-[1.05fr_1fr]");
    const box = container.querySelector("[aria-hidden='true']");
    expect(box?.parentElement).toBe(grid);
    expect(box).toHaveClass("h-[380px]", "lg:h-[480px]");
  });
});
