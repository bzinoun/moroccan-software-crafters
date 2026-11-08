import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AssociationHistory, HistoryTimeline } from "./HistoryTimeline";

const items = [
  {
    year: "2019",
    title: "First meetup",
    text: "Twelve crafters meet in a café.",
  },
  {
    year: "2022",
    title: "SoCraTes arrive au Maroc",
    text: "Première édition à Marrakech, trente crafters et huit partenaires.",
  },
  {
    year: "2026",
    title: "Fifth edition",
    text: "The call for partners opens.",
  },
];
const timeline = { eyebrow: "History", title: "From 2019 to today.", items };

describe("HistoryTimeline", () => {
  it("lists the milestones as an ordered list, in the order given", () => {
    render(<HistoryTimeline items={items} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const rows = within(list).getAllByRole("listitem");
    expect(rows).toHaveLength(items.length);
    expect(rows[0]).toHaveTextContent("2019");
    expect(rows[2]).toHaveTextContent("2026");
  });

  it("shows the year, a level 3 title and the text of a milestone", () => {
    render(<HistoryTimeline items={items} />);
    const item = screen
      .getByRole("heading", { level: 3, name: "SoCraTes arrive au Maroc" })
      .closest("li") as HTMLElement;
    expect(within(item).getByText("2022")).toBeInTheDocument();
    expect(
      within(item).getByText(
        "Première édition à Marrakech, trente crafters et huit partenaires.",
      ),
    ).toBeInTheDocument();
  });

  it("applies the French spacing in the title and the text", () => {
    render(
      <HistoryTimeline
        items={[
          { year: "2024", title: "Pourquoi ?", text: "Voici : la suite" },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe(
      "Pourquoi ?",
    );
    expect(screen.getByText(/Voici/).textContent).toBe("Voici : la suite");
  });

  it("keeps two milestones of the same year and title", () => {
    render(
      <HistoryTimeline
        items={[
          { year: "2022", title: "Spring", text: "First text." },
          { year: "2022", title: "Spring", text: "Second text." },
        ]}
      />,
    );
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("First text.");
    expect(rows[1]).toHaveTextContent("Second text.");
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<HistoryTimeline items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("AssociationHistory", () => {
  it("is the #histoire section with its head and the timeline", () => {
    const { container } = render(<AssociationHistory history={timeline} />);
    expect(container.querySelector("section")).toHaveAttribute(
      "id",
      "histoire",
    );
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "From 2019 to today." }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(items.length);
  });

  it("is a section named by its title", () => {
    const { container } = render(<AssociationHistory history={timeline} />);
    expect(screen.getByRole("region", { name: "From 2019 to today." })).toBe(
      container.querySelector("section"),
    );
  });

  it("renders nothing without milestones, no orphan heading", () => {
    const { container } = render(
      <AssociationHistory history={{ ...timeline, items: [] }} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
