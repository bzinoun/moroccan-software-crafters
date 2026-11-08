import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders the label as a paragraph with the French narrow space before a colon", () => {
    render(<Eyebrow>Prochain hôte : vous</Eyebrow>);
    expect(screen.getByText(/Prochain hôte/).tagName).toBe("P");
    expect(screen.getByText(/Prochain hôte/).textContent).toBe(
      "Prochain hôte\u202f: vous",
    );
  });

  it("renders a non-string child untouched", () => {
    render(
      <Eyebrow>
        <span>Label : brut</span>
      </Eyebrow>,
    );
    expect(screen.getByText("Label : brut").textContent).toBe("Label : brut");
  });

  it("uses the rule marker by default", () => {
    render(<Eyebrow>Le format</Eyebrow>);
    expect(screen.getByText("Le format")).toHaveClass("before:w-[22px]");
  });

  it("uses the khatam marker instead of the rule when asked", () => {
    render(<Eyebrow marker="khatam">La conférence</Eyebrow>);
    const eyebrow = screen.getByText("La conférence");
    expect(eyebrow).toHaveClass("before:size-3.5");
    expect(eyebrow).not.toHaveClass("before:w-[22px]");
  });

  it("takes the marker out of the layout when the marker is none", () => {
    render(
      <>
        <Eyebrow marker="none">Sans marqueur</Eyebrow>
        <Eyebrow>Regle</Eyebrow>
        <Eyebrow marker="khatam">Etoile</Eyebrow>
      </>,
    );
    // An empty pseudo-element would still add a gap in the row.
    expect(screen.getByText("Sans marqueur")).toHaveClass("before:hidden");
    expect(screen.getByText("Regle")).not.toHaveClass("before:hidden");
    expect(screen.getByText("Etoile")).not.toHaveClass("before:hidden");
  });

  it("gives the dark and cream tones their own text color", () => {
    render(
      <>
        <Eyebrow tone="dark">Sombre</Eyebrow>
        <Eyebrow tone="cream">Creme</Eyebrow>
        <Eyebrow>Normal</Eyebrow>
      </>,
    );
    expect(screen.getByText("Sombre")).toHaveClass("text-sage");
    expect(screen.getByText("Creme")).toHaveClass("text-cream");
    expect(screen.getByText("Normal")).not.toHaveClass(
      "text-sage",
      "text-cream",
    );
  });

  it("lets a caller className win over the default bottom margin", () => {
    render(<Eyebrow className="mb-0">Historique</Eyebrow>);
    const eyebrow = screen.getByText("Historique");
    expect(eyebrow).toHaveClass("mb-0");
    expect(eyebrow).not.toHaveClass("mb-4");
  });
});
