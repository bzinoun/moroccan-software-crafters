import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Honeypot } from "./Honeypot";

describe("Honeypot", () => {
  it("is hidden from assistive technology and out of the tab order", () => {
    const { container } = render(<Honeypot />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).toHaveAttribute("tabindex", "-1");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toHaveAttribute("type", "text");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("is named website_hp by default with the label Ne pas remplir", () => {
    const { container } = render(<Honeypot />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).toHaveAttribute("name", "website_hp");
    expect(input).toHaveAttribute("id", "website_hp");
    const label = container.querySelector("label") as HTMLLabelElement;
    expect(label).toHaveTextContent("Ne pas remplir");
    expect(label).toHaveAttribute("for", "website_hp");
  });

  it("takes its own id, as the sponsor form does", () => {
    const { container } = render(<Honeypot id="s-hp" />);
    expect(container.querySelector("input")).toHaveAttribute("id", "s-hp");
    expect(container.querySelector("label")).toHaveAttribute("for", "s-hp");
  });

  it("sits off screen in a 1px box", () => {
    const { container } = render(<Honeypot />);
    expect(container.firstElementChild).toHaveClass(
      "absolute",
      "-left-[9999px]",
      "size-px",
      "overflow-hidden",
    );
  });

  it("passes a value and a change handler to the input", () => {
    const { container } = render(<Honeypot value="x" readOnly />);
    expect(container.querySelector("input")).toHaveValue("x");
  });
});
