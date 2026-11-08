import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Recap } from "./Recap";

describe("Recap", () => {
  it("shows the title and one term and definition per row", () => {
    const { container } = render(
      <Recap
        rows={[
          ["Formule", "Meetup partenaire"],
          ["Lieu", "Anfa, Casablanca"],
        ]}
      />,
    );
    expect(container.querySelector("#recap")).not.toHaveAttribute("hidden");
    expect(screen.getByText("Votre demande")).toBeInTheDocument();
    expect(container.querySelectorAll("dt")).toHaveLength(2);
    expect(screen.getByText("Formule").nextElementSibling).toHaveTextContent(
      "Meetup partenaire",
    );
    expect(screen.getByText("Lieu").nextElementSibling).toHaveTextContent(
      "Anfa, Casablanca",
    );
  });

  it("keeps the typed text as it is", () => {
    render(<Recap rows={[["Entreprise", "Acme ? !"]]} />);
    expect(screen.getByText("Entreprise").nextElementSibling?.textContent).toBe(
      "Acme ? !",
    );
  });

  it("is hidden without rows", () => {
    const { container } = render(<Recap rows={[]} />);
    expect(container.querySelector("#recap")).toHaveAttribute("hidden");
    expect(screen.queryByText("Votre demande")).toBeNull();
  });
});
