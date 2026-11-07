import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./Section";

describe("Section", () => {
  it("renders a section with its anchor id and the content inside the site wrap", () => {
    const { container } = render(
      <Section id="historique" aria-label="Historique">
        <p>contenu</p>
      </Section>,
    );
    const section = screen.getByRole("region", { name: "Historique" });
    expect(section.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("id", "historique");
    const wrap = container.querySelector("section > div");
    expect(wrap).toHaveClass("mx-auto", "max-w-wrap");
    expect(wrap).toHaveTextContent("contenu");
  });

  it("is a plain band with 88px of padding above and below by default", () => {
    render(<Section aria-label="Format">x</Section>);
    const section = screen.getByRole("region", { name: "Format" });
    expect(section).toHaveClass("py-22");
    expect(section.className).not.toMatch(/\bbg-/);
  });

  it("uses the soft sage background for the alt variant", () => {
    render(
      <Section variant="alt" aria-label="Historique">
        x
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Historique" })).toHaveClass(
      "bg-sage-soft",
      "py-22",
    );
  });

  it("uses 56px of padding when tight", () => {
    render(
      <Section tight aria-label="Appel">
        x
      </Section>,
    );
    const section = screen.getByRole("region", { name: "Appel" });
    expect(section).toHaveClass("py-14");
    expect(section).not.toHaveClass("py-22");
  });

  it("keeps the alt background when tight", () => {
    render(
      <Section variant="alt" tight aria-label="Appel">
        x
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Appel" })).toHaveClass(
      "bg-sage-soft",
      "py-14",
    );
  });

  it("makes the dark variant a green-deep surface with white headings, a sage emphasis and a sage focus ring", () => {
    render(
      <Section variant="dark" id="socrates" aria-label="La conférence">
        x
      </Section>,
    );
    const section = screen.getByRole("region", { name: "La conférence" });
    expect(section).toHaveClass(
      "bg-green-deep",
      "text-cream",
      "**:focus-visible:outline-sage",
      "[&_h2]:text-white",
      "[&_h3]:text-white",
      "[&_h2_em]:text-sage",
      "[&_h2_em]:bg-none",
    );
  });

  it("merges a caller className on the section and containerClassName on the wrap", () => {
    const { container } = render(
      <Section
        className="overflow-hidden"
        containerClassName="grid gap-12"
        aria-label="Hero"
      >
        x
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Hero" })).toHaveClass(
      "overflow-hidden",
      "py-22",
    );
    expect(container.querySelector("section > div")).toHaveClass(
      "grid",
      "gap-12",
      "max-w-wrap",
    );
  });
});
