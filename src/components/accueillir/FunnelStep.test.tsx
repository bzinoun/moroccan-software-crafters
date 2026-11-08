import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
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
    const { container } = render(
      <FunnelStep step={1} active title="Quelle formule vous intéresse ?">
        <span />
      </FunnelStep>,
    );
    expect(container.querySelector("legend")).toHaveAttribute("tabindex", "-1");
  });

  it("gives the step a real level 2 heading inside its legend", () => {
    const { container } = render(
      <FunnelStep step={3} active title="Votre entreprise">
        <span />
      </FunnelStep>,
    );
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Votre entreprise",
    });
    expect(container.querySelector("legend")).toContainElement(heading);
    expect(
      screen.getByRole("group", { name: "Votre entreprise" }),
    ).toBeInTheDocument();
  });

  // The HTML a visitor with no script receives: the server render. Only the
  // `js` variant of the stylesheet hides a step, so without script every step
  // shows; with script the hidden steps are hidden from the first paint.
  describe("in the HTML before any script runs", () => {
    function serverStep(active: boolean) {
      const host = document.createElement("div");
      host.innerHTML = renderToString(
        <FunnelStep step={3} active={active} title="Votre entreprise">
          <input aria-label="Champ" />
        </FunnelStep>,
      );
      return host.querySelector("fieldset") as HTMLElement;
    }

    it("does not hide a step that is not the current one", () => {
      expect(serverStep(false)).not.toHaveAttribute("hidden");
    });

    it("hides that step for visitors with script only", () => {
      expect(serverStep(false)).toHaveClass("js:hidden");
    });

    it("never hides the current step", () => {
      const step = serverStep(true);
      expect(step).not.toHaveAttribute("hidden");
      expect(step).not.toHaveClass("js:hidden");
    });
  });
});
