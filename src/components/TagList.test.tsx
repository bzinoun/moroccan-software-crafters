import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TagList } from "./TagList";

// content/events.json, first event (Meetup @ Société Générale GSCM), topics.
const TOPICS = [
  "AI factory",
  "Responsabilité humaine",
  "Sécurité du vibe coding",
  "Outils IA",
  "Coût des tokens",
];

describe("TagList", () => {
  it("renders one list item per tag, in order", () => {
    render(<TagList tags={TOPICS} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(TOPICS);
  });

  it("keeps only the first max tags", () => {
    // Feature card: max 4.
    render(<TagList tags={TOPICS} max={4} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "AI factory",
      "Responsabilité humaine",
      "Sécurité du vibe coding",
      "Outils IA",
    ]);
  });

  it("shows every tag when there are fewer than max", () => {
    render(<TagList tags={["Cloud", "Data"]} max={6} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders nothing for an empty or missing list", () => {
    const { container, rerender } = render(<TagList tags={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<TagList tags={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the tags as paper-2 pills of 0.76rem soft ink text", () => {
    render(<TagList tags={["Cloud"]} />);
    expect(screen.getByRole("listitem")).toHaveClass(
      "rounded-full",
      "bg-paper-2",
      "text-ink-soft",
      "text-[0.76rem]",
    );
  });

  it("wraps the pills with a 6px gap and no list marker", () => {
    render(<TagList tags={TOPICS} />);
    expect(screen.getByRole("list")).toHaveClass(
      "flex",
      "flex-wrap",
      "gap-1.5",
      "list-none",
    );
  });

  it("lets a caller change the margins (timeline: 0.5rem above, none below)", () => {
    render(<TagList tags={["Cloud"]} className="mt-2 mb-0" />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("mt-2", "mb-0");
    expect(list).not.toHaveClass("mb-4");
  });
});

describe("TagList list semantics", () => {
  it("keeps the list role explicit, Safari drops it when the list style is none", () => {
    render(<TagList tags={TOPICS} />);
    expect(screen.getByRole("list")).toHaveAttribute("role", "list");
  });
});
