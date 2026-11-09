import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldRow } from "./FieldRow";

describe("FieldRow", () => {
  it("holds all its fields in one parent", () => {
    const { container } = render(
      <FieldRow>
        <p>Un</p>
        <p>Deux</p>
      </FieldRow>,
    );
    expect(container.firstElementChild?.children).toHaveLength(2);
    expect(screen.getByText("Un")).toBeInTheDocument();
    expect(screen.getByText("Deux")).toBeInTheDocument();
  });

  it("applies a caller className", () => {
    const { container } = render(<FieldRow className="mt-4">x</FieldRow>);
    expect(container.firstElementChild).toHaveClass("mt-4");
  });
});
