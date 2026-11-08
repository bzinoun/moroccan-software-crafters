import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as NextLinkModule from "next/link";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

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

// The glow utilities of an element (the base transition lists the property
// name box-shadow, which is not a glow utility).
const shadowClasses = (el: HTMLElement) =>
  el.className.split(" ").filter((name) => name.startsWith("shadow"));

describe("Button", () => {
  it("renders a link with its label and href when href is set", () => {
    render(<Button href="/accueillir/">Accueillir un meetup</Button>);
    const link = screen.getByRole("link", { name: "Accueillir un meetup" });
    expect(link).toHaveAttribute("href", "/accueillir/");
  });

  it("renders a plain anchor for an external href", () => {
    render(
      <Button href="https://example.com/" target="_blank" rel="noopener">
        Dehors
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Dehors" });
    expect(link).toHaveAttribute("href", "https://example.com/");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("keeps a hash-only href as a plain anchor so a second click scrolls again", () => {
    render(<Button href="#sponsor-form">Choisir ce niveau</Button>);
    const link = screen.getByRole("link", { name: "Choisir ce niveau" });
    expect(link).toHaveAttribute("href", "#sponsor-form");
    expect(link).not.toHaveAttribute("data-next-link");
  });

  it("sends an internal route through next/link", () => {
    render(<Button href="/accueillir/">Accueillir un meetup</Button>);
    expect(
      screen.getByRole("link", { name: "Accueillir un meetup" }),
    ).toHaveAttribute("data-next-link");
  });

  it("renders a button element when there is no href", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Envoyer</Button>);
    const button = screen.getByRole("button", { name: "Envoyer" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.setup().click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each([
    ["primary", "bg-red"],
    ["inverse", "bg-white"],
    ["ghost", "border-ink"],
    ["ghost-on-dark", "border-white"],
  ] as const)("applies the %s variant", (variant, distinguishingClass) => {
    render(
      <Button href="/" variant={variant}>
        Variante
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Variante" })).toHaveClass(
      distinguishingClass,
    );
  });

  it("uses the primary variant when none is given", () => {
    render(
      <>
        <Button href="/">Implicite</Button>
        <Button href="/" variant="primary">
          Explicite
        </Button>
      </>,
    );
    expect(screen.getByRole("link", { name: "Implicite" }).className).toBe(
      screen.getByRole("link", { name: "Explicite" }).className,
    );
  });

  it("uses a different size class list for size sm", () => {
    render(
      <>
        <Button href="/">Moyen</Button>
        <Button href="/" size="sm">
          Petit
        </Button>
      </>,
    );
    expect(screen.getByRole("link", { name: "Petit" }).className).not.toBe(
      screen.getByRole("link", { name: "Moyen" }).className,
    );
  });

  it("lets a caller className win over a conflicting default class", () => {
    render(
      <>
        <Button href="/">Defaut</Button>
        <Button href="/" className="mt-4 px-8">
          Large
        </Button>
      </>,
    );
    const link = screen.getByRole("link", { name: "Large" });
    expect(link).toHaveClass("px-8", "mt-4");
    expect(link.className.match(/\bpx-/g)).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Defaut" }).className,
    ).not.toContain("px-8");
  });

  // tailwind-merge drops leading-none when a text size follows it, so the sm
  // size must repeat it. Line height has no other observable form.
  it("keeps line-height 1 for the small size", () => {
    render(
      <Button href="/" size="sm">
        Libelle
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Libelle" })).toHaveClass(
      "leading-none",
    );
  });

  it("drops the red glow for the primary-flat variant", () => {
    render(
      <>
        <Button href="/">Avec lueur</Button>
        <Button href="/" variant="primary-flat">
          Sans lueur
        </Button>
      </>,
    );
    expect(
      shadowClasses(screen.getByRole("link", { name: "Avec lueur" })),
    ).toHaveLength(1);
    expect(
      shadowClasses(screen.getByRole("link", { name: "Sans lueur" })),
    ).toEqual([]);
  });

  it("lets a caller className replace the hover text color of ghost-on-dark", () => {
    render(
      <Button href="/" variant="ghost-on-dark" className="hover:text-green">
        Fantome vert
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Fantome vert" });
    expect(link).toHaveClass("hover:text-green");
    expect(link).not.toHaveClass("hover:text-ink");
  });
});
