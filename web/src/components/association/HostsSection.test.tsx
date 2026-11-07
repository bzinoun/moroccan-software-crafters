import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadCompanies, loadEvents } from "@/content/load";
import { hostsWall } from "@/lib/pages-data";
import { HostsSection } from "./HostsSection";

const companies = loadCompanies();
const wall = hostsWall(companies, loadEvents());

function renderHosts() {
  return render(
    <HostsSection
      eyebrow={companies.eyebrow}
      title={companies.title}
      tiles={wall.tiles}
      sticker={wall.sticker}
    />,
  );
}

describe("HostsSection", () => {
  it("is the #entreprises section on the alternate background", () => {
    const { container } = renderHosts();
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "entreprises");
    expect(section).toHaveClass("bg-sage-soft");
  });

  it("opens with the centered head of content/companies.json, without a lead", () => {
    renderHosts();
    expect(screen.getByText("Ils nous font confiance")).toHaveClass(
      "before:hidden",
    );
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Les entreprises qui ont ouvert leurs portes ou soutenu la communauté.",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/En accueillant un meetup/)).toBeNull();
  });

  it("shows the 16 companies in a compact wall, then the host sticker", () => {
    const { container } = renderHosts();
    const wallEl = container.querySelector("#logo-wall") as HTMLElement;
    expect(within(wallEl).getAllByRole("img")).toHaveLength(16);
    expect(wallEl.firstElementChild).toHaveClass("w-28");
    expect(
      within(wallEl).getByRole("link", { name: /Votre logo ici/ }),
    ).toHaveAttribute("href", "/accueillir/");
  });

  it("prints no role line under the tiles", () => {
    renderHosts();
    expect(screen.queryByText(/Hôte de 2 meetups/)).toBeNull();
    expect(screen.getByText("Maltem Africa")).toBeInTheDocument();
  });

  it("shows the monogram of a company without logo", () => {
    render(
      <HostsSection
        eyebrow={companies.eyebrow}
        title={companies.title}
        tiles={wall.tiles.map((t) => ({ ...t, logoSrc: null }))}
        sticker={wall.sticker}
      />,
    );
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("MA")).toBeInTheDocument();
  });
});
