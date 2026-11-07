import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { SectionFoot } from "./SectionFoot";

describe("SectionFoot", () => {
  it("centers its button 36px below the content", () => {
    // content/home.json, format.more.
    render(
      <SectionFoot>
        <Button variant="ghost" href="/meetup/">
          Le déroulé détaillé, étape par étape
        </Button>
      </SectionFoot>,
    );
    const link = screen.getByRole("link", {
      name: "Le déroulé détaillé, étape par étape",
    });
    const foot = link.parentElement;
    expect(foot).toHaveClass("mt-9", "justify-center");
  });

  it("keeps several buttons on one wrapping row", () => {
    // index.html, #partenaires foot.
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
    expect(foot).toHaveClass("flex", "flex-wrap", "gap-[0.8rem]");
    expect(foot?.children).toHaveLength(2);
  });

  it("can start hidden through the native hidden attribute", () => {
    // index.html: #timeline-more and #gallery-more start hidden.
    render(
      <SectionFoot hidden data-testid="more">
        <Button>Voir les 21 événements</Button>
      </SectionFoot>,
    );
    expect(screen.getByTestId("more")).toHaveAttribute("hidden");
  });

  it("merges a caller className", () => {
    render(
      <SectionFoot className="mt-0" data-testid="more">
        x
      </SectionFoot>,
    );
    expect(screen.getByTestId("more")).toHaveClass("mt-0");
    expect(screen.getByTestId("more")).not.toHaveClass("mt-9");
  });
});
