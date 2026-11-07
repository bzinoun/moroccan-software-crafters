import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Lead } from "./Lead";

// content/home.json, history.lead and format.lead.
const HISTORY_LEAD =
  "Des Code Snacks de 2019 aux meetups de 2026, en passant par quatre éditions de SoCraTes Maroc.";

describe("Lead", () => {
  it("renders the intro as a paragraph of 1.15rem soft ink text, 60 characters wide", () => {
    render(<Lead>{HISTORY_LEAD}</Lead>);
    const lead = screen.getByText(HISTORY_LEAD);
    expect(lead.tagName).toBe("P");
    expect(lead).toHaveClass("max-w-[60ch]", "text-[1.15rem]", "text-ink-soft");
  });

  it("uses the on-dark color on a dark surface", () => {
    render(<Lead tone="dark">{HISTORY_LEAD}</Lead>);
    const lead = screen.getByText(HISTORY_LEAD);
    expect(lead).toHaveClass("text-on-dark");
    expect(lead).not.toHaveClass("text-ink-soft");
  });

  it("puts the French narrow space before a colon in a string child", () => {
    render(<Lead>Prochain hôte : votre entreprise ?</Lead>);
    expect(screen.getByText(/Prochain hôte/).textContent).toBe(
      "Prochain hôte\u202f: votre entreprise\u202f?",
    );
  });

  it("lets a caller widen the measure and add a margin", () => {
    render(
      <Lead className="mx-auto mb-[1.8rem] max-w-[64ch]">{HISTORY_LEAD}</Lead>,
    );
    const lead = screen.getByText(HISTORY_LEAD);
    expect(lead).toHaveClass("max-w-[64ch]", "mx-auto", "mb-[1.8rem]");
    expect(lead).not.toHaveClass("max-w-[60ch]");
  });
});
