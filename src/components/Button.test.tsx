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

  it("defaults to the primary variant: red pill that darkens on hover", () => {
    render(<Button href="/">Primaire</Button>);
    expect(screen.getByRole("link", { name: "Primaire" })).toHaveClass(
      "rounded-full",
      "bg-red",
      "text-white",
      "hover:bg-red-dark",
    );
  });

  it("renders the ghost variant with a different class list than primary", () => {
    render(
      <>
        <Button href="/">Primaire</Button>
        <Button href="/" variant="ghost">
          Fantome
        </Button>
      </>,
    );
    const primary = screen.getByRole("link", { name: "Primaire" });
    const ghost = screen.getByRole("link", { name: "Fantome" });
    expect(ghost.className).not.toBe(primary.className);
    expect(ghost).toHaveClass("bg-transparent", "border-ink", "hover:bg-ink");
    expect(ghost).not.toHaveClass("bg-red");
  });

  it("uses the smaller padding for size sm", () => {
    render(
      <>
        <Button href="/">Moyen</Button>
        <Button href="/" size="sm">
          Petit
        </Button>
      </>,
    );
    expect(screen.getByRole("link", { name: "Moyen" })).toHaveClass(
      "px-[1.35rem]",
    );
    expect(screen.getByRole("link", { name: "Petit" })).toHaveClass(
      "px-[1.05rem]",
    );
    expect(screen.getByRole("link", { name: "Petit" })).not.toHaveClass(
      "px-[1.35rem]",
    );
  });

  it("lets a caller className with a conflicting padding win over the default", () => {
    render(
      <Button href="/" className="mt-4 px-8">
        Large
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Large" });
    expect(link).toHaveClass("px-8", "mt-4");
    expect(link).not.toHaveClass("px-[1.35rem]");
  });

  it.each([
    ["primary", "md"],
    ["primary", "sm"],
    ["primary-flat", "md"],
    ["primary-flat", "sm"],
    ["inverse", "md"],
    ["inverse", "sm"],
    ["ghost", "md"],
    ["ghost", "sm"],
    ["ghost-on-dark", "md"],
    ["ghost-on-dark", "sm"],
  ] as const)("keeps line-height 1 for %s %s", (variant, size) => {
    render(
      <Button href="/" variant={variant} size={size}>
        Libelle
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Libelle" })).toHaveClass(
      "leading-none",
    );
  });

  describe("dark surface variants", () => {
    it("primary-flat is the red pill without the red glow", () => {
      render(
        <>
          <Button href="/">Avec lueur</Button>
          <Button href="/" variant="primary-flat">
            Sans lueur
          </Button>
        </>,
      );
      const glow = screen.getByRole("link", { name: "Avec lueur" });
      const flat = screen.getByRole("link", { name: "Sans lueur" });
      expect(shadowClasses(glow)).toHaveLength(1);
      expect(shadowClasses(flat)).toEqual([]);
      expect(flat).toHaveClass("bg-red", "text-white", "hover:bg-red-dark");
    });

    it("inverse is a white pill with red text, no glow, that goes paper on hover", () => {
      render(
        <Button href="/" variant="inverse">
          Inverse
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Inverse" });
      expect(link).toHaveClass(
        "bg-white",
        "text-red",
        "hover:bg-paper",
        "hover:text-red-dark",
      );
      expect(link).not.toHaveClass("bg-red");
      expect(shadowClasses(link)).toEqual([]);
    });

    it("ghost-on-dark has a white outline and text, and fills white on hover", () => {
      render(
        <Button href="/" variant="ghost-on-dark">
          Fantome clair
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Fantome clair" });
      expect(link).toHaveClass(
        "border-white",
        "text-white",
        "hover:bg-white",
        "hover:text-ink",
      );
      expect(link).not.toHaveClass("border-ink", "border-transparent");
    });

    it("lets a caller className replace the hover text color of ghost-on-dark", () => {
      render(
        <Button href="/" variant="ghost-on-dark" className="hover:text-green">
          Fantome vert
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Fantome vert" });
      expect(link).toHaveClass("hover:text-green", "hover:bg-white");
      expect(link).not.toHaveClass("hover:text-ink");
    });

    it("lets a caller className replace the text colors of inverse", () => {
      render(
        <Button
          href="/"
          variant="inverse"
          className="text-green hover:text-green"
        >
          Inverse vert
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Inverse vert" });
      expect(link).toHaveClass("text-green", "hover:text-green");
      expect(link).not.toHaveClass("text-red", "hover:text-red-dark");
      expect(link).toHaveClass("leading-none");
    });
  });
});
