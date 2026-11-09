import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Merci, { metadata } from "./page";

describe("thank-you page (form sent without script)", () => {
  it("confirms the request in French and links back home", () => {
    render(<Merci />);
    expect(
      screen.getByRole("heading", { level: 1, name: /demande bien reçue/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /retour à l.accueil/i }),
    ).toHaveAttribute("href", "/");
  });

  it("keeps the site header and footer", () => {
    render(<Merci />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("uses no exclamation mark and no em dash", () => {
    render(<Merci />);
    expect(screen.getByRole("main").textContent ?? "").not.toMatch(/[!—]/);
  });

  it("is not indexed and has no canonical", () => {
    expect(metadata.robots).toMatchObject({ index: false });
    expect(metadata.alternates?.canonical).toBeNull();
  });
});
