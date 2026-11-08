import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FunnelStep } from "./FunnelStep";

describe("FunnelStep", () => {
  it("is a fieldset named by its legend, with the hint under it", () => {
    render(
      <FunnelStep step={2} active title="L'événement" hint="Le samedi.">
        <input aria-label="Champ" />
      </FunnelStep>,
    );
    const group = screen.getByRole("group", { name: "L'événement" });
    expect(group).toHaveAttribute("data-step", "2");
    expect(group).not.toHaveAttribute("hidden");
    expect(screen.getByText("Le samedi.")).toBeInTheDocument();
    expect(screen.getByLabelText("Champ")).toBeInTheDocument();
  });

  it("hides the fieldset while it is not the current step", () => {
    const { container } = render(
      <FunnelStep step={3} active={false} title="Votre entreprise">
        <input aria-label="Champ" />
      </FunnelStep>,
    );
    expect(container.querySelector("fieldset")).toHaveAttribute("hidden");
    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("makes the legend focusable by script, not by the tab key", () => {
    render(
      <FunnelStep step={1} active title="Quelle formule vous intéresse ?">
        <span />
      </FunnelStep>,
    );
    expect(screen.getByText(/Quelle formule/)).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });
});
