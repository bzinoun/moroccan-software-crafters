import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { EditionCard } from "@/lib/pages-data";
import { EditionGrid } from "./EditionGrid";

// Cards as `socratesEditionCards` gives them, written by hand.
const EDITIONS: EditionCard[] = [
  {
    year: "2022",
    edition: "1re édition",
    title: "2022 · Marrakech",
    where: "Palais Test · 25 → 27 mars",
    participants: 30,
    partners: 8,
    photoSrc: "/assets/img/meetups/2022-photo.jpg",
    text: "La première.",
  },
  {
    year: "2023",
    edition: "2e édition",
    title: "2023 · Bouznika",
    where: "10 → 12 mars",
    participants: 45,
    partners: 5,
    photoSrc: null,
    text: "La deuxième.",
  },
  {
    year: "2024",
    edition: "3e édition",
    title: "2024 · Bouznika",
    where: "Hôtel Test · 4 → 7 septembre",
    participants: 50,
    partners: 6,
    photoSrc: null,
    text: "La troisième.",
  },
];

function card(year: string) {
  return screen
    .getByRole("heading", { level: 3, name: new RegExp(`^${year} `) })
    .closest("article") as HTMLElement;
}

describe("EditionGrid", () => {
  it("renders one article per edition, in the given order", () => {
    render(<EditionGrid editions={EDITIONS} />);
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual([
      "2022 · Marrakech",
      "2023 · Bouznika",
      "2024 · Bouznika",
    ]);
  });

  it("shows the venue and the dates, and the text of the edition", () => {
    render(<EditionGrid editions={EDITIONS} />);
    expect(card("2022")).toHaveTextContent("Palais Test · 25 → 27 mars");
    expect(card("2023")).toHaveTextContent("10 → 12 mars");
    expect(card("2023")).not.toHaveTextContent("· 10");
    expect(card("2024")).toHaveTextContent("La troisième.");
  });

  it("shows the crafters and partners counts", () => {
    render(<EditionGrid editions={EDITIONS} />);
    expect(card("2024")).toHaveTextContent("50crafters");
    expect(card("2024")).toHaveTextContent("6partenaires");
    expect(card("2022")).toHaveTextContent("30crafters");
    expect(card("2022")).toHaveTextContent("8partenaires");
  });

  it("uses the edition photo as a decorative cover when there is one", () => {
    const { container } = render(<EditionGrid editions={EDITIONS} />);
    const img = within(card("2022")).getByRole("presentation", {
      hidden: true,
    });
    expect(img).toHaveAttribute("src", "/assets/img/meetups/2022-photo.jpg");
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(container.querySelectorAll("img")).toHaveLength(1);
  });

  it("prints the year on the cover when there is no photo", () => {
    render(<EditionGrid editions={EDITIONS} />);
    const cover = within(card("2024")).getByText("2024", { selector: "span" });
    expect(cover).toBeInTheDocument();
    expect(within(card("2024")).queryByRole("presentation")).toBeNull();
  });

  it("puts the edition name on a badge over each cover", () => {
    render(<EditionGrid editions={EDITIONS} />);
    expect(within(card("2022")).getByText("1re édition")).toBeInTheDocument();
    expect(within(card("2024")).getByText("3e édition")).toBeInTheDocument();
  });
});

describe("EditionGrid with no edition", () => {
  it("renders nothing: no empty grid", () => {
    const { container } = render(<EditionGrid editions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
