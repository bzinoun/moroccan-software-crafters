import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  it("renders its options and lets the user choose one", async () => {
    render(
      <Select aria-label="Ville" name="ville" required>
        <option value="Casablanca">Casablanca</option>
        <option value="Rabat">Rabat</option>
        <option value="Autre">Autre</option>
      </Select>,
    );
    const select = screen.getByRole("combobox", { name: "Ville" });
    expect(select).toBeRequired();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    await userEvent.selectOptions(select, "Rabat");
    expect(select).toHaveValue("Rabat");
  });

  it("starts on the empty choice of the secteur select", () => {
    render(
      <Select aria-label="Secteur" name="secteur" defaultValue="">
        <option value="">Choisir…</option>
        <option>Télécoms</option>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "Secteur" })).toHaveValue("");
  });

  it("shares the control look and the invalid border with the text input", () => {
    render(
      <Select aria-label="Ville" aria-invalid>
        <option>Casablanca</option>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toHaveClass(
      "border-line",
      "aria-invalid:border-red",
      "focus:border-green",
      "w-full",
    );
  });
});
