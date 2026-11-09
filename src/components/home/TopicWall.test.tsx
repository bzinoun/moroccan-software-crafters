import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TopicNote } from "@/lib/home-data";
import { TopicWall, type TopicWallNote } from "./TopicWall";

// Props are a small fixture written here: the component draws what it gets,
// one note per topic, in the given order.
const TOPICS: TopicNote[] = [
  { topic: "Alpha", year: "2026", tone: "default" },
  { topic: "Bravo", year: "2025", tone: "pink" },
  { topic: "Charlie", year: "2025", tone: "green" },
  { topic: "Delta", year: "2024", tone: "blue" },
  { topic: "Echo", year: "2023", tone: "orange" },
  { topic: "Foxtrot", year: "2022", tone: "default" },
];

function renderWall(topics: readonly TopicWallNote[] = TOPICS) {
  render(<TopicWall label="Sujets discutés" topics={topics} />);
  return screen.getByRole("group", { name: "Sujets discutés" });
}

describe("TopicWall", () => {
  it("is a named group with one note per topic, in the given order", () => {
    const wall = renderWall();
    expect(wall.children).toHaveLength(TOPICS.length);
    TOPICS.forEach((t, i) => {
      expect(wall.children[i]?.firstChild?.textContent).toBe(t.topic);
    });
  });

  it("prints the year of each topic in a small line under the text", () => {
    const wall = renderWall();
    const note = wall.children[1] as HTMLElement;
    expect(note.querySelector("small")).toHaveTextContent("2025");
  });

  it("uses the French narrow space before a colon or a question mark", () => {
    renderWall([{ topic: "Rust : pourquoi ?", year: "2025", tone: "default" }]);
    expect(screen.getByText(/^Rust/).firstChild?.textContent).toBe(
      "Rust\u202f: pourquoi\u202f?",
    );
  });

  it("gives each note the color of its tone", () => {
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
      expect(wall.children[i]?.className.match(/bg-postit-\w+/g)).toEqual([
        color,
      ]);
    });
  });

  it("centers the notes of the wall", () => {
    expect(renderWall()).toHaveClass("justify-center");
  });

  it("renders nothing when there is no topic", () => {
    const { container } = render(<TopicWall label="Sujets" topics={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("keeps two notes with the same topic and year apart", () => {
    const twin: TopicWallNote = { topic: "Rust", year: "2026", tone: "pink" };
    render(<TopicWall label="Sujets" topics={[twin, twin]} />);
    expect(screen.getAllByText("Rust")).toHaveLength(2);
  });
});

describe("TopicWall board variant", () => {
  const BOARD: TopicWallNote[] = TOPICS.map((t, i) => ({
    ...t,
    from: i === 0 ? "Acme Corp" : "Casablanca",
  }));

  function renderBoard(topics: readonly TopicWallNote[] = BOARD) {
    render(
      <TopicWall variant="board" label="Le mur des sujets" topics={topics} />,
    );
    return screen.getByRole("group", { name: "Le mur des sujets" });
  }

  it("shows every topic it gets, not only ten", () => {
    const many = Array.from({ length: 25 }, (_, i) => ({
      topic: `Sujet ${i}`,
      year: "2025",
      tone: "default" as const,
    }));
    expect(renderBoard(many).children).toHaveLength(25);
  });

  it("prints the year and the host or city in the small line", () => {
    const first = renderBoard().children[0] as HTMLElement;
    expect(first.firstChild?.textContent).toBe("Alpha");
    expect(first.querySelector("small")).toHaveTextContent("2026 · Acme Corp");
  });

  it("keeps the year alone when a note has no origin", () => {
    renderBoard([{ topic: "Rust", year: "2025", tone: "default" }]);
    expect(screen.getByText("2025")).toBeInTheDocument();
  });

  it("starts the notes at the left, unlike the centered wall", () => {
    const board = renderBoard();
    expect(board).toHaveClass("justify-start");
    expect(board).not.toHaveClass("justify-center");
  });

  it("colors the notes as the wall does", () => {
    const board = renderBoard();
    expect(board.children[0]).toHaveClass("bg-postit-yellow");
    expect(board.children[1]).toHaveClass("bg-postit-pink");
    expect(board.children[2]).toHaveClass("bg-postit-green");
  });
});
