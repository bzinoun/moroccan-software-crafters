import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextInput } from "./TextInput";

describe("TextInput", () => {
  it("is a text input by default and takes native attributes", () => {
    render(
      <TextInput
        aria-label="Téléphone"
        type="tel"
        name="telephone"
        placeholder="+212 6 12 34 56 78"
        autoComplete="tel"
      />,
    );
    const input = screen.getByRole("textbox", { name: "Téléphone" });
    expect(input).toHaveAttribute("type", "tel");
    expect(input).toHaveAttribute("name", "telephone");
    expect(input).toHaveAttribute("placeholder", "+212 6 12 34 56 78");
  });

  it("keeps the 48 px height of the old date input: Preflight removes its inner padding", () => {
    const { container } = render(<TextInput type="date" aria-label="Date" />);
    expect(container.querySelector("input")).toHaveClass("min-h-12");
  });

  it("leaves other types without a minimum height", () => {
    render(<TextInput aria-label="Nom" />);
    expect(screen.getByRole("textbox", { name: "Nom" })).not.toHaveClass(
      "min-h-12",
    );
  });

  it("defaults to the text type", () => {
    render(<TextInput aria-label="Nom" />);
    expect(screen.getByRole("textbox", { name: "Nom" })).toHaveAttribute(
      "type",
      "text",
    );
  });

  it("works uncontrolled: the user types a value", async () => {
    render(<TextInput aria-label="Nom" defaultValue="Ada" />);
    const input = screen.getByRole("textbox", { name: "Nom" });
    await userEvent.type(input, " Lovelace");
    expect(input).toHaveValue("Ada Lovelace");
  });

  it("works controlled: onChange receives the typed value", async () => {
    const onChange = vi.fn();
    render(<TextInput aria-label="Nom" value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox", { name: "Nom" }), "A");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("has a red border when invalid and a green focus halo", () => {
    render(<TextInput aria-label="Nom" aria-invalid />);
    const input = screen.getByRole("textbox", { name: "Nom" });
    expect(input).toHaveClass(
      "border-line",
      "aria-invalid:border-red",
      "focus:border-green",
      "focus:outline-hidden",
      "rounded-sm",
      "w-full",
    );
  });

  it("keeps a transparent outline on focus so forced-colors mode shows one", () => {
    render(<TextInput aria-label="Nom" />);
    expect(screen.getByRole("textbox", { name: "Nom" })).not.toHaveClass(
      "focus:outline-none",
    );
  });

  it("merges a caller className", () => {
    render(<TextInput aria-label="Nom" className="w-1/2" />);
    const input = screen.getByRole("textbox", { name: "Nom" });
    expect(input).toHaveClass("w-1/2");
    expect(input).not.toHaveClass("w-full");
  });
});
