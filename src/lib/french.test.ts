import { describe, expect, it } from "vitest";
import { countLabel, frenchSpacing } from "./french";

const NNBSP = "\u202f";
const NBSP = "\u00a0";

describe("frenchSpacing", () => {
  it("replaces a normal space before ? ! : ; with a narrow no-break space", () => {
    expect(frenchSpacing("Prochain hôte : votre entreprise ?")).toBe(
      `Prochain hôte${NNBSP}: votre entreprise${NNBSP}?`,
    );
    expect(frenchSpacing("Oui ! Non ; peut-être")).toBe(
      `Oui${NNBSP}! Non${NNBSP}; peut-être`,
    );
  });

  it("replaces a no-break space too", () => {
    expect(frenchSpacing(`Sujet${NBSP}: code`)).toBe(`Sujet${NNBSP}: code`);
  });

  it("leaves text without a space before the punctuation unchanged", () => {
    expect(frenchSpacing("https://example.org/?q=1")).toBe(
      "https://example.org/?q=1",
    );
    expect(
      frenchSpacing(
        "Moroccan Software Crafters, association à but non lucratif.",
      ),
    ).toBe("Moroccan Software Crafters, association à but non lucratif.");
  });
});

describe("countLabel", () => {
  it.each([
    [0, "0 inscrit"],
    [1, "1 inscrit"],
    [2, "2 inscrits"],
    [110, "110 inscrits"],
  ])("writes %i registrations as %s", (count, label) => {
    expect(countLabel(count, "inscrit")).toBe(label);
  });

  it("takes an explicit plural for a word that does not add an s", () => {
    expect(countLabel(1, "festival", "festivals")).toBe("1 festival");
    expect(countLabel(3, "journal", "journaux")).toBe("3 journaux");
  });
});
