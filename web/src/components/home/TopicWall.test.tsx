import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadEvents, loadHome } from "@/content/load";
import { topicsFromEvents } from "@/lib/home-data";
import { TopicWall } from "./TopicWall";

// Props are built from the real content files, as the home page passes them.
// Expected values are literals read from content/events.json (newest first,
// unique in lower case) and content/home.json (topics.title, topics.limit 10).
const LABEL = "Sujets discutés lors des dernières éditions";

function renderWall() {
  const home = loadHome();
  render(
    <TopicWall
      label={home.topics.title}
      topics={topicsFromEvents(loadEvents(), home.topics.limit)}
    />,
  );
  return screen.getByRole("group", { name: LABEL });
}

describe("TopicWall", () => {
  it("is a named group of the ten latest distinct topics, newest first", () => {
    const wall = renderWall();
    expect(wall.children).toHaveLength(10);
    expect(wall.children[0]).toHaveTextContent("AI factory");
    expect(wall.children[1]).toHaveTextContent("Responsabilité humaine");
    expect(wall.children[2]).toHaveTextContent("Sécurité du vibe coding");
    expect(wall.children[9]).toHaveTextContent("Modèle maison vs sur étagère");
  });

  it("prints the year of each topic in a small line under the text", () => {
    const wall = renderWall();
    const note = wall.children[0] as HTMLElement;
    const year = note.querySelector("small");
    expect(year).toHaveTextContent("2026");
    expect(note.firstChild?.textContent).toBe("AI factory");
  });

  it("uses the French narrow space before a colon or a question mark", () => {
    render(
      <TopicWall
        label="Sujets"
        topics={[{ topic: "Rust : pourquoi ?", year: "2025", tone: "default" }]}
      />,
    );
    expect(screen.getByText(/^Rust/).textContent).toContain(
      "Rust : pourquoi ?",
    );
  });

  it("cycles the post-it colors yellow, pink, green, blue, orange", () => {
    const wall = renderWall();
    const expected = [
      "bg-postit-yellow",
      "bg-postit-pink",
      "bg-postit-green",
      "bg-postit-blue",
      "bg-postit-orange",
      "bg-postit-yellow",
    ];
    expected.forEach((color, i) => {
      expect(wall.children[i]).toHaveClass(color);
      expect(wall.children[i]?.className.match(/bg-postit-\w+/g)).toEqual([
        color,
      ]);
    });
  });

  it("tilts the notes: odd -2deg, even 1.5deg, every third -0.5deg", () => {
    const wall = renderWall();
    // Position 1, 2, 3, 4, 5, 6 (the old odd, even and 3n rules; 3n wins).
    expect(wall.children[0]).toHaveClass("-rotate-2");
    expect(wall.children[1]).toHaveClass("rotate-[1.5deg]");
    expect(wall.children[2]).toHaveClass("-rotate-[0.5deg]");
    expect(wall.children[3]).toHaveClass("rotate-[1.5deg]");
    expect(wall.children[4]).toHaveClass("-rotate-2");
    expect(wall.children[5]).toHaveClass("-rotate-[0.5deg]");
    expect(wall.children[5]).not.toHaveClass("rotate-[1.5deg]");
    expect(wall.children[8]).toHaveClass("-rotate-[0.5deg]");
  });

  it("sizes each note to its text, up to 240px, with the topic wall padding", () => {
    const wall = renderWall();
    const note = wall.children[0];
    expect(note).toHaveClass("w-auto", "max-w-60", "text-[1.25rem]");
    expect(note).toHaveClass("p-[12px_16px_14px]");
    expect(note).not.toHaveClass("w-[170px]", "text-[1.35rem]");
    // The post-it line height must survive the larger font size.
    expect(note).toHaveClass("[line-height:1.15]");
  });

  it("centers the wrapping notes 48px below the agenda", () => {
    const wall = renderWall();
    expect(wall).toHaveClass(
      "mt-12",
      "flex",
      "flex-wrap",
      "justify-center",
      "gap-3.5",
    );
  });

  it("renders an empty group when there is no topic", () => {
    render(<TopicWall label="Sujets" topics={[]} />);
    expect(screen.getByRole("group", { name: "Sujets" }).children).toHaveLength(
      0,
    );
  });
});
