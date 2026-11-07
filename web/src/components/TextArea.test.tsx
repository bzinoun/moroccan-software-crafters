import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextArea } from "./TextArea";

describe("TextArea", () => {
  it("is a multi-line text box with a placeholder", async () => {
    render(
      <TextArea
        aria-label="Votre message"
        name="message"
        placeholder="Vos attentes, vos questions…"
      />,
    );
    const area = screen.getByRole("textbox", { name: "Votre message" });
    expect(area.tagName).toBe("TEXTAREA");
    expect(area).toHaveAttribute("placeholder", "Vos attentes, vos questions…");
    await userEvent.type(area, "Bonjour");
    expect(area).toHaveValue("Bonjour");
  });

  it("is at least 96px high and resizes vertically only", () => {
    render(<TextArea aria-label="Message" />);
    expect(screen.getByRole("textbox")).toHaveClass("min-h-24", "resize-y");
  });

  it("shares the control look and the invalid border", () => {
    render(<TextArea aria-label="Message" aria-invalid />);
    expect(screen.getByRole("textbox")).toHaveClass(
      "aria-invalid:border-red",
      "focus:border-green",
    );
  });
});
