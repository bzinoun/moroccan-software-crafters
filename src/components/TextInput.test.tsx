import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { recorder } from "@/test/recorder";
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
    const onChange = recorder<[unknown]>();
    render(<TextInput aria-label="Nom" value="" onChange={onChange.fn} />);
    await userEvent.type(screen.getByRole("textbox", { name: "Nom" }), "A");
    expect(onChange.calls).toHaveLength(1);
  });

  it("exposes aria-invalid to assistive technology", () => {
    render(<TextInput aria-label="Nom" aria-invalid />);
    expect(screen.getByRole("textbox", { name: "Nom" })).toBeInvalid();
  });

  // The class outline-none would also remove the outline in forced-colors mode.
  it("keeps a transparent outline on focus so forced-colors mode shows one", () => {
    render(<TextInput aria-label="Nom" />);
    expect(screen.getByRole("textbox", { name: "Nom" })).not.toHaveClass(
      "focus:outline-none",
    );
  });

  it("lets a caller className replace the default width", () => {
    render(<TextInput aria-label="Nom" className="w-1/2" />);
    const input = screen.getByRole("textbox", { name: "Nom" });
    expect(input).toHaveClass("w-1/2");
    expect(input).not.toHaveClass("w-full");
  });
});
