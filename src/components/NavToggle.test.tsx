import { render, screen, within } from "@testing-library/react";
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

// The menu is a native disclosure: it opens with no script. The script adds
// Escape, the focus return and the close on a link.
const menu = () => screen.getByRole("group");
const summary = () =>
  screen.getByText("Menu").closest("summary") as HTMLElement;

describe("NavToggle", () => {
  it("is a native disclosure named Menu, closed at first", () => {
    renderNav();
    expect(menu().tagName).toBe("DETAILS");
    expect(menu()).not.toHaveAttribute("open");
    expect(summary().tagName).toBe("SUMMARY");
  });

  it("holds the nav links in a navigation landmark", () => {
    renderNav();
    const nav = within(menu()).getByRole("navigation", {
      name: "Navigation principale",
    });
    expect(within(nav).getByRole("link", { name: "SoCraTes" })).toHaveAttribute(
      "href",
      "/socrates/",
    );
  });

  it("opens on a click on the summary", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(summary());
    expect(menu()).toHaveAttribute("open");
  });

  it("closes again on a second click", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(summary());
    await user.click(summary());
    expect(menu()).not.toHaveAttribute("open");
  });

  it("closes on Escape and gives the focus back to the summary", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(summary());
    await user.click(screen.getByRole("navigation"));
    expect(summary()).not.toHaveFocus();
    await user.keyboard("{Escape}");
    expect(menu()).not.toHaveAttribute("open");
    expect(summary()).toHaveFocus();
  });

  it("closes on Escape pressed on a link inside the menu", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(summary());
    await user.tab();
    expect(screen.getByRole("link", { name: "Le meetup" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(menu()).not.toHaveAttribute("open");
    expect(summary()).toHaveFocus();
  });

  it("leaves the focus alone when Escape is pressed with the menu closed", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>Autre</button>
        <NavToggle>
          <a href="/meetup/">Le meetup</a>
        </NavToggle>
      </>,
    );
    screen.getByRole("button", { name: "Autre" }).focus();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Autre" })).toHaveFocus();
  });

  it("closes when a link inside the menu is clicked", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(summary());
    await user.click(screen.getByRole("link", { name: "SoCraTes" }));
    expect(menu()).not.toHaveAttribute("open");
  });

  it("keeps the menu open when a click lands on the panel but not on a link", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(summary());
    await user.click(screen.getByRole("navigation"));
    expect(menu()).toHaveAttribute("open");
  });
});
