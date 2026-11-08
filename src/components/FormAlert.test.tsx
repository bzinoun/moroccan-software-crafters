import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormAlert } from "./FormAlert";

describe("FormAlert", () => {
  it("is an alert region that holds the message", () => {
    render(<FormAlert>Envoi impossible pour le moment.</FormAlert>);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Envoi impossible pour le moment.",
    );
  });

  it("stays in the page, hidden, while it has no message", () => {
    const { container } = render(<FormAlert id="s-alert" />);
    const alert = container.firstElementChild as HTMLElement;
    expect(alert).toHaveAttribute("role", "alert");
    expect(alert).toHaveAttribute("id", "s-alert");
    expect(alert).toHaveAttribute("hidden");
  });

  it("is visible when it has a message", () => {
    render(<FormAlert>Un problème.</FormAlert>);
    expect(screen.getByRole("alert")).not.toHaveAttribute("hidden");
  });

  it("can hold a link, as the LinkedIn fallback does", () => {
    render(
      <FormAlert>
        Écrivez-nous sur <a href="https://example.com/page">LinkedIn</a>.
      </FormAlert>,
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
  });

  it("puts a narrow no-break space before a colon", () => {
    render(<FormAlert>Erreur : réessayez.</FormAlert>);
    expect(screen.getByRole("alert").textContent).toBe(
      "Erreur\u202f: réessayez.",
    );
  });
});
