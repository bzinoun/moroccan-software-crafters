import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostIt } from "./PostIt";

describe("PostIt", () => {
  it("puts the French narrow space before a colon and a question mark", () => {
    render(<PostIt>Prochain hôte : votre entreprise ?</PostIt>);
    expect(screen.getByText(/Prochain hôte/).textContent).toBe(
      "Prochain hôte\u202f: votre entreprise\u202f?",
    );
  });

  it("uses the yellow color when none is given", () => {
    render(<PostIt>note</PostIt>);
    expect(screen.getByText("note")).toHaveClass("bg-postit-yellow");
  });

  it.each([
    ["pink", "bg-postit-pink"],
    ["green", "bg-postit-green"],
    ["blue", "bg-postit-blue"],
    ["orange", "bg-postit-orange"],
    ["yellow", "bg-postit-yellow"],
  ] as const)("uses the %s post-it color", (color, background) => {
    render(<PostIt color={color}>note</PostIt>);
    const note = screen.getByText("note");
    expect(note.className.match(/bg-postit-\w+/g)).toEqual([background]);
  });

  it("renders a small caption line after the text", () => {
    const { container } = render(
      <PostIt color="pink" caption="2026">
        Un sujet de meetup
      </PostIt>,
    );
    const caption = screen.getByText("2026");
    expect(caption.tagName).toBe("SMALL");
    expect(container.firstElementChild?.firstChild?.textContent).toBe(
      "Un sujet de meetup",
    );
    expect(container.firstElementChild?.lastElementChild).toBe(caption);
  });

  it("renders no caption element without a caption", () => {
    const { container } = render(<PostIt>note</PostIt>);
    expect(container.querySelector("small")).toBeNull();
  });

  // A text size from the caller must not drop the line height: tailwind-merge
  // removes a leading-* class there, so the component uses an arbitrary property.
  it("keeps its line height when the caller sets another font size", () => {
    render(<PostIt className="text-[1.5rem]">note</PostIt>);
    const note = screen.getByText("note");
    expect(note).toHaveClass("text-[1.5rem]", "[line-height:1.15]");
    expect(note).not.toHaveClass("text-[1.35rem]");
  });

  it("lets a caller class replace the default width", () => {
    render(<PostIt className="w-[200px]">note</PostIt>);
    const note = screen.getByText("note");
    expect(note).toHaveClass("w-[200px]");
    expect(note).not.toHaveClass("w-[170px]");
  });
});
