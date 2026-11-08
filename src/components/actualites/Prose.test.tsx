import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { md } from "@/lib/md";
import { Prose } from "./Prose";

// A small body that uses every element the Markdown subset can produce.
const BODY =
  "First paragraph.\n\n## A section title\n\nSpeed matters.\n\n- tests\n- documentation\n\n1. read\n2. test\n\n> Learn to say no.\n\nA `merge` and a [link](https://example.com/a).";

describe("Prose", () => {
  it("renders the elements of the Markdown output", () => {
    render(<Prose>{md(BODY)}</Prose>);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "A section title",
      }),
    ).toBeInTheDocument();
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(2);
    expect(
      within(lists[0]!)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["tests", "documentation"]);
    expect(lists[1]!.tagName).toBe("OL");
    expect(
      screen.getByText("Learn to say no.").closest("blockquote"),
    ).not.toBeNull();
    expect(screen.getByText("merge").tagName).toBe("CODE");
    expect(screen.getByRole("link", { name: "link" })).toHaveAttribute(
      "href",
      "https://example.com/a",
    );
  });

  it("keeps a caller class and renders nothing inside for empty content", () => {
    render(
      <Prose data-testid="prose" className="mt-4">
        {md("")}
      </Prose>,
    );
    const prose = screen.getByTestId("prose");
    expect(prose).toHaveClass("mt-4");
    expect(prose).toBeEmptyDOMElement();
  });
});
