import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadSocrates } from "@/content/load";
import { DayStrip } from "./DayStrip";

const { days, note } = loadSocrates().schedule;

describe("DayStrip", () => {
  it("lists the four days in order with their title and text", () => {
    render(<DayStrip days={days} note={note} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Jeudi");
    expect(
      within(items[0]).getByRole("heading", {
        level: 3,
        name: "Arrivée et World Café",
      }),
    ).toBeInTheDocument();
    expect(items[1]).toHaveTextContent("Vendredi");
    expect(items[2]).toHaveTextContent("Samedi");
    expect(items[3]).toHaveTextContent("Dimanche");
    expect(items[3]).toHaveTextContent(
      "Rétrospective de l'édition, coding kata collectif",
    );
  });

  it("shows the note under the list", () => {
    render(<DayStrip days={days} note={note} />);
    expect(
      screen.getByText(/^Le contenu exact est décidé par les participants\./),
    ).toBeInTheDocument();
  });

  it("keeps the bottom margin of the old paragraph (1em) under the note", () => {
    render(<DayStrip days={days} note={note} />);
    expect(
      screen.getByText(/^Le contenu exact est décidé par les participants\./),
    ).toHaveClass("mt-3.5", "mb-[1em]");
  });

  it("renders no note paragraph when the note is empty", () => {
    const { container } = render(<DayStrip days={days} note="" />);
    expect(container.querySelectorAll("p")).toHaveLength(4);
  });
});
