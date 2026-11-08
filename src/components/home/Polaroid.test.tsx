import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Polaroid } from "./Polaroid";

// Photo URLs and captions are the real values of content/home.json
// (hero.collage) after heroCollage(): meetup photo path and caption.
const SRC = "/assets/img/meetups/2026-10-sg-gscm-5.jpg";
const CAPTION = "SG GSCM · oct. 2026";

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
      <Polaroid index={0} src={SRC} caption="Édition : AXA" />,
    );
    expect(container.querySelector("figcaption")?.textContent).toBe(
      "Édition\u202f: AXA",
    );
  });
});

describe("Polaroid placement by index", () => {
  it("tilts the first photo by -3deg on layer 2", () => {
    expect(renderPolaroid(0)).toHaveClass("-rotate-3", "z-2", "top-0");
  });

  it("tilts the second photo by 4deg on layer 4, on the right edge", () => {
    expect(renderPolaroid(1)).toHaveClass("rotate-4", "z-4", "right-0");
  });

  it("tilts the third photo by -1.5deg on layer 3, at the bottom left", () => {
    expect(renderPolaroid(2)).toHaveClass(
      "-rotate-[1.5deg]",
      "z-3",
      "bottom-0",
      "left-0",
    );
  });

  it("shrinks the photo heights below lg and restores them from lg", () => {
    expect(renderPolaroid(0)).toHaveClass("h-[210px]", "lg:h-[260px]");
    expect(renderPolaroid(1)).toHaveClass("h-[180px]", "lg:h-[240px]");
    expect(renderPolaroid(2)).toHaveClass("h-[160px]", "lg:h-[210px]");
  });

  it("keeps a framed absolute figure for a photo beyond the third", () => {
    expect(renderPolaroid(3)).toHaveClass("absolute", "bg-white");
  });
});
