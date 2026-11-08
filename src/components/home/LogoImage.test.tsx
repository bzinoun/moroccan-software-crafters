import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { inMemoryImageProbe } from "@/test/in-memory-image-probe";
import { renderWithPorts } from "@/test/ports";
import { LogoImage } from "./LogoImage";

const FALLBACK = <span data-testid="fallback">AX</span>;

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
    renderWithPorts(
      <LogoImage
        src="/assets/img/logos/typo.png"
        alt="AXA"
        fallback={FALLBACK}
      />,
      { imageProbe: inMemoryImageProbe(["/assets/img/logos/typo.png"]) },
    );
    expect(screen.queryByRole("img", { name: "AXA" })).not.toBeInTheDocument();
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
  });

  it("keeps the image when it is already loaded", () => {
    renderWithPorts(
      <LogoImage
        src="/assets/img/logos/axa.png"
        alt="AXA"
        fallback={FALLBACK}
      />,
      { imageProbe: inMemoryImageProbe(["/assets/img/logos/typo.png"]) },
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
