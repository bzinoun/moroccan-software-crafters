import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Monogram } from "./Monogram";

describe("Monogram", () => {
  it("renders the initials it is given", () => {
    // monogram("AXA Assurance Maroc") in the former `assets/js/cms.js` (`git show 1353207:assets/js/cms.js`) gives "AA".
    const { container } = render(<Monogram initials="AA" />);
    expect(container).toHaveTextContent("AA");
  });

  it("is hidden from assistive technology when the company name is printed next to it", () => {
    const { container } = render(<Monogram initials="AA" />);
    const tile = container.firstElementChild;
    expect(tile).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("is an image named after the company when it has a label", () => {
    // Logo row: the company name is not printed, so the tile names it.
    render(<Monogram initials="MC" label="McKinsey & Company" />);
    const tile = screen.getByRole("img", { name: "McKinsey & Company" });
    expect(tile).toHaveTextContent("MC");
    expect(tile).not.toHaveAttribute("aria-hidden");
  });

  it("is a green-dark Fraunces tile on a pale green background", () => {
    const { container } = render(<Monogram initials="AA" />);
    expect(container.firstElementChild).toHaveClass(
      "grid",
      "place-items-center",
      "bg-green-soft",
      "font-display",
      "font-semibold",
      "text-green-dark",
    );
  });

  it("is 84px with a 14px radius and 1.6rem text by default (logo wall)", () => {
    const { container } = render(<Monogram initials="AA" />);
    expect(container.firstElementChild).toHaveClass(
      "size-21",
      "rounded-[14px]",
      "text-[1.6rem]",
    );
  });

  it("is 60px with 1.2rem text in the compact wall", () => {
    const { container } = render(<Monogram initials="AA" size="md" />);
    const tile = container.firstElementChild;
    expect(tile).toHaveClass("size-15", "rounded-[14px]", "text-[1.2rem]");
    expect(tile).not.toHaveClass("size-21", "text-[1.6rem]");
  });

  it("is a 56px bordered square with 12px corners in the logo row", () => {
    const { container } = render(<Monogram initials="AA" size="sm" />);
    const tile = container.firstElementChild;
    expect(tile).toHaveClass("size-14", "rounded-xl", "border", "border-line");
    expect(tile).not.toHaveClass("rounded-[14px]");
  });

  it("merges a caller className", () => {
    const { container } = render(<Monogram initials="AA" className="mb-1" />);
    expect(container.firstElementChild).toHaveClass("mb-1", "size-21");
  });
});
