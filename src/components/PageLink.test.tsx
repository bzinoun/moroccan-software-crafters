import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageLink } from "./PageLink";

describe("PageLink", () => {
  // A plain anchor keeps the href as written; next/link normalizes it to the
  // site's trailing-slash form, which tells the two apart without a double.
  it("sends an internal route through next/link, which adds the trailing slash", () => {
    render(<PageLink href="/meetup">Le meetup</PageLink>);
    const link = screen.getByRole("link", { name: "Le meetup" });
    expect(link).toHaveAttribute("href", "/meetup/");
  });

  // next/link renders the same href for an external URL; linkKind in
  // routes.test.ts guards the choice, and the target and rel test below the rest.
  it("renders a plain anchor for an external URL", () => {
    render(<PageLink href="https://example.com/page">Dehors</PageLink>);
    const link = screen.getByRole("link", { name: "Dehors" });
    expect(link).toHaveAttribute("href", "https://example.com/page");
  });

  it("opens an external URL in a new tab without an opener", () => {
    render(<PageLink href="https://example.com/page">Dehors</PageLink>);
    const link = screen.getByRole("link", { name: "Dehors" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("keeps an internal route and a hash in the same tab", () => {
    render(
      <>
        <PageLink href="/meetup/">Le meetup</PageLink>
        <PageLink href="#sponsoring">Sponsoring</PageLink>
      </>,
    );
    for (const name of ["Le meetup", "Sponsoring"]) {
      const link = screen.getByRole("link", { name });
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    }
  });

  // next/link keeps "#sponsoring" unchanged, so the href cannot tell it from a
  // plain anchor; linkKind in routes.test.ts guards the choice of element.
  it("renders a plain anchor for a hash on the same page", () => {
    render(<PageLink href="#sponsoring">Sponsoring</PageLink>);
    const link = screen.getByRole("link", { name: "Sponsoring" });
    expect(link).toHaveAttribute("href", "#sponsoring");
  });

  // next/link would give "/meetup/#sponsoring": the href as written proves a plain anchor.
  it("renders a plain anchor for a route with a hash, so a second click scrolls again", () => {
    render(<PageLink href="/meetup#sponsoring">Sponsoring</PageLink>);
    const link = screen.getByRole("link", { name: "Sponsoring" });
    expect(link).toHaveAttribute("href", "/meetup#sponsoring");
  });

  it("adds the base path to a route with a hash", () => {
    render(
      <PageLink
        href="/socrates/#sponsoring"
        basePath="/moroccan-software-crafters"
      >
        Sponsoring
      </PageLink>,
    );
    expect(screen.getByRole("link", { name: "Sponsoring" })).toHaveAttribute(
      "href",
      "/moroccan-software-crafters/socrates/#sponsoring",
    );
  });

  it("does not pass the base path on to the anchor element", () => {
    render(
      <PageLink href="/#offres" basePath="/base">
        Les formules
      </PageLink>,
    );
    expect(
      screen.getByRole("link", { name: "Les formules" }),
    ).not.toHaveAttribute("basepath");
  });

  it("passes the other anchor attributes through", () => {
    render(
      <PageLink href="/meetup/" className="lien" aria-current="page">
        Le meetup
      </PageLink>,
    );
    const link = screen.getByRole("link", { name: "Le meetup" });
    expect(link).toHaveClass("lien");
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
