import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";

describe("Container", () => {
  it("renders its children", () => {
    render(<Container data-testid="wrap">contenu</Container>);
    expect(screen.getByTestId("wrap")).toHaveTextContent("contenu");
  });

  it("passes native attributes through", () => {
    render(
      <Container data-testid="wrap" id="zone">
        x
      </Container>,
    );
    expect(screen.getByTestId("wrap")).toHaveAttribute("id", "zone");
  });

  it("applies a caller className", () => {
    render(
      <Container data-testid="wrap" className="gap-6">
        x
      </Container>,
    );
    expect(screen.getByTestId("wrap")).toHaveClass("gap-6");
  });
});
