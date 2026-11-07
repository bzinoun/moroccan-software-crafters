import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldRow } from "./FieldRow";

describe("FieldRow", () => {
  it("holds its fields in one column, two from sm", () => {
    const { container } = render(
      <FieldRow>
        <p>Un</p>
        <p>Deux</p>
      </FieldRow>,
    );
    expect(screen.getByText("Un")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass(
      "grid",
      "gap-4",
      "sm:grid-cols-2",
    );
    expect(container.firstElementChild).not.toHaveClass("grid-cols-2");
  });

  it("merges a caller className", () => {
    const { container } = render(<FieldRow className="mt-4">x</FieldRow>);
    expect(container.firstElementChild).toHaveClass("mt-4");
  });
});
