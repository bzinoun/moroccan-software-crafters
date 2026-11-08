import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Cta } from "@/content/types";
import { CtaBand } from "./CtaBand";

// A fixture written here: the band draws the props it gets.
const TITLE = "Le prochain meetup peut se tenir chez vous.";
const PROPS: {
  title: string;
  text: string;
  primary: Cta;
  secondary: Cta;
} = {
  title: TITLE,
  text: "Quatre étapes, deux minutes. Réponse sous 48 heures ?",
  primary: { label: "Proposer une date", href: "accueillir.html" },
  secondary: {
    label: "Suivre sur LinkedIn",
    href: "https://www.linkedin.com/company/example/",
  },
};

describe("CtaBand", () => {
  it("is a section named by the title, with the title as a level 2 heading", () => {
    render(<CtaBand {...PROPS} />);
    expect(screen.getByRole("region", { name: TITLE })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: TITLE }),
    ).toBeInTheDocument();
  });

  it("shows the text with a narrow no-break space before the question mark", () => {
    render(<CtaBand {...PROPS} />);
    expect(screen.getByText(/^Quatre étapes/).textContent).toBe(
      "Quatre étapes, deux minutes. Réponse sous 48 heures\u202f?",
    );
  });

  it("links an internal primary action in the same tab", () => {
    render(<CtaBand {...PROPS} />);
    const link = screen.getByRole("link", { name: "Proposer une date" });
    expect(link).toHaveAttribute("href", "/accueillir/");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens an external secondary action in a new tab", () => {
    render(<CtaBand {...PROPS} />);
    const link = screen.getByRole("link", { name: "Suivre sur LinkedIn" });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/example/",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("lists the primary action first, then the secondary", () => {
    render(<CtaBand {...PROPS} />);
    const labels = screen.getAllByRole("link").map((a) => a.textContent);
    expect(labels).toEqual(["Proposer une date", "Suivre sur LinkedIn"]);
  });

  it("gives the primary button green text in the green variant only", () => {
    const { unmount } = render(<CtaBand {...PROPS} variant="green" />);
    expect(screen.getByRole("link", { name: "Proposer une date" })).toHaveClass(
      "text-green",
    );
    unmount();
    render(<CtaBand {...PROPS} />);
    expect(
      screen.getByRole("link", { name: "Proposer une date" }),
    ).not.toHaveClass("text-green");
  });

  it("uses the tight section padding with the tight prop only", () => {
    const { container, unmount } = render(<CtaBand {...PROPS} tight />);
    expect(container.querySelector("section")).toHaveClass("py-14");
    unmount();
    const regular = render(<CtaBand {...PROPS} />);
    expect(regular.container.querySelector("section")).not.toHaveClass("py-14");
  });
});
