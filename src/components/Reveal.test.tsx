import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { inMemoryViewport } from "@/test/in-memory-viewport";
import { renderWithPorts } from "@/test/ports";
import { Reveal } from "./Reveal";

const HEIGHT = 768;

describe("Reveal", () => {
  it("shows its content when the browser has no IntersectionObserver", () => {
    render(<Reveal>Hôte : une entreprise</Reveal>);
    const reveal = screen.getByText(/une entreprise/);
    expect(reveal).toBeInTheDocument();
    expect(reveal).not.toHaveAttribute("data-reveal");
  });

  it("renders the content without any hidden state in the server HTML (no JavaScript)", () => {
    const html = renderToString(<Reveal>Les formules</Reveal>);
    expect(html).toContain("Les formules");
    expect(html).not.toContain("data-reveal");
  });

  it("shows its content when the browser cannot report visibility", () => {
    const viewport = inMemoryViewport({ canWatch: false });
    renderWithPorts(<Reveal>Les formules</Reveal>, { viewport });
    expect(screen.getByText("Les formules")).not.toHaveAttribute("data-reveal");
    expect(viewport.watches).toHaveLength(0);
  });

  it("waits, out of sight, once mounted, until it scrolls into view", () => {
    // Default: well below the fold (the viewport is 768px high).
    renderWithPorts(<Reveal>Les formules</Reveal>, {
      viewport: inMemoryViewport(),
    });
    expect(screen.getByText("Les formules")).toHaveAttribute(
      "data-reveal",
      "waiting",
    );
  });

  it("never hides content that is already in view at load, so it cannot flash", () => {
    const viewport = inMemoryViewport({ height: HEIGHT, top: HEIGHT - 61 });
    renderWithPorts(<Reveal>Les formules</Reveal>, { viewport });
    expect(screen.getByText("Les formules")).not.toHaveAttribute("data-reveal");
    expect(viewport.watches).toHaveLength(0);
  });

  it("hides content that sits within 60px of the viewport bottom, as the old site did", () => {
    const viewport = inMemoryViewport({ height: HEIGHT, top: HEIGHT - 60 });
    renderWithPorts(<Reveal>Les formules</Reveal>, { viewport });
    expect(screen.getByText("Les formules")).toHaveAttribute(
      "data-reveal",
      "waiting",
    );
  });

  it("watches itself with a 60px bottom margin", () => {
    const viewport = inMemoryViewport();
    renderWithPorts(<Reveal>Les formules</Reveal>, { viewport });
    expect(viewport.watches).toHaveLength(1);
    expect(viewport.watches[0]!.element).toBe(screen.getByText("Les formules"));
    expect(viewport.watches[0]!.rootMargin).toBe("0px 0px -60px 0px");
  });

  it("stays waiting while out of view, then shows once and stops watching", () => {
    const viewport = inMemoryViewport();
    renderWithPorts(<Reveal>Les formules</Reveal>, { viewport });
    const reveal = screen.getByText("Les formules");

    expect(reveal).toHaveAttribute("data-reveal", "waiting");
    expect(viewport.watches[0]!.stopped).toBe(false);

    act(() => viewport.becomeVisible());
    expect(reveal).toHaveAttribute("data-reveal", "shown");
    expect(viewport.watches[0]!.stopped).toBe(true);
  });

  it("stays waiting when the observer reports an entry that is not in view", () => {
    const viewport = inMemoryViewport();
    renderWithPorts(<Reveal>Les formules</Reveal>, { viewport });
    const reveal = screen.getByText("Les formules");

    act(() => viewport.report({ isIntersecting: false }));
    expect(reveal).toHaveAttribute("data-reveal", "waiting");
    expect(viewport.watches[0]!.stopped).toBe(false);

    act(() => viewport.report({ isIntersecting: true }));
    expect(reveal).toHaveAttribute("data-reveal", "shown");
  });

  it("stops watching when it unmounts", () => {
    const viewport = inMemoryViewport();
    const { unmount } = renderWithPorts(<Reveal>Les formules</Reveal>, {
      viewport,
    });
    expect(viewport.watches[0]!.stopped).toBe(false);
    unmount();
    expect(viewport.watches[0]!.stopped).toBe(true);
  });

  it("applies the waiting look only to people who accept motion", () => {
    render(<Reveal>Les formules</Reveal>);
    const classes = screen.getByText("Les formules").className.split(" ");
    const waitingLook = classes.filter(
      (name) => name.includes("opacity-0") || name.includes("translate-y-4"),
    );
    expect(waitingLook.sort()).toEqual([
      "motion-safe:data-[reveal=waiting]:opacity-0",
      "motion-safe:data-[reveal=waiting]:translate-y-4",
    ]);
    const transition = classes.filter((name) => name.includes("transition"));
    expect(transition.every((name) => name.startsWith("motion-safe:"))).toBe(
      true,
    );
  });

  it("renders the element it is asked to, so a card or list item keeps its own box", () => {
    render(
      <ol>
        <Reveal as="li" className="custom-box">
          Networking
        </Reveal>
      </ol>,
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveTextContent("Networking");
    expect(item).toHaveClass("custom-box");
  });

  it("passes native attributes through", () => {
    render(
      <Reveal id="offres" aria-label="Formules">
        x
      </Reveal>,
    );
    expect(screen.getByLabelText("Formules")).toHaveAttribute("id", "offres");
  });
});
