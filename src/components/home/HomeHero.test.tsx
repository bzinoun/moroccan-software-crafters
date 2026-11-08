import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeHero } from "./HomeHero";

// A fixture written here: the hero draws the copy, the note and the collage it gets.
const hero = {
  eyebrow: "Software Craftsmanship · Casablanca",
  title: "Des samedis matin où l'on parle <em>vraiment</em> de code.",
  lead: "Une communauté réunit développeurs, testeurs et ops autour du travail bien fait.",
  primary: { label: "Accueillir le prochain meetup", href: "/accueillir/" },
  secondary: { label: "Voir les éditions passées", href: "#historique" },
  note: "",
  collage: [],
  postit: "Prochain hôte : votre entreprise ?",
};
const collage = [
  {
    src: "/assets/img/meetups/2026-10-alpha-5.jpg",
    caption: "Alpha · oct. 2026",
  },
  { src: "/assets/img/meetups/2026-05-beta-1.jpg", caption: "Beta · mai 2026" },
  {
    src: "/assets/img/meetups/2026-03-gamma-2.jpg",
    caption: "Gamma · mars 2026",
  },
];
const note = "Dernière édition : 24 octobre 2026 chez Alpha Corp.";

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
      screen.getByText("Software Craftsmanship · Casablanca"),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Une communauté réunit/)).toBeVisible();
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
      "Dernière édition\u202f: 24 octobre 2026 chez Alpha Corp.",
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

  it("renders the photos in order, with empty alt and their captions", () => {
    const { container } = renderHero();
    const photos = container.querySelectorAll("figure img");
    expect(Array.from(photos).map((img) => img.getAttribute("src"))).toEqual([
      "/assets/img/meetups/2026-10-alpha-5.jpg",
      "/assets/img/meetups/2026-05-beta-1.jpg",
      "/assets/img/meetups/2026-03-gamma-2.jpg",
    ]);
    for (const img of photos) expect(img).toHaveAttribute("alt", "");
    const captions = Array.from(container.querySelectorAll("figcaption")).map(
      (c) => c.textContent,
    );
    expect(captions).toEqual(collage.map((photo) => photo.caption));
  });

  it("renders the post-it with its text in the collage", () => {
    const { container } = renderHero();
    const box = container.querySelector("[aria-hidden='true']") as HTMLElement;
    const postit = within(box).getByText(/^Prochain hôte/);
    expect(postit.textContent).toBe(
      "Prochain hôte\u202f: votre entreprise\u202f?",
    );
  });

  it("keeps the post-it when the collage has no photo", () => {
    const { container } = render(
      <HomeHero hero={hero} note={note} collage={[]} />,
    );
    expect(container.querySelectorAll("figure")).toHaveLength(0);
    expect(screen.getByText(/^Prochain hôte/)).toBeInTheDocument();
  });
});

describe("HomeHero collage size", () => {
  const FOUR = [
    ...collage,
    { src: "/assets/img/meetups/2026-01-delta-1.jpg", caption: "Delta" },
  ];

  it("shows the first three photos when the collage has more", () => {
    const { container } = render(
      <HomeHero hero={hero} note={note} collage={FOUR} />,
    );
    const photos = container.querySelectorAll("figure img");
    expect(Array.from(photos).map((img) => img.getAttribute("src"))).toEqual(
      collage.map((photo) => photo.src),
    );
  });

  it("draws the same photo twice in the collage without a key warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const twin = [collage[0]!, collage[0]!];
    const { container } = render(
      <HomeHero hero={hero} note={note} collage={twin} />,
    );
    expect(container.querySelectorAll("figure")).toHaveLength(2);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
