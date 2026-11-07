import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadCompanies, loadEvents } from "@/content/load";
import { logoWallTiles, type LogoTile as LogoTileData } from "@/lib/derive";
import { LogoSticker, LogoTile, LogoWall } from "./LogoWall";

const companies = loadCompanies();
const tiles = logoWallTiles(companies.items, loadEvents());

function tileOf(id: string): LogoTileData {
  const tile = tiles.find((t) => t.id === id);
  if (!tile) throw new Error(`No tile for ${id}`);
  return tile;
}

describe("LogoTile", () => {
  it("keeps the 1.25 line height of the name next to the text size, default and compact", () => {
    const { unmount } = render(<LogoTile tile={tileOf("maltem")} />);
    expect(screen.getByText("Maltem Africa")).toHaveClass(
      "text-[0.88rem]",
      "leading-[1.25]",
    );
    unmount();
    render(<LogoTile tile={tileOf("maltem")} compact />);
    expect(screen.getByText("Maltem Africa")).toHaveClass(
      "text-[0.8rem]",
      "leading-[1.25]",
    );
  });
  it("is a LinkedIn link in a new tab when the company has a page", () => {
    render(<LogoTile tile={tileOf("axa")} />);
    const link = screen.getByRole("link", { name: /AXA Assurance Maroc/ });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/axa-assurance-maroc/",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("titles the tile with the name and the role label", () => {
    render(<LogoTile tile={tileOf("axa")} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "title",
      "AXA Assurance Maroc · Hôte d'un meetup · Partenaire SoCraTes",
    );
  });

  it("prints the name and the role label under the logo", () => {
    render(<LogoTile tile={tileOf("maltem")} />);
    expect(screen.getByText("Maltem Africa")).toBeInTheDocument();
    expect(
      screen.getByText("Hôte de 2 meetups · Partenaire de 4 éditions SoCraTes"),
    ).toBeInTheDocument();
  });

  it("shows the logo file of the company, named after the company", () => {
    render(<LogoTile tile={tileOf("axa")} />);
    const logo = screen.getByRole("img", { name: "AXA Assurance Maroc" });
    expect(logo).toHaveAttribute("src", "/assets/img/logos/axa.png");
    expect(logo).toHaveAttribute("loading", "lazy");
    expect(logo).toHaveAttribute("width", "120");
    expect(logo).toHaveAttribute("height", "120");
  });

  it("falls back to the monogram when the logo file cannot be loaded", () => {
    render(<LogoTile tile={tileOf("axa")} />);
    fireEvent.error(screen.getByRole("img", { name: "AXA Assurance Maroc" }));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    // The name stays printed under the tile; the monogram is the two initials.
    expect(screen.getByText("AA")).toBeInTheDocument();
    expect(screen.getByText("AXA Assurance Maroc")).toBeInTheDocument();
  });

  it("uses the display name of the company when there is one", () => {
    render(<LogoTile tile={tileOf("sg-gscm")} />);
    expect(
      screen.getByText("SG Global Solution Centre Morocco"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "SG Global Solution Centre Morocco" }),
    ).toHaveAttribute("src", "/assets/img/logos/sg-gscm.png");
  });

  it("is a plain block, not a link, when the company has no LinkedIn page", () => {
    const { container } = render(<LogoTile tile={tileOf("sg-gscm")} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(container.firstElementChild?.tagName).toBe("DIV");
    expect(container.firstElementChild).toHaveAttribute(
      "title",
      "SG Global Solution Centre Morocco · Hôte de 2 meetups · Partenaire SoCraTes",
    );
  });

  it("shows the monogram, not an image, when the company has no logo", () => {
    render(<LogoTile tile={{ ...tileOf("axa"), logoSrc: null }} />);
    expect(screen.queryByRole("img")).toBeNull();
    // monogram("AXA Assurance Maroc") is "AA".
    expect(screen.getByText("AA")).toBeInTheDocument();
  });

  it("prints no role line when the label is empty", () => {
    const { container } = render(
      <LogoTile tile={{ ...tileOf("axa"), label: "" }} />,
    );
    expect(screen.queryByText(/Hôte/)).toBeNull();
    expect(container.firstElementChild).toHaveAttribute(
      "title",
      "AXA Assurance Maroc",
    );
  });

  it("lifts on hover and focus only when it is a link, and only when motion is allowed", () => {
    const { rerender } = render(<LogoTile tile={tileOf("axa")} />);
    expect(screen.getByRole("link")).toHaveClass(
      "motion-safe:hover:-translate-y-0.75",
      "motion-safe:focus-visible:-translate-y-0.75",
      "hover:shadow-lift",
    );
    rerender(<LogoTile tile={tileOf("sg-gscm")} />);
    const plain = screen.getByTitle(/SG Global Solution Centre Morocco/);
    expect(plain).not.toHaveClass("hover:shadow-lift");
    expect(plain.className).not.toMatch(/translate-y/);
  });
});

