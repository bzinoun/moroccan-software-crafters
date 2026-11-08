import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LogoImage } from "./LogoImage";

const FALLBACK = <span data-testid="fallback">AX</span>;

function stubLoadState(complete: boolean, naturalWidth: number) {
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(
    complete,
  );
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(
    naturalWidth,
  );
}

afterEach(() => vi.restoreAllMocks());

describe("LogoImage", () => {
  it("renders the image with its attributes while it loads", () => {
    render(
      <LogoImage
        src="/assets/img/logos/axa.png"
        alt="AXA Assurance Maroc"
        width={120}
        height={120}
        className="size-21"
        fallback={FALLBACK}
      />,
    );
    const logo = screen.getByRole("img", { name: "AXA Assurance Maroc" });
    expect(logo).toHaveAttribute("src", "/assets/img/logos/axa.png");
    expect(logo).toHaveAttribute("width", "120");
    expect(logo).toHaveAttribute("loading", "lazy");
    expect(logo).toHaveClass("size-21");
    expect(screen.queryByTestId("fallback")).not.toBeInTheDocument();
  });

  it("shows the fallback instead of the image when the file fails to load", () => {
    render(
      <LogoImage
        src="/assets/img/logos/typo.png"
        alt="AXA"
        fallback={FALLBACK}
      />,
    );
    fireEvent.error(screen.getByRole("img", { name: "AXA" }));
    expect(screen.queryByRole("img", { name: "AXA" })).not.toBeInTheDocument();
    expect(screen.getByTestId("fallback")).toHaveTextContent("AX");
  });

  it("shows the fallback when the load already failed before the page became interactive", () => {
    stubLoadState(true, 0);
    render(
      <LogoImage
        src="/assets/img/logos/typo.png"
        alt="AXA"
        fallback={FALLBACK}
      />,
    );
    expect(screen.queryByRole("img", { name: "AXA" })).not.toBeInTheDocument();
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
  });

  it("keeps the image when it is already loaded", () => {
    stubLoadState(true, 120);
    render(
      <LogoImage
        src="/assets/img/logos/axa.png"
        alt="AXA"
        fallback={FALLBACK}
      />,
    );
    expect(screen.getByRole("img", { name: "AXA" })).toBeInTheDocument();
    expect(screen.queryByTestId("fallback")).not.toBeInTheDocument();
  });

  it("tries the image again when the source changes after a failure", () => {
    const { rerender } = render(
      <LogoImage src="/a.png" alt="AXA" fallback={FALLBACK} />,
    );
    fireEvent.error(screen.getByRole("img", { name: "AXA" }));
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    rerender(<LogoImage src="/b.png" alt="AXA" fallback={FALLBACK} />);
    expect(screen.getByRole("img", { name: "AXA" })).toHaveAttribute(
      "src",
      "/b.png",
    );
  });
});
