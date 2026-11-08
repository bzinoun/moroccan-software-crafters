import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TrustLogo } from "@/lib/home-data";
import { LogoRow } from "./LogoRow";

// A fixture written here: the row draws the logos it gets, in order.
const LOGOS: TrustLogo[] = [
  {
    id: "acme",
    name: "Acme Corp",
    logoSrc: "/assets/img/logos/acme.png",
    monogram: "AC",
  },
  {
    id: "globex",
    name: "Globex Solutions",
    logoSrc: "/assets/img/logos/globex.png",
    monogram: "GS",
  },
  {
    id: "initech",
    name: "Initech",
    logoSrc: "/assets/img/logos/initech.png",
    monogram: "IN",
  },
];
const logos = () => LOGOS;

describe("LogoRow", () => {
  it("is a named group of the trusted partners", () => {
    render(
      <LogoRow
        logos={logos()}
        aria-label="Partenaires présents à chaque édition"
      />,
    );
    expect(
      screen.getByRole("group", {
        name: "Partenaires présents à chaque édition",
      }),
    ).toBeInTheDocument();
  });

  it("shows one logo per company, in the given order", () => {
    render(<LogoRow logos={logos()} aria-label="Partenaires" />);
    const images = within(screen.getByRole("group")).getAllByRole("img");
    expect(images.map((img) => img.getAttribute("alt"))).toEqual(
      LOGOS.map((logo) => logo.name),
    );
    expect(images.map((img) => img.getAttribute("src"))).toEqual(
      LOGOS.map((logo) => logo.logoSrc),
    );
  });

  it("replaces a logo whose file cannot be loaded by its named monogram", () => {
    render(<LogoRow logos={logos()} aria-label="Partenaires" />);
    fireEvent.error(screen.getByRole("img", { name: "Globex Solutions" }));
    const monogram = screen.getByRole("img", { name: "Globex Solutions" });
    expect(monogram.tagName).toBe("SPAN");
    expect(monogram).toHaveTextContent("GS");
    expect(within(screen.getByRole("group")).getAllByRole("img")).toHaveLength(
      LOGOS.length,
    );
  });

  it("gives each logo its name as a title and loads it lazily", () => {
    render(<LogoRow logos={logos()} aria-label="Partenaires" />);
    const initech = screen.getByRole("img", { name: "Initech" });
    expect(initech).toHaveAttribute("title", "Initech");
    expect(initech).toHaveAttribute("loading", "lazy");
  });

  it("falls back to the monogram when a company has no logo file", () => {
    render(
      <LogoRow
        logos={[
          { id: "acme", name: "Acme Corp", logoSrc: null, monogram: "AC" },
        ]}
        aria-label="Partenaires"
      />,
    );
    const fallback = screen.getByRole("img", { name: "Acme Corp" });
    expect(fallback.tagName).toBe("SPAN");
    expect(fallback).toHaveTextContent("AC");
    expect(fallback).toHaveAttribute("title", "Acme Corp");
  });

  it("renders an empty group without logos", () => {
    render(<LogoRow logos={[]} aria-label="Partenaires" />);
    expect(screen.getByRole("group")).toBeEmptyDOMElement();
  });

  it("merges the class name of the caller", () => {
    render(<LogoRow logos={[]} aria-label="Partenaires" className="mt-3.5" />);
    expect(screen.getByRole("group")).toHaveClass("mt-3.5");
  });
});
