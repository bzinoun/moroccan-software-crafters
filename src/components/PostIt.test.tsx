import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostIt } from "./PostIt";

// content/home.json, hero.postit.
const HERO_POSTIT = "Prochain hôte : votre entreprise ?";

describe("PostIt", () => {
  it("is a yellow hand-written note by default, with the French narrow space", () => {
    render(<PostIt>{HERO_POSTIT}</PostIt>);
    const note = screen.getByText(/Prochain hôte/);
    expect(note.textContent).toBe(
      "Prochain hôte\u202f: votre entreprise\u202f?",
    );
    expect(note).toHaveClass(
      "bg-postit-yellow",
      "font-hand",
      "text-[1.35rem]",
      "w-[170px]",
      "text-ink",
    );
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
    expect(note).toHaveClass(background);
    expect(note.className.match(/bg-postit-\w+/g)).toEqual([background]);
  });

  it("has square corners and the post-it shadow", () => {
    render(<PostIt>note</PostIt>);
    const note = screen.getByText("note");
    expect(note).toHaveClass("shadow-[0_10px_18px_rgba(0,0,0,0.12)]");
    expect(note.className).not.toMatch(/\brounded/);
  });

  it("renders a small caption line under the text", () => {
    // former `assets/js/home.js` (`git show 1353207:assets/js/home.js`) topic wall: topic text with its year in a small line.
    const { container } = render(
      <PostIt color="pink" caption="2026">
        Sécurité du vibe coding
      </PostIt>,
    );
    const caption = screen.getByText("2026");
    expect(caption.tagName).toBe("SMALL");
    expect(caption).toHaveClass("block", "font-body", "text-[0.7rem]");
    expect(container.firstElementChild?.firstChild?.textContent).toBe(
      "Sécurité du vibe coding",
    );
    expect(container.firstElementChild?.lastElementChild).toBe(caption);
  });

  it("renders no caption element without a caption", () => {
    const { container } = render(<PostIt>note</PostIt>);
    expect(container.querySelector("small")).toBeNull();
  });

  it("keeps its line height when the caller sets another font size", () => {
    // tailwind-merge drops a leading-* utility when a later text size follows.
    render(
      <PostIt className="w-[200px] rotate-[-3deg] text-[1.5rem]">note</PostIt>,
    );
    const note = screen.getByText("note");
    expect(note).toHaveClass("text-[1.5rem]", "w-[200px]", "rotate-[-3deg]");
    expect(note).not.toHaveClass("text-[1.35rem]", "w-[170px]");
    expect(note).toHaveClass("[line-height:1.15]");
  });

  it("lets a caller replace the padding", () => {
    // Topic wall: 12px 16px 14px.
    render(<PostIt className="p-[12px_16px_14px]">note</PostIt>);
    const note = screen.getByText("note");
    expect(note).toHaveClass("p-[12px_16px_14px]");
    expect(note).not.toHaveClass("p-[16px_18px_20px]");
  });
});
