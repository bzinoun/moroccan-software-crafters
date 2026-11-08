import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./Section";

describe("Section", () => {
  it("renders a named region with its anchor id and the content inside", () => {
    render(
      <Section id="historique" aria-label="Historique">
        <p>contenu</p>
      </Section>,
    );
    const section = screen.getByRole("region", { name: "Historique" });
    expect(section.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("id", "historique");
    expect(section).toHaveTextContent("contenu");
  });

  it("wraps the content in one container element", () => {
    const { container } = render(
      <Section aria-label="Format">
        <p>contenu</p>
      </Section>,
    );
    const wrap = container.querySelector("section > div");
    expect(wrap).toHaveTextContent("contenu");
    expect(container.querySelectorAll("section > div")).toHaveLength(1);
  });

  it("gives the alt variant a background and the plain variant none", () => {
    render(
      <>
        <Section aria-label="Plain">x</Section>
        <Section variant="alt" aria-label="Alt">
          x
        </Section>
      </>,
    );
    expect(screen.getByRole("region", { name: "Plain" }).className).not.toMatch(
      /\bbg-/,
    );
    expect(screen.getByRole("region", { name: "Alt" })).toHaveClass(
      "bg-sage-soft",
    );
  });

  it("uses less padding when tight, and keeps the variant", () => {
    render(
      <>
        <Section aria-label="Normal">x</Section>
        <Section variant="alt" tight aria-label="Tight">
          x
        </Section>
      </>,
    );
    const normal = screen.getByRole("region", { name: "Normal" });
    const tight = screen.getByRole("region", { name: "Tight" });
    expect(tight.className).not.toBe(normal.className);
    expect(tight).toHaveClass("py-14", "bg-sage-soft");
    expect(tight).not.toHaveClass("py-22");
  });

  it("restyles the focus ring on the dark variant", () => {
    render(
      <Section variant="dark" aria-label="La conférence">
        x
      </Section>,
    );
    expect(screen.getByRole("region", { name: "La conférence" })).toHaveClass(
      "**:focus-visible:outline-sage",
    );
  });

  it("applies a caller className on the section and containerClassName on the wrap", () => {
    const { container } = render(
      <Section
        className="overflow-hidden"
        containerClassName="gap-12"
        aria-label="Hero"
      >
        x
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Hero" })).toHaveClass(
      "overflow-hidden",
    );
    expect(container.querySelector("section > div")).toHaveClass("gap-12");
  });
});
