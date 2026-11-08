import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Lead } from "./Lead";

const INTRO = "Des rencontres entre développeurs, un samedi matin.";

describe("Lead", () => {
  it("renders the intro as a paragraph", () => {
    render(<Lead>{INTRO}</Lead>);
    const lead = screen.getByText(INTRO);
    expect(lead.tagName).toBe("P");
  });

  it("uses a different text color on a dark surface", () => {
    render(
      <>
        <Lead>Clair</Lead>
        <Lead tone="dark">Sombre</Lead>
      </>,
    );
    expect(screen.getByText("Sombre")).toHaveClass("text-on-dark");
    expect(screen.getByText("Clair")).not.toHaveClass("text-on-dark");
  });

  it("puts the French narrow space before a colon in a string child", () => {
    render(<Lead>Prochain hôte : votre entreprise ?</Lead>);
    expect(screen.getByText(/Prochain hôte/).textContent).toBe(
      "Prochain hôte\u202f: votre entreprise\u202f?",
    );
  });

  it("lets a caller className win over the default measure", () => {
    render(<Lead className="max-w-[64ch]">{INTRO}</Lead>);
    const lead = screen.getByText(INTRO);
    expect(lead).toHaveClass("max-w-[64ch]");
    expect(lead).not.toHaveClass("max-w-[60ch]");
  });
});
