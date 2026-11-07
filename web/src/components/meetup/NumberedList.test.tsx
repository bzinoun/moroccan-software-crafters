import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadMeetup } from "@/content/load";
import { NumberedList } from "./NumberedList";

// Props come from content/meetup.json (marketplace.steps, four items).
const { steps } = loadMeetup().marketplace;

describe("NumberedList", () => {
  it("is an ordered list with one item per step, in order", () => {
    render(<NumberedList items={steps} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Un post-it par idée");
    expect(items[3]).toHaveTextContent("Trois cercles, trois espaces");
    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  it("shows the title in bold then the text of each step", () => {
    render(<NumberedList items={steps} />);
    const item = screen.getAllByRole("listitem")[1] as HTMLElement;
    expect(item.querySelector("strong")).toHaveTextContent(
      "Trente secondes de pitch",
    );
    expect(item).toHaveTextContent(
      "Chacun colle son post-it au mur et le présente en une phrase. Les sujets proches se regroupent en bulles.",
    );
  });

  it("draws the counter 1 to 4 in a decorative circle", () => {
    render(<NumberedList items={steps} />);
    const items = screen.getAllByRole("listitem");
    const counters = items.map((li) =>
      li.querySelector('[aria-hidden="true"]'),
    );
    expect(counters.map((c) => c?.textContent)).toEqual(["1", "2", "3", "4"]);
    expect(counters[0]).toHaveClass(
      "rounded-full",
      "border-green",
      "-rotate-6",
    );
  });

  it("applies the French spacing before a colon or a question mark", () => {
    render(<NumberedList items={[{ title: "Quoi ?", text: "Oui : non" }]} />);
    const item = screen.getByRole("listitem");
    expect(item.querySelector("strong")?.textContent).toBe("Quoi\u202f?");
    expect(item.querySelector("strong + span")?.textContent).toBe(
      "Oui\u202f: non",
    );
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<NumberedList items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
