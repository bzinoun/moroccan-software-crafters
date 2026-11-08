import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterChips } from "./FilterChips";

// content/home.json, history.filters.
const FILTERS = [
  { value: "all", label: "Tous" },
  { value: "meetup", label: "Meetups" },
  { value: "socrates", label: "SoCraTes Maroc" },
  { value: "codesnack", label: "Code Snacks" },
  { value: "online", label: "En ligne" },
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
    ).toEqual(["Tous", "Meetups", "SoCraTes Maroc", "Code Snacks", "En ligne"]);
  });

  it("presses only the chip of the current value", () => {
    setup("socrates");
    const pressed = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-pressed") === "true");
    expect(pressed.map((button) => button.textContent)).toEqual([
      "SoCraTes Maroc",
    ]);
    expect(screen.getByRole("button", { name: "Tous" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("reports the value of the clicked chip", async () => {
    const { onChange } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Code Snacks" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("codesnack");
  });

  it("selects a chip with the keyboard", async () => {
    const { onChange } = setup();
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Meetups" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledExactlyOnceWith("meetup");
  });

  it("makes the buttons plain buttons, not submit buttons", () => {
    setup();
    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("type", "button");
    }
  });
});
