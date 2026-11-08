import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FunnelProgress } from "./FunnelProgress";

describe("FunnelProgress", () => {
  it("announces the step and its title politely", () => {
    render(<FunnelProgress step={2} />);
    const label = screen.getByText("Étape 2 sur 4 · L'événement");
    expect(label).toHaveAttribute("id", "progress-label");
    expect(label).toHaveAttribute("aria-live", "polite");
  });

  it("draws one bar per step, hides the bars from assistive technology and marks the current one", () => {
    const { container } = render(<FunnelProgress step={3} />);
    const bars = container.querySelectorAll("[aria-hidden='true'] > span");
    expect(bars).toHaveLength(4);
    expect([...bars].map((b) => b.getAttribute("aria-current"))).toEqual([
      null,
      null,
      "step",
      null,
    ]);
    expect(container.querySelector("[data-done]")).toBeNull();
  });

  it("is gone for a visitor with no script: all the steps show at once", () => {
    const { container } = render(<FunnelProgress step={1} />);
    expect(container.querySelector("[aria-hidden='true']")).toHaveClass(
      "not-js:hidden",
    );
    expect(screen.getByText("Étape 1 sur 4 · Formule")).toHaveClass(
      "not-js:hidden",
    );
  });
});
