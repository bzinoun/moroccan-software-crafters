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
    const wall = container.querySelector("#logo-wall") as HTMLElement;
    const logos = within(wall).getAllByRole("img");
    expect(logos).toHaveLength(tiles.length);
    expect(logos.map((img) => img.getAttribute("alt"))).toEqual(
      tiles.map((t) => t.name),
    );
    const link = within(wall).getByRole("link", { name: /Votre logo ici/ });
    expect(link).toHaveAttribute("href", "/accueillir/");
    expect(wall.lastElementChild).toBe(link);
  });

  it("prints no role line under the tiles", () => {
    renderHosts();
    expect(screen.queryByText(/Hôte de 2 meetups/)).toBeNull();
    expect(screen.getByText("Alpha Corp")).toBeInTheDocument();
  });

  it("shows the monogram of a company without logo", () => {
    renderHosts(tiles.map((t) => ({ ...t, logoSrc: null })));
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});
