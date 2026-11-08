import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TagList } from "./TagList";

const TOPICS = [
  "Premier sujet",
  "Deuxième sujet",
  "Troisième sujet",
  "Quatrième sujet",
  "Cinquième sujet",
];

describe("TagList", () => {
  it("renders one list item per tag, in order", () => {
    render(<TagList tags={TOPICS} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(TOPICS);
  });

  it("keeps only the first max tags", () => {
    render(<TagList tags={TOPICS} max={4} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(TOPICS.slice(0, 4));
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

  it("lets a caller class replace the default bottom margin", () => {
    render(<TagList tags={["Cloud"]} className="mt-2 mb-0" />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("mt-2", "mb-0");
    expect(list).not.toHaveClass("mb-4");
  });

  it("keeps the list role explicit, Safari drops it when the list style is none", () => {
    render(<TagList tags={TOPICS} />);
    expect(screen.getByRole("list")).toHaveAttribute("role", "list");
  });
});
