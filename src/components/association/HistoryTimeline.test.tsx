import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadAssociation } from "@/content/load";
import { AssociationHistory, HistoryTimeline } from "./HistoryTimeline";

const { timeline } = loadAssociation();

describe("HistoryTimeline", () => {
  it("lists the seven milestones of content/association.json in order", () => {
    render(<HistoryTimeline items={timeline.items} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(7);
    expect(items[0]).toHaveTextContent("2019");
    expect(items[6]).toHaveTextContent("2026");
  });

  it("shows the year, a level 3 title and the text of a milestone", () => {
    render(<HistoryTimeline items={timeline.items} />);
    const item = screen
      .getByRole("heading", { level: 3, name: "SoCraTes arrive au Maroc" })
      .closest("li") as HTMLElement;
    expect(within(item).getByText("2022")).toBeInTheDocument();
    expect(
      within(item).getByText(
        "Première édition à Marrakech en mars, trente crafters et huit partenaires. Les meetups reprennent en présentiel chez Maltem Africa et inwi.",
      ),
    ).toBeInTheDocument();
  });

  it("carries the vertical line on the list and a red dot on each item", () => {
    render(<HistoryTimeline items={timeline.items} />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("relative", "before:absolute", "before:bg-line");
    for (const item of within(list).getAllByRole("listitem")) {
      expect(item).toHaveClass("relative", "after:border-red");
    }
  });

  it("carries the id it is given", () => {
    render(<HistoryTimeline id="history" items={timeline.items} />);
    expect(screen.getByRole("list")).toHaveAttribute("id", "history");
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<HistoryTimeline items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("AssociationHistory", () => {
  it("is the #histoire section with its head and the timeline", () => {
    const { container } = render(<AssociationHistory history={timeline} />);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "histoire");
    expect(screen.getByText("Notre histoire")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "De 2019 à aujourd'hui." }),
    ).toBeInTheDocument();
    expect(container.querySelector("ol#history")).not.toBeNull();
  });
});
