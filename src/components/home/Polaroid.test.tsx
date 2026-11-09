import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Polaroid } from "./Polaroid";

// A fixture written here: the polaroid draws the photo and the caption it gets.
const SRC = "/assets/img/meetups/2026-10-alpha-5.jpg";
const CAPTION = "Alpha · oct. 2026";

function renderPolaroid(index: number) {
  const { container } = render(
    <Polaroid index={index} src={SRC} caption={CAPTION} />,
  );
  return container.querySelector("figure") as HTMLElement;
}

describe("Polaroid content", () => {
  it("renders a decorative photo and its caption in one figure", () => {
    const figure = renderPolaroid(0);
    const img = figure.querySelector("img") as HTMLImageElement;
    expect(img).toHaveAttribute("src", SRC);
    expect(img).toHaveAttribute("alt", "");
    expect(figure.querySelector("figcaption")?.textContent).toBe(CAPTION);
  });

  it("puts the French narrow space before a colon in the caption", () => {
    const { container } = render(
      <Polaroid index={0} src={SRC} caption="Édition : Alpha" />,
    );
    expect(container.querySelector("figcaption")?.textContent).toBe(
      "Édition\u202f: Alpha",
    );
  });
});

describe("Polaroid placement by index", () => {
  it("gives each of the first three photos its own placement", () => {
    const placements = [0, 1, 2].map((i) => renderPolaroid(i).className);
    expect(new Set(placements).size).toBe(3);
  });

  it("keeps a figure with its photo and caption for a photo beyond the third", () => {
    const figure = renderPolaroid(3);
    expect(figure.querySelector("img")).toHaveAttribute("src", SRC);
    expect(figure.querySelector("figcaption")).toHaveTextContent(CAPTION);
  });
});
