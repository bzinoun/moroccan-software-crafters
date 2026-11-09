import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NoScriptNote } from "./NoScriptNote";

const LINKEDIN = "https://www.linkedin.com/company/test-page/";

describe("NoScriptNote", () => {
  it("says the form needs script and points to the LinkedIn page", () => {
    render(<NoScriptNote linkedin={LINKEDIN} />);
    expect(
      screen.getByText(/Pour envoyer ce formulaire, activez JavaScript/),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      LINKEDIN,
    );
  });

  it("shows for a visitor with no script only", () => {
    render(<NoScriptNote linkedin={LINKEDIN} />);
    const note = screen.getByRole("link", { name: "LinkedIn" }).parentElement;
    expect(note).toHaveClass("js:hidden");
  });

  it("names LinkedIn without a link when no page is configured", () => {
    render(<NoScriptNote />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(/écrire sur LinkedIn/)).toBeInTheDocument();
  });
});
