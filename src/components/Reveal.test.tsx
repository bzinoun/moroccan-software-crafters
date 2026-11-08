import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./Reveal";

// A controllable IntersectionObserver: jsdom has none.
class FakeObserver {
  static instances: FakeObserver[] = [];
  observed: Element[] = [];
  disconnected = false;
  constructor(
    private callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    FakeObserver.instances.push(this);
  }
  observe(element: Element) {
    this.observed.push(element);
  }
  unobserve() {}
  disconnect() {
    this.disconnected = true;
  }
  takeRecords() {
    return [];
  }
  report(isIntersecting: boolean) {
    this.callback(
      this.observed.map(
        (target) => ({ isIntersecting, target }) as IntersectionObserverEntry,
      ),
      this as unknown as IntersectionObserver,
    );
  }
}

function lastObserver() {
  const observer = FakeObserver.instances.at(-1);
  if (!observer) throw new Error("no IntersectionObserver was created");
  return observer;
}

// jsdom has no layout: every rect is zero, so each test places the element itself.
function placeAt(top: number) {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: top + 100,
    left: 0,
    right: 100,
    width: 100,
    height: 100,
    x: 0,
    y: top,
    toJSON: () => ({}),
  });
}

describe("Reveal", () => {
  beforeEach(() => {
    FakeObserver.instances = [];
    // Default: well below the fold (the test viewport is 768px high).
    placeAt(2000);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

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

  it("waits, out of sight, once mounted, until it scrolls into view", () => {
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    render(<Reveal>Les formules</Reveal>);
    expect(screen.getByText("Les formules")).toHaveAttribute(
      "data-reveal",
      "waiting",
    );
  });

  it("never hides content that is already in view at load, so it cannot flash", () => {
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    placeAt(window.innerHeight - 61);
    render(<Reveal>Les formules</Reveal>);
    expect(screen.getByText("Les formules")).not.toHaveAttribute("data-reveal");
    expect(FakeObserver.instances).toHaveLength(0);
  });

  it("hides content that sits within 60px of the viewport bottom, as the old site did", () => {
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    placeAt(window.innerHeight - 60);
    render(<Reveal>Les formules</Reveal>);
    expect(screen.getByText("Les formules")).toHaveAttribute(
      "data-reveal",
      "waiting",
    );
  });

  it("observes itself with a 60px bottom margin", () => {
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    render(<Reveal>Les formules</Reveal>);
    const observer = lastObserver();
    expect(observer.observed).toEqual([screen.getByText("Les formules")]);
    expect(observer.options?.rootMargin).toBe("0px 0px -60px 0px");
  });

  it("stays waiting while out of view, then shows once and stops observing", () => {
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    render(<Reveal>Les formules</Reveal>);
    const reveal = screen.getByText("Les formules");
    const observer = lastObserver();

    act(() => observer.report(false));
    expect(reveal).toHaveAttribute("data-reveal", "waiting");
    expect(observer.disconnected).toBe(false);

    act(() => observer.report(true));
    expect(reveal).toHaveAttribute("data-reveal", "shown");
    expect(observer.disconnected).toBe(true);
  });

  it("stops observing when it unmounts", () => {
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    const { unmount } = render(<Reveal>Les formules</Reveal>);
    const observer = lastObserver();
    unmount();
    expect(observer.disconnected).toBe(true);
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
