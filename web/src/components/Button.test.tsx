import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

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
    ["ghost", "md"],
    ["ghost", "sm"],
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
});
