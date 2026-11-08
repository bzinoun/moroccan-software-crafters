import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ConsentCheckbox } from "./ConsentCheckbox";

const TEXT =
  "J'accepte que l'association conserve ces informations pour me recontacter.";

describe("ConsentCheckbox", () => {
  it("is a required checkbox labelled by the consent text", () => {
    render(
      <ConsentCheckbox id="s-consent" name="consent" required>
        {TEXT}
      </ConsentCheckbox>,
    );
    const box = screen.getByRole("checkbox", { name: TEXT });
    expect(box).toBeRequired();
    expect(box).toHaveAttribute("id", "s-consent");
    expect(box).not.toBeChecked();
  });

  it("is checked by a click on the text", async () => {
    render(
      <ConsentCheckbox id="c" name="consent">
        {TEXT}
      </ConsentCheckbox>,
    );
    await userEvent.click(screen.getByText(/J'accepte que/));
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("shows the error and flags the checkbox invalid", () => {
    render(
      <ConsentCheckbox
        id="c"
        name="consent"
        error="Votre accord est nécessaire pour envoyer la demande."
      >
        {TEXT}
      </ConsentCheckbox>,
    );
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAccessibleDescription(
      "Votre accord est nécessaire pour envoyer la demande.",
    );
  });

  it("has no invalid state without an error", () => {
    render(
      <ConsentCheckbox id="c" name="consent">
        {TEXT}
      </ConsentCheckbox>,
    );
    const box = screen.getByRole("checkbox");
    expect(box).not.toHaveAttribute("aria-invalid");
    expect(box).not.toHaveAttribute("aria-describedby");
  });

  it("keeps its fixed attributes when a caller passes the same ones", () => {
    render(
      <ConsentCheckbox
        id="c"
        name="consent"
        error="Erreur."
        aria-invalid={false}
        aria-describedby="autre"
        {...{ type: "radio" }}
      >
        {TEXT}
      </ConsentCheckbox>,
    );
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAttribute("aria-describedby", "c-error");
  });
});
