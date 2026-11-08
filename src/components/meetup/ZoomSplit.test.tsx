import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ZoomSplit } from "./ZoomSplit";

const steps = [
  { title: "Pitch", text: "Say it in one sentence." },
  { title: "Group", text: "Close topics merge into bubbles." },
  { title: "Vote", text: "One vote per person and per bubble." },
];
const image = {
  src: "/assets/img/test-wall.jpg",
  alt: "A participant in front of the post-it wall",
};

function renderZoom(
  overrides: Partial<{ width: number; height: number }> = {},
) {
  const { container } = render(
    <ZoomSplit
      id="marketplace"
      eyebrow="Zoom"
      title="How the round tables start"
      steps={steps}
      image={{ ...image, ...overrides }}
    />,
  );
  return container.querySelector("section") as HTMLElement;
}

describe("ZoomSplit", () => {
  it("is the section named by its level 2 title", () => {
    const section = renderZoom();
    expect(section).toHaveAttribute("id", "marketplace");
    expect(
      screen.getByRole("region", { name: "How the round tables start" }),
    ).toBe(section);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "How the round tables start",
      }),
    ).toBeInTheDocument();
  });

  it("shows the eyebrow", () => {
    renderZoom();
    expect(screen.getByText("Zoom")).toBeInTheDocument();
  });

  it("shows the photo with its alt text, lazy, at the default 800 by 771", () => {
    renderZoom();
    const img = screen.getByRole("img", { name: image.alt });
    expect(img).toHaveAttribute("src", image.src);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("width", "800");
    expect(img).toHaveAttribute("height", "771");
  });

  it("uses the size given for the photo", () => {
    renderZoom({ width: 400, height: 300 });
    const img = screen.getByRole("img", { name: image.alt });
    expect(img).toHaveAttribute("width", "400");
    expect(img).toHaveAttribute("height", "300");
  });

  it("lists one numbered item per step beside the photo", () => {
    renderZoom();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(steps.length);
    expect(items[2]).toHaveTextContent("One vote per person and per bubble.");
  });

  it("puts the photo first in the source, then the text", () => {
    const section = renderZoom();
    const grid = section.firstElementChild as HTMLElement;
    expect(grid.firstElementChild?.tagName).toBe("IMG");
    expect(grid.lastElementChild).toContainElement(screen.getByRole("list"));
  });
});
