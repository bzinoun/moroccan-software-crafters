import { describe, expect, it } from "vitest";
import { frenchSpacing } from "./french";

const NNBSP = " ";
const NBSP = " ";

describe("frenchSpacing", () => {
  it("replaces a normal space before ? ! : ; with a narrow no-break space", () => {
    expect(frenchSpacing("Prochain hôte : votre entreprise ?")).toBe(
      `Prochain hôte${NNBSP}: votre entreprise${NNBSP}?`,
    );
    expect(frenchSpacing("Oui ! Non ; peut-être")).toBe(`Oui${NNBSP}! Non${NNBSP}; peut-être`);
  });

  it("replaces a no-break space too", () => {
    expect(frenchSpacing(`Sujet${NBSP}: code`)).toBe(`Sujet${NNBSP}: code`);
  });

  it("leaves text without a space before the punctuation unchanged", () => {
    expect(frenchSpacing("https://example.org/?q=1")).toBe("https://example.org/?q=1");
    expect(frenchSpacing("Moroccan Software Crafters, association à but non lucratif.")).toBe(
      "Moroccan Software Crafters, association à but non lucratif.",
    );
  });
});
