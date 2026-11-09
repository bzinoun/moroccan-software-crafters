import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LogoTile } from "@/lib/derive";
import { HostsSection } from "./HostsSection";

function tile(id: string, name: string, overrides: Partial<LogoTile> = {}) {
  return {
    id,
    name,
    label: "Hôte de 2 meetups",
    href: null,
    logoSrc: `/assets/img/logos/${id}.png`,
    monogram: name.slice(0, 2).toUpperCase(),
    hosted: 2,
    sponsored: 0,
    ...overrides,
  } satisfies LogoTile;
}

const tiles = [
  tile("alpha", "Alpha Corp"),
  tile("beta", "Beta Labs"),
  tile("gamma", "Gamma Works"),
];
const sticker = {
  title: "Votre logo ici ?",
  text: "Accueillez un meetup.",
  label: "Devenir hôte",
  href: "/accueillir/",
};

function renderHosts(shown: LogoTile[] = tiles) {
  return render(
    <HostsSection
      eyebrow="They trust us"
      title="Companies that opened their doors."
      tiles={shown}
      sticker={sticker}
    />,
  );
}

describe("HostsSection", () => {
  it("is the #entreprises section", () => {
    const { container } = renderHosts();
    expect(container.querySelector("section")).toHaveAttribute(
      "id",
      "entreprises",
    );
  });

  it("is a section named by its title", () => {
    const { container } = renderHosts();
    expect(
      screen.getByRole("region", {
        name: "Companies that opened their doors.",
      }),
    ).toBe(container.querySelector("section"));
  });

  it("opens with the eyebrow and the level 2 title", () => {
    renderHosts();
    expect(screen.getByText("They trust us")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Companies that opened their doors.",
      }),
    ).toBeInTheDocument();
  });

  it("shows one logo per company in the wall, then the host sticker", () => {
    const { container } = renderHosts();
    const wall = container.querySelector(
      "section > div > div:last-child",
    ) as HTMLElement;
    // The logo is a decoration (alt ""): each company name is read once, from the text.
    const logos = wall.querySelectorAll("img");
    expect(logos).toHaveLength(tiles.length);
    for (const img of logos) expect(img).toHaveAttribute("alt", "");
    for (const t of tiles) {
      expect(within(wall).getAllByText(t.name)).toHaveLength(1);
    }
    const link = within(wall).getByRole("link", { name: /Votre logo ici/ });
    expect(link).toHaveAttribute("href", "/accueillir/");
    expect(wall.lastElementChild).toBe(link);
  });

  it("keeps the role line out of sight, for screen readers only", () => {
    renderHosts();
    const roles = screen.getAllByText("Hôte de 2 meetups");
    expect(roles).toHaveLength(tiles.length);
    for (const role of roles) expect(role).toHaveClass("sr-only");
    expect(screen.getByText("Alpha Corp")).toBeInTheDocument();
  });

  it("shows the monogram of a company without logo", () => {
    renderHosts(tiles.map((t) => ({ ...t, logoSrc: null })));
    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});
