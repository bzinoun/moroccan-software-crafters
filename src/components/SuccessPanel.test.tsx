import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SuccessPanel } from "./SuccessPanel";

describe("SuccessPanel", () => {
  it("is a named status: the title names it, the post-it, title and text follow", () => {
    render(
      <SuccessPanel
        id="success"
        hidden={false}
        stamp="Merci ! On vous rappelle vite."
        text="Un texte de test."
      />,
    );
    const panel = screen.getByRole("status", { name: "Demande bien reçue." });
    expect(panel).toHaveAttribute("id", "success");
    expect(panel).toHaveAttribute("tabindex", "-1");
    expect(panel).toHaveTextContent("Merci ! On vous rappelle vite.");
    expect(
      screen.getByRole("heading", { level: 2, name: "Demande bien reçue." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Un texte de test.")).toHaveAttribute(
      "id",
      "success-text",
    );
  });

  it("takes the heading level and id prefix of the form", () => {
    render(
      <SuccessPanel
        id="s-success"
        hidden={false}
        stamp="Merci !"
        headingLevel={3}
        text="x"
      />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Demande bien reçue." }),
    ).toBeInTheDocument();
    expect(screen.getByText("x")).toHaveAttribute("id", "s-success-text");
    expect(screen.getByRole("status")).toHaveAccessibleName(
      "Demande bien reçue.",
    );
  });

  it("applies French spacing to the text", () => {
    render(
      <SuccessPanel
        id="success"
        hidden={false}
        stamp="Merci"
        text="Voilà : c'est fait !"
      />,
    );
    expect(screen.getByText(/c'est fait/).textContent).toBe(
      "Voilà : c'est fait !",
    );
  });

  it("shows what the form passes after the text", () => {
    render(
      <SuccessPanel id="success" hidden={false} stamp="Merci" text="x">
        <a href="/autre">Autre lien</a>
      </SuccessPanel>,
    );
    expect(screen.getByRole("link", { name: "Autre lien" })).toBeVisible();
  });

  it("stays in the page but hidden, and does not take focus", () => {
    const { container } = render(
      <SuccessPanel id="success" hidden stamp="Merci" text="x" />,
    );
    expect(container.querySelector("#success")).toHaveAttribute("hidden");
    expect(document.body).toHaveFocus();
  });

  it("takes focus when it appears", () => {
    const { rerender } = render(
      <SuccessPanel id="success" hidden stamp="Merci" text="x" />,
    );
    rerender(
      <SuccessPanel id="success" hidden={false} stamp="Merci" text="x" />,
    );
    expect(screen.getByRole("status")).toHaveFocus();
  });
});
