import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroEm } from "./HeroEm";

describe("HeroEm", () => {
  it("renders the <em> of the JSON title as an element, the rest as text", () => {
    const { container } = render(
      <h1>
        <HeroEm text="Des samedis matin où l'on parle <em>vraiment</em> de code." />
      </h1>,
    );
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("Des samedis matin où l'on parle vraiment de code.");
    const em = h1?.querySelector("em");
    expect(em?.textContent).toBe("vraiment");
    expect(h1?.querySelectorAll("*")).toHaveLength(1);
  });

  it("renders a title without <em> as plain text", () => {
    const { container } = render(<HeroEm text="Pas de conférenciers vedettes, des conversations." />);
    expect(container.textContent).toBe("Pas de conférenciers vedettes, des conversations.");
    expect(container.querySelector("em")).toBeNull();
  });

  it("applies the French narrow space to the text parts", () => {
    const { container } = render(<HeroEm text="Prochain hôte : <em>vous</em> ?" />);
    expect(container.textContent).toBe("Prochain hôte : vous ?");
  });
});
