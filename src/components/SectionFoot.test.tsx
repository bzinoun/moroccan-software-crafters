import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { SectionFoot } from "./SectionFoot";

describe("SectionFoot", () => {
  it("renders its button as a link inside one paragraph", () => {
    render(
      <SectionFoot>
        <Button variant="ghost" href="/meetup/">
          Le déroulé détaillé
        </Button>
      </SectionFoot>,
    );
    const link = screen.getByRole("link", { name: "Le déroulé détaillé" });
    expect(link).toHaveAttribute("href", "/meetup/");
    expect(link.parentElement?.tagName).toBe("P");
  });

  it("keeps several buttons in the same parent", () => {
    render(
      <SectionFoot>
        <Button href="/accueillir/">Rejoindre les hôtes</Button>
        <Button variant="ghost" href="/socrates/#sponsoring">
          Soutenir SoCraTes Maroc
        </Button>
      </SectionFoot>,
    );
    const foot = screen.getByRole("link", {
      name: "Rejoindre les hôtes",
    }).parentElement;
    expect(foot?.children).toHaveLength(2);
    expect(
      foot?.contains(
        screen.getByRole("link", { name: "Soutenir SoCraTes Maroc" }),
      ),
    ).toBe(true);
  });

  it("can start hidden through the native hidden attribute", () => {
    render(
      <SectionFoot hidden data-testid="more">
        <Button>Voir plus</Button>
      </SectionFoot>,
    );
    expect(screen.getByTestId("more")).toHaveAttribute("hidden");
    expect(screen.getByTestId("more")).not.toBeVisible();
  });

  it("lets a caller className replace the default top margin", () => {
    render(
      <SectionFoot className="mt-0" data-testid="more">
        x
      </SectionFoot>,
    );
    expect(screen.getByTestId("more")).toHaveClass("mt-0");
    expect(screen.getByTestId("more")).not.toHaveClass("mt-9");
  });
});
