import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders the label as a paragraph with the French narrow space before a colon", () => {
    // home.json hero.eyebrow style: a label with a normal space before ":".
    render(<Eyebrow>Prochain hôte : vous</Eyebrow>);
    expect(screen.getByText(/Prochain hôte/).tagName).toBe("P");
    expect(screen.getByText(/Prochain hôte/).textContent).toBe(
      "Prochain hôte\u202f: vous",
    );
  });

  it("is a red label with a 22px by 2px red rule by default", () => {
    render(<Eyebrow>Le format</Eyebrow>);
    const eyebrow = screen.getByText("Le format");
    expect(eyebrow).toHaveClass(
      "text-red",
      "uppercase",
      "before:h-0.5",
      "before:w-[22px]",
      "before:bg-red",
      "before:content-['']",
    );
  });

  it("draws a 14px khatam instead of the rule for the SoCraTes marker", () => {
    render(<Eyebrow marker="khatam">La conférence</Eyebrow>);
    const eyebrow = screen.getByText("La conférence");
    expect(eyebrow).toHaveClass("before:size-3.5", "before:content-['']");
    expect(eyebrow).not.toHaveClass("before:w-[22px]");
    expect(eyebrow.className).toContain("before:[clip-path:polygon(50%_0%,");
  });

  it("draws nothing before the text when the marker is none", () => {
    render(<Eyebrow marker="none">Ils nous font confiance</Eyebrow>);
    const eyebrow = screen.getByText("Ils nous font confiance");
    // The pseudo-element would still exist (Tailwind sets its content), so it
    // must be taken out of the layout: an empty flex item would add a gap.
    expect(eyebrow).toHaveClass("before:hidden");
    expect(eyebrow).not.toHaveClass("before:w-[22px]");
  });

  it("keeps the marker visible for the rule and the khatam", () => {
    render(
      <>
        <Eyebrow>Regle</Eyebrow>
        <Eyebrow marker="khatam">Etoile</Eyebrow>
      </>,
    );
    expect(screen.getByText("Regle")).not.toHaveClass("before:hidden");
    expect(screen.getByText("Etoile")).not.toHaveClass("before:hidden");
  });

  it("is sage on a dark surface and keeps the marker in the text color", () => {
    render(<Eyebrow tone="dark">La conférence</Eyebrow>);
    const eyebrow = screen.getByText("La conférence");
    expect(eyebrow).toHaveClass("text-sage", "before:bg-current");
    expect(eyebrow).not.toHaveClass("text-red");
  });

  it("is cream in the SoCraTes hero", () => {
    render(<Eyebrow tone="cream">SoCraTes Maroc</Eyebrow>);
    expect(screen.getByText("SoCraTes Maroc")).toHaveClass(
      "text-cream",
      "before:bg-current",
    );
  });

  it("merges a caller className over the default bottom margin", () => {
    render(<Eyebrow className="mb-0">Historique</Eyebrow>);
    const eyebrow = screen.getByText("Historique");
    expect(eyebrow).toHaveClass("mb-0");
    expect(eyebrow).not.toHaveClass("mb-4");
  });
});
