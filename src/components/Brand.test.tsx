import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Site } from "@/content/types";
import { Brand } from "./Brand";

// Only the fields that Brand reads matter here.
const site = {
  name: "Crafters : test",
  tagline: "Une association de test",
} as Site;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Brand", () => {
  it("links to the home page with the site name and the tagline", () => {
    render(<Brand site={site} />);
    const brand = screen.getByRole("link", { name: /Crafters/ });
    expect(brand).toHaveAttribute("href", "/");
    expect(within(brand).getByText("Une association de test")).toBeVisible();
  });

  it("puts the French narrow space before a colon in the name", () => {
    render(<Brand site={site} />);
    expect(screen.getByText(/Crafters/).textContent).toBe("Crafters : test");
  });

  it("shows the line it is given in place of the tagline", () => {
    render(<Brand site={site} line="Une autre ligne" />);
    expect(screen.getByText("Une autre ligne")).toBeInTheDocument();
    expect(
      screen.queryByText("Une association de test"),
    ).not.toBeInTheDocument();
  });

  it("shows a decorative logo that the base path prefixes", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/base");
    render(<Brand site={site} />);
    const logo = screen.getByRole("presentation");
    expect(logo).toHaveAttribute("src", "/base/assets/img/logo.png");
    expect(logo).toHaveAttribute("alt", "");
  });

  it("sizes the logo at 44 pixels by default and 52 for the large size", () => {
    const { rerender } = render(<Brand site={site} />);
    expect(screen.getByRole("presentation")).toHaveAttribute("width", "44");
    expect(screen.getByRole("presentation")).toHaveAttribute("height", "44");
    rerender(<Brand site={site} size="lg" />);
    expect(screen.getByRole("presentation")).toHaveAttribute("width", "52");
    expect(screen.getByRole("presentation")).toHaveAttribute("height", "52");
  });
});
