import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NavToggle } from "./NavToggle";

function renderNav() {
  return render(
    <NavToggle>
      <a href="/meetup/">Le meetup</a>
      <a href="/socrates/">SoCraTes</a>
    </NavToggle>,
  );
}

describe("NavToggle", () => {
  it("starts closed", () => {
    renderNav();
    const nav = screen.getByRole("navigation", {
      name: "Navigation principale",
    });
    expect(nav).not.toHaveAttribute("data-open", "true");
    // Hidden below lg until data-open is true, so closed links stay out of the tab order.
    expect(nav).toHaveClass("max-lg:hidden", "max-lg:data-[open=true]:flex");
    expect(
      screen.getByRole("button", { name: "Ouvrir le menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("opens on a click: aria-expanded true on the button and data-open on the nav", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    expect(
      screen.getByRole("button", { name: "Ouvrir le menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Navigation principale" }),
    ).toHaveAttribute("data-open", "true");
  });

  it("closes again on a second click", async () => {
    const user = userEvent.setup();
    renderNav();
    const toggle = screen.getByRole("button", { name: "Ouvrir le menu" });
    await user.click(toggle);
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("navigation", { name: "Navigation principale" }),
    ).not.toHaveAttribute("data-open", "true");
  });

  it("closes when a link inside the nav is clicked", async () => {
    const user = userEvent.setup();
    renderNav();
    const toggle = screen.getByRole("button", { name: "Ouvrir le menu" });
    await user.click(toggle);
    await user.click(screen.getByRole("link", { name: "SoCraTes" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("navigation", { name: "Navigation principale" }),
    ).toHaveClass("max-lg:hidden");
    expect(
      screen.getByRole("navigation", { name: "Navigation principale" }),
    ).not.toHaveAttribute("data-open", "true");
  });
});
