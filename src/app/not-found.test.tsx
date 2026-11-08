import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "./not-found";

describe("404 page", () => {
  it("keeps the site header and footer around the message", () => {
    render(<NotFound />);
    expect(
      screen.getAllByRole("navigation", { name: "Navigation principale" }),
    ).not.toHaveLength(0);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("marks no nav link as the current page", () => {
    render(<NotFound />);
    for (const nav of screen.getAllByRole("navigation", {
      name: "Navigation principale",
    })) {
      expect(nav.querySelectorAll("[aria-current='page']")).toHaveLength(0);
    }
  });

  it("shows a French heading and a link to the home page", () => {
    render(<NotFound />);
    const main = screen.getByRole("main");
    expect(
      screen.getByRole("heading", { level: 1, name: /introuvable/i }),
    ).toBeInTheDocument();
    const home = screen.getByRole("link", { name: /retour à l.accueil/i });
    expect(main).toContainElement(home);
    expect(home).toHaveAttribute("href", "/");
  });

  it("uses no exclamation mark and no em dash", () => {
    render(<NotFound />);
    const text = screen.getByRole("main").textContent ?? "";
    expect(text).not.toMatch(/[!—]/);
  });
});
