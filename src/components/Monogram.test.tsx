import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Monogram } from "./Monogram";

describe("Monogram", () => {
  it("renders the initials it is given", () => {
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
    render(<Monogram initials="MC" label="Acme Conseil" />);
    const tile = screen.getByRole("img", { name: "Acme Conseil" });
    expect(tile).toHaveTextContent("MC");
    expect(tile).not.toHaveAttribute("aria-hidden");
  });

  it("gives each size its own size class", () => {
    const { container } = render(
      <>
        <Monogram initials="AA" />
        <Monogram initials="BB" size="md" />
        <Monogram initials="CC" size="sm" />
      </>,
    );
    const [lg, md, sm] = Array.from(container.children);
    expect(lg).toHaveClass("size-21");
    expect(md).toHaveClass("size-15");
    expect(sm).toHaveClass("size-14");
  });

  it("merges a caller className", () => {
    const { container } = render(<Monogram initials="AA" className="mb-1" />);
    expect(container.firstElementChild).toHaveClass("mb-1");
  });
});
