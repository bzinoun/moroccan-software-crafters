import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";

describe("Container", () => {
  it("centers its children inside the site wrap width", () => {
    render(<Container data-testid="wrap">contenu</Container>);
    expect(screen.getByTestId("wrap")).toHaveClass("mx-auto", "max-w-wrap");
    expect(screen.getByTestId("wrap")).toHaveTextContent("contenu");
  });

  it("merges a caller className", () => {
    render(
      <Container data-testid="wrap" className="flex gap-6">
        x
      </Container>,
    );
    expect(screen.getByTestId("wrap")).toHaveClass("mx-auto", "flex", "gap-6");
  });
});
