import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DayStrip } from "./DayStrip";

const DAYS = [
  { day: "Jeudi", title: "Arrivée et café", text: "On s'installe." },
  { day: "Vendredi", title: "Open space", text: "Les participants décident." },
  { day: "Samedi", title: "Sessions", text: "Une journée de sessions." },
];
const NOTE = "Le contenu exact est décidé par les participants.";

describe("DayStrip", () => {
  it("lists the days in order with their title and text", () => {
    render(<DayStrip days={DAYS} note={NOTE} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(DAYS.length);
    expect(items[0]).toHaveTextContent("Jeudi");
    expect(
      within(items[0]!).getByRole("heading", {
        level: 3,
        name: "Arrivée et café",
      }),
    ).toBeInTheDocument();
    expect(items[1]).toHaveTextContent("Vendredi");
    expect(items[2]).toHaveTextContent("Une journée de sessions.");
  });

  it("shows the note under the list", () => {
    render(<DayStrip days={DAYS} note={NOTE} />);
    expect(screen.getByText(NOTE)).toBeInTheDocument();
  });

  it("renders no note paragraph when the note is empty", () => {
    const { container } = render(<DayStrip days={DAYS} note="" />);
    expect(container.querySelectorAll("p")).toHaveLength(DAYS.length);
  });
});

describe("DayStrip with no day", () => {
  it("renders nothing, the note included", () => {
    const { container } = render(<DayStrip days={[]} note={NOTE} />);
    expect(container).toBeEmptyDOMElement();
  });
});