describe("LogoSticker", () => {
  it("is one link to the host page named by its title and its label", () => {
    render(<LogoSticker sticker={companies.sticker.host} />);
    const link = screen.getByRole("link", {
      name: "Votre logo ici\u202f? Accueillir un meetup",
    });
    expect(link).toHaveAttribute("href", "/accueillir/");
  });

  it("describes the link with the invitation text", () => {
    render(<LogoSticker sticker={companies.sticker.host} />);
    expect(screen.getByRole("link")).toHaveAccessibleDescription(
      "Recevez 40 crafters un samedi matin. On s'occupe du reste.",
    );
  });

  it("hides the arrow from assistive technology", () => {
    render(<LogoSticker sticker={companies.sticker.host} />);
    const arrow = screen.getByText("→");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps an in-page href of the sponsor sticker as it is", () => {
    render(<LogoSticker sticker={companies.sticker.sponsor} />);
    expect(
      screen.getByRole("link", {
        name: "Votre logo ici\u202f? Devenir partenaire",
      }),
    ).toHaveAttribute("href", "#sponsor-funnel");
  });

  it("uses the narrow no-break space before the question mark", () => {
    render(<LogoSticker sticker={companies.sticker.host} />);
    expect(screen.getByText(/^Votre logo ici/).textContent).toBe(
      "Votre logo ici\u202f?",
    );
  });
});

describe("LogoWall", () => {
  it("renders one tile for each company, most active first", () => {
    const { container } = render(<LogoWall tiles={tiles} />);
    const imgs = within(container).getAllByRole("img");
    expect(imgs).toHaveLength(16);
    expect(imgs[0]).toHaveAccessibleName("Maltem Africa");
    expect(imgs[1]).toHaveAccessibleName("McKinsey & Company");
    expect(imgs[15]).toHaveAccessibleName("Done");
  });

  it("ends with the sticker after the last tile", () => {
    const { container } = render(
      <LogoWall tiles={tiles} sticker={companies.sticker.host} />,
    );
    const last = container.firstElementChild?.lastElementChild;
    expect(last).toHaveTextContent("Votre logo ici");
    expect(last?.tagName).toBe("A");
  });

  it("renders no sticker when none is given", () => {
    render(<LogoWall tiles={tiles} />);
    expect(screen.queryByText(/Votre logo ici/)).toBeNull();
  });

  it("carries the id it is given and centers a wrapping row", () => {
    const { container } = render(<LogoWall id="logo-wall" tiles={tiles} />);
    const wall = container.firstElementChild;
    expect(wall).toHaveAttribute("id", "logo-wall");
    expect(wall).toHaveClass("flex", "flex-wrap", "justify-center", "gap-3.5");
  });
});

describe("LogoWall compact", () => {
  it("narrows the wall gap and passes the compact size to every tile", () => {
    const { container } = render(
      <LogoWall id="logo-wall" compact tiles={tiles} />,
    );
    const wall = container.firstElementChild;
    expect(wall).toHaveClass("flex", "flex-wrap", "justify-center", "gap-2.5");
    expect(wall).not.toHaveClass("gap-3.5");
    expect(wall?.firstElementChild).toHaveClass("w-28");
  });

  it("keeps the full size when compact is not set", () => {
    const { container } = render(<LogoWall tiles={tiles} />);
    expect(container.firstElementChild?.firstElementChild).toHaveClass("w-42");
  });

  it("prints the name but no role line under a compact tile", () => {
    render(<LogoTile compact tile={tileOf("maltem")} />);
    expect(screen.getByText("Maltem Africa")).toBeInTheDocument();
    expect(screen.queryByText(/Hôte de 2 meetups/)).toBeNull();
  });

  it("keeps the role in the title of a compact tile", () => {
    render(<LogoTile compact tile={tileOf("axa")} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "title",
      "AXA Assurance Maroc · Hôte d'un meetup · Partenaire SoCraTes",
    );
  });

  it("shrinks the logo to 60px in a 64px box", () => {
    render(<LogoTile compact tile={tileOf("axa")} />);
    const logo = screen.getByRole("img", { name: "AXA Assurance Maroc" });
    expect(logo).toHaveClass("size-15");
    expect(logo.parentElement).toHaveClass("size-16");
  });

  it("draws a smaller monogram when the company has no logo", () => {
    render(<LogoTile compact tile={{ ...tileOf("axa"), logoSrc: null }} />);
    expect(screen.getByText("AA")).toHaveClass("size-15");
  });

  it("gives the sticker the compact footprint and keeps its accessible name", () => {
    render(<LogoSticker compact sticker={companies.sticker.host} />);
    const link = screen.getByRole("link", {
      name: "Votre logo ici\u202f? Accueillir un meetup",
    });
    expect(link).toHaveClass("w-28");
    expect(link).toHaveAccessibleDescription(
      "Recevez 40 crafters un samedi matin. On s'occupe du reste.",
    );
  });
});
