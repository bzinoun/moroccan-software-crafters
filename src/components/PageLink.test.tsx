import { render, screen } from "@testing-library/react";
import type * as NextLinkModule from "next/link";
import { describe, expect, it, vi } from "vitest";
import { PageLink } from "./PageLink";

// Marks the anchors that come out of next/link, to tell them from plain anchors.
vi.mock("next/link", async (importOriginal) => {
  const actual = await importOriginal<typeof NextLinkModule>();
  const Link = actual.default;
  return {
    default: (props: React.ComponentProps<typeof Link>) => (
      <Link {...props} data-next-link="" />
    ),
  };
});

describe("PageLink", () => {
  it("sends an internal route through next/link", () => {
    render(<PageLink href="/meetup/">Le meetup</PageLink>);
    const link = screen.getByRole("link", { name: "Le meetup" });
    expect(link).toHaveAttribute("href", "/meetup/");
    expect(link).toHaveAttribute("data-next-link");
  });

  it("renders a plain anchor for an external URL", () => {
    render(
      <PageLink href="https://example.com/page" target="_blank" rel="noopener">
        Dehors
      </PageLink>,
    );
    const link = screen.getByRole("link", { name: "Dehors" });
    expect(link).toHaveAttribute("href", "https://example.com/page");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).not.toHaveAttribute("data-next-link");
  });

  it("renders a plain anchor for a hash on the same page", () => {
    render(<PageLink href="#sponsoring">Sponsoring</PageLink>);
    const link = screen.getByRole("link", { name: "Sponsoring" });
    expect(link).toHaveAttribute("href", "#sponsoring");
    expect(link).not.toHaveAttribute("data-next-link");
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
