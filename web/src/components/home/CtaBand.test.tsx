import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadHome } from "@/content/load";
import { CtaBand } from "./CtaBand";

const { cta } = loadHome();

describe("CtaBand", () => {
  it("is a plain section named by the title of home.json, as a level 2 heading", () => {
    render(<CtaBand {...cta} />);
    const title = "Le prochain meetup peut se tenir chez vous.";
    expect(screen.getByRole("region", { name: title })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: title }),
    ).toBeInTheDocument();
  });

  it("shows the text with a narrow no-break space rule applied", () => {
    render(<CtaBand {...cta} />);
    expect(
      screen.getByText(
        "Quatre étapes, deux minutes. Nous revenons vers vous sous 48 heures.",
      ),
    ).toBeInTheDocument();
  });

  it("links the primary action to the host page, in the same tab", () => {
    render(<CtaBand {...cta} />);
    const link = screen.getByRole("link", { name: "Proposer une date" });
    expect(link).toHaveAttribute("href", "/accueillir/");
    expect(link).not.toHaveAttribute("target");
  });

  it("links the secondary action to LinkedIn in a new tab", () => {
    render(<CtaBand {...cta} />);
    const link = screen.getByRole("link", { name: "Suivre sur LinkedIn" });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/moroccansoftwarecrafters/",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("lists the primary action first, then the secondary", () => {
    render(<CtaBand {...cta} />);
    const labels = screen.getAllByRole("link").map((a) => a.textContent);
    expect(labels).toEqual(["Proposer une date", "Suivre sur LinkedIn"]);
  });

  it("is a green band with rounded 22px corners, white title and pale green text", () => {
    render(<CtaBand {...cta} />);
    const band = screen
      .getByRole("heading", { level: 2 })
      .closest("div")?.parentElement;
    expect(band).toHaveClass("bg-green", "rounded-[22px]", "text-white");
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("text-white");
    expect(screen.getByText(/Quatre étapes/)).toHaveClass(
      "text-[#d9efe2]",
      "m-0",
    );
  });

  it("stacks on mobile with 24px sides and splits 1.4fr 1fr from md", () => {
    render(<CtaBand {...cta} />);
    const band = screen
      .getByRole("heading", { level: 2 })
      .closest("div")?.parentElement;
    expect(band).toHaveClass(
      "px-6",
      "py-10",
      "md:grid-cols-[1.4fr_1fr]",
      "md:px-12",
      "md:py-14",
    );
  });

  it("inverts the primary button: white fill, red text, no glow", () => {
    render(<CtaBand {...cta} />);
    const link = screen.getByRole("link", { name: "Proposer une date" });
    expect(link).toHaveClass(
      "bg-white",
      "text-red",
      "hover:bg-paper",
      "hover:text-red-dark",
    );
    expect(link).not.toHaveClass("bg-red");
    expect(
      link.className.split(" ").filter((c) => c.startsWith("shadow")),
    ).toEqual([]);
  });

  it("outlines the ghost button in white and fills it white on hover", () => {
    render(<CtaBand {...cta} />);
    const link = screen.getByRole("link", { name: "Suivre sur LinkedIn" });
    expect(link).toHaveClass(
      "border-white",
      "text-white",
      "hover:bg-white",
      "hover:text-green",
    );
    expect(link).not.toHaveClass("border-ink");
  });

  it("gives the primary button green text in the green variant", () => {
    render(<CtaBand {...cta} variant="green" />);
    const link = screen.getByRole("link", { name: "Proposer une date" });
    expect(link).toHaveClass("text-green", "hover:text-green");
    expect(link).not.toHaveClass("text-red");
  });

  it("aligns the actions to the start on mobile and to the end from md", () => {
    render(<CtaBand {...cta} />);
    const actions = screen.getByRole("link", {
      name: "Proposer une date",
    }).parentElement;
    expect(actions).toHaveClass("flex", "flex-wrap", "gap-3", "md:justify-end");
  });

  it("draws the focus outline in sage, green would vanish on the green band", () => {
    render(<CtaBand {...cta} />);
    const band = screen
      .getByRole("heading", { level: 2 })
      .closest("div")?.parentElement;
    expect(band).toHaveClass("**:focus-visible:outline-sage");
  });
});
