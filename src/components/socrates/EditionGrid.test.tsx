import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadSocrates } from "@/content/load";
import { socratesEditionCards } from "@/lib/pages-data";
import { EditionGrid } from "./EditionGrid";

const editions = () => socratesEditionCards(loadSocrates());

function card(year: string) {
  return screen
    .getByRole("heading", { level: 3, name: new RegExp(`^${year} `) })
    .closest("article") as HTMLElement;
}

describe("EditionGrid", () => {
  it("renders one article per edition, oldest first", () => {
    render(<EditionGrid editions={editions()} />);
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual([
      "2022 · Marrakech",
      "2023 · Bouznika",
      "2024 · Bouznika",
      "2025 · Bouznika",
    ]);
  });

  it("shows venue and dates, leaving out an empty venue", () => {
    render(<EditionGrid editions={editions()} />);
    expect(card("2022")).toHaveTextContent("Palais Ronsard · 25 → 27 mars");
    expect(card("2023")).toHaveTextContent("10 → 12 mars");
    expect(card("2023")).not.toHaveTextContent("· 10");
    expect(card("2025")).toHaveTextContent(
      "The View Bouznika · 4 → 7 septembre",
    );
  });

  it("shows the crafters and partners counts", () => {
    render(<EditionGrid editions={editions()} />);
    const nums = card("2024");
    expect(nums).toHaveTextContent("50crafters");
    expect(nums).toHaveTextContent("6partenaires");
    expect(card("2022")).toHaveTextContent("30crafters");
    expect(card("2022")).toHaveTextContent("8partenaires");
  });

  it("uses the edition photo as a decorative cover when there is one", () => {
    const { container } = render(<EditionGrid editions={editions()} />);
    const img = within(card("2022")).getByRole("presentation", {
      hidden: true,
    });
    expect(img).toHaveAttribute(
      "src",
      "/assets/img/meetups/2022-03-socrates-groupe.jpg",
    );
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(container.querySelectorAll("img")).toHaveLength(2);
  });

  it("prints the year on the cover when there is no photo", () => {
    render(<EditionGrid editions={editions()} />);
    const cover = within(card("2024")).getByText("2024", { selector: "span" });
    expect(cover).toBeInTheDocument();
    expect(within(card("2024")).queryByRole("presentation")).toBeNull();
  });

  it("puts the edition name on a badge over each cover", () => {
    render(<EditionGrid editions={editions()} />);
    expect(within(card("2022")).getByText("1re édition")).toBeInTheDocument();
    expect(within(card("2025")).getByText("4e édition")).toBeInTheDocument();
  });
});
