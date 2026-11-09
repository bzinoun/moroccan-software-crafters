import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EnvoiImpossible, { metadata } from "./page";

describe("send-failed page (form sent without script)", () => {
  it("says the request did not go through and how to fix it", () => {
    render(<EnvoiImpossible />);
    expect(
      screen.getByRole("heading", { level: 1, name: /n'est pas partie/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent(/revenez en arrière/i);
  });

  it("offers the LinkedIn page as a second way in", () => {
    render(<EnvoiImpossible />);
    const link = within(screen.getByRole("main")).getByRole("link", {
      name: "LinkedIn",
    });
    expect(link.getAttribute("href")).toMatch(
      /^https:\/\/www\.linkedin\.com\//,
    );
  });

  it("uses no exclamation mark and no em dash", () => {
    render(<EnvoiImpossible />);
    expect(screen.getByRole("main").textContent ?? "").not.toMatch(/[!—]/);
  });

  it("is not indexed and has no canonical", () => {
    expect(metadata.robots).toMatchObject({ index: false });
    expect(metadata.alternates?.canonical).toBeNull();
  });
});
