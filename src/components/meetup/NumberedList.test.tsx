import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NumberedList } from "./NumberedList";

const steps = [
  { title: "First step", text: "Write one idea on a post-it." },
  { title: "Second step", text: "Pitch it in thirty seconds." },
  { title: "Third step", text: "Vote for the bubbles you like." },
];

describe("NumberedList", () => {
  it("is an ordered list with one item per step, in order", () => {
    render(<NumberedList items={steps} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(steps.length);
    expect(items[0]).toHaveTextContent("First step");
    expect(items[2]).toHaveTextContent("Third step");
  });

  it("shows the title in bold then the text of each step", () => {
    render(<NumberedList items={steps} />);
    const item = screen.getAllByRole("listitem")[1] as HTMLElement;
    expect(item.querySelector("strong")).toHaveTextContent("Second step");
    expect(item).toHaveTextContent("Pitch it in thirty seconds.");
  });

  it("numbers the steps from 1 in a circle hidden from assistive technology", () => {
    render(<NumberedList items={steps} />);
    const counters = screen
      .getAllByRole("listitem")
      .map((li) => li.querySelector('[aria-hidden="true"]'));
    expect(counters.map((c) => c?.textContent)).toEqual(["1", "2", "3"]);
  });

  it("applies the French spacing before a colon or a question mark", () => {
    render(<NumberedList items={[{ title: "Quoi ?", text: "Oui : non" }]} />);
    const item = screen.getByRole("listitem");
    expect(item.querySelector("strong")?.textContent).toBe("Quoi ?");
    expect(item.querySelector("strong + span")?.textContent).toBe("Oui : non");
  });

  it("keeps two steps with the same title without a duplicate key", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <NumberedList
        items={[
          { title: "Vote", text: "Vote for a bubble." },
          { title: "Vote", text: "Vote again." },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<NumberedList items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
