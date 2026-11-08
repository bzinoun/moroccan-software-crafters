import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormPanel } from "./FormPanel";

describe("FormPanel", () => {
  it("holds its children in a div that takes the id and the other attributes", () => {
    const { container } = render(
      <FormPanel id="funnel" tabIndex={-1}>
        <p>le formulaire</p>
      </FormPanel>,
    );
    const panel = container.querySelector("#funnel") as HTMLElement;
    expect(panel).toHaveAttribute("tabindex", "-1");
    expect(panel).toContainElement(screen.getByText("le formulaire"));
  });

  it("gives the roomy panel more padding than the snug one, from sm", () => {
    const { container } = render(
      <>
        <FormPanel id="a" spacing="roomy">
          x
        </FormPanel>
        <FormPanel id="b" spacing="snug">
          y
        </FormPanel>
      </>,
    );
    // jsdom loads no CSS: the class list is the only trace of the spacing.
    expect(container.querySelector("#a")).toHaveClass("sm:p-8");
    expect(container.querySelector("#b")).not.toHaveClass("sm:p-8");
  });
});
