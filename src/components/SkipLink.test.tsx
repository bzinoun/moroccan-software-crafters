import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("points to the main content by default", () => {
    render(<SkipLink />);
    expect(
      screen.getByRole("link", { name: "Aller au contenu" }),
    ).toHaveAttribute("href", "#main");
  });

  it("takes another target and label, as the host page does", () => {
    render(<SkipLink href="#funnel" label="Aller au formulaire" />);
    expect(
      screen.getByRole("link", { name: "Aller au formulaire" }),
    ).toHaveAttribute("href", "#funnel");
  });

  it("puts the French narrow space before a colon in the label", () => {
    render(<SkipLink label="Aller : ici" />);
    expect(screen.getByRole("link").textContent).toBe("Aller : ici");
  });

  it("is the first element the keyboard reaches", async () => {
    render(
      <>
        <SkipLink />
        <a href="/autre">Autre</a>
      </>,
    );
    await userEvent.tab();
    expect(
      screen.getByRole("link", { name: "Aller au contenu" }),
    ).toHaveFocus();
  });
});
