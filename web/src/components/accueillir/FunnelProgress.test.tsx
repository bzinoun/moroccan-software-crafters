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

  it("fills one bar per step reached and hides the bars from assistive technology", () => {
    const { container } = render(<FunnelProgress step={3} />);
    const bars = container.querySelectorAll("[aria-hidden='true'] > span");
    expect(bars).toHaveLength(4);
    expect([...bars].map((b) => b.hasAttribute("data-done"))).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });
});
