import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FilterChips } from "./FilterChips";
import { setJs } from "./js-mode";

beforeEach(() => {
  setJs(true);
});

afterEach(() => {
  setJs(false);
});

// A fixture written here: the chips draw the options they get.
const FILTERS = [
  { value: "all", label: "Tous" },
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Bêta" },
  { value: "gamma", label: "Gamma" },
  { value: "delta", label: "Delta" },
];

function setup(value = "all", onChange = vi.fn()) {
  render(
    <FilterChips
      label="Filtrer les événements"
      options={FILTERS}
      value={value}
      onChange={onChange}
    />,
  );
  return { onChange };
}

describe("FilterChips", () => {
  it("is a named group of one button per filter, in order", () => {
    setup();
    const group = screen.getByRole("group", { name: "Filtrer les événements" });
    expect(group).toBeInTheDocument();
    expect(
      screen.getAllByRole("button").map((button) => button.textContent),
    ).toEqual(FILTERS.map((filter) => filter.label));
  });

  it("presses only the chip of the current value", () => {
    setup("beta");
    const pressed = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-pressed") === "true");
    expect(pressed.map((button) => button.textContent)).toEqual(["Bêta"]);
    expect(screen.getByRole("button", { name: "Tous" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("reports the value of the clicked chip", async () => {
    const { onChange } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Gamma" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("gamma");
  });

  it("selects a chip with the keyboard", async () => {
    const { onChange } = setup();
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledExactlyOnceWith("alpha");
  });

  it("makes the buttons plain buttons, not submit buttons", () => {
    setup();
    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("type", "button");
    }
  });
});

describe("FilterChips without JavaScript", () => {
  it("shows no control that would do nothing", () => {
    setJs(false);
    setup();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toEqual([]);
  });
});
