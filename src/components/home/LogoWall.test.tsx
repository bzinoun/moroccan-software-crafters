import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Sticker } from "@/content/types";
import type { LogoTile as LogoTileData } from "@/lib/derive";
import { LogoSticker, LogoTile, LogoWall } from "./LogoWall";

// Fixtures written here: the components draw the tiles and stickers they get.
const ACME: LogoTileData = {
  id: "acme",
  name: "Acme Corp",
  label: "Partenaire SoCraTes · Hôte d'un meetup",
  href: "https://www.linkedin.com/company/acme/",
  logoSrc: "/assets/img/logos/acme.png",
  monogram: "AC",
  hosted: 1,
  sponsored: 1,
};
const GLOBEX: LogoTileData = {
  id: "globex",
  name: "Globex Solutions",
  label: "Hôte de 2 meetups",
  href: null,
  logoSrc: "/assets/img/logos/globex.png",
  monogram: "GS",
  hosted: 2,
  sponsored: 0,
};
const INITECH: LogoTileData = {
  id: "initech",
  name: "Initech",
  label: "Partenaire de 4 éditions SoCraTes",
  href: null,
  logoSrc: null,
  monogram: "IN",
  hosted: 0,
  sponsored: 4,
};
const TILES = [ACME, GLOBEX, INITECH];

const HOST_STICKER: Sticker = {
  title: "Votre logo ici ?",
  text: "Recevez 40 crafters un samedi matin. On s'occupe du reste.",
  label: "Accueillir un meetup",
  href: "/accueillir/",
};
const SPONSOR_STICKER: Sticker = {
  title: "Votre logo ici ?",
  text: "Soutenez la communauté.",
  label: "Devenir partenaire",
  href: "#sponsor-funnel",
};

describe("LogoTile", () => {
  it("is a link to the company page in a new tab when the company has one", () => {
    render(<LogoTile tile={ACME} />);
    const link = screen.getByRole("link", { name: /Acme Corp/ });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/acme/",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("names the link once, with the name and then the role label", () => {
    render(<LogoTile tile={ACME} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(/^Acme Corp\s*Partenaire SoCraTes/);
    expect(link).not.toHaveAccessibleName(/Acme Corp.*Acme Corp/);
    expect(link).not.toHaveAttribute("title");
    expect(screen.getAllByText("Acme Corp")).toHaveLength(1);
  });

  it("prints the name and the role label under the logo", () => {
    render(<LogoTile tile={GLOBEX} />);
    expect(screen.getByText("Globex Solutions")).toBeInTheDocument();
    expect(screen.getByText("Hôte de 2 meetups")).toBeInTheDocument();
  });

  it("shows the logo file of the company, as a decoration beside the printed name", () => {
    const { container } = render(<LogoTile tile={ACME} />);
    const logo = container.querySelector("img") as HTMLImageElement;
    expect(logo).toHaveAttribute("alt", "");
    expect(logo).toHaveAttribute("src", "/assets/img/logos/acme.png");
    expect(logo).toHaveAttribute("loading", "lazy");
    expect(logo).toHaveAttribute("width", "120");
    expect(logo).toHaveAttribute("height", "120");
  });

  it("falls back to the monogram when the logo file cannot be loaded", () => {
    const { container } = render(<LogoTile tile={ACME} />);
    fireEvent.error(container.querySelector("img") as HTMLImageElement);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("AC")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("is a plain block, not a link, when the company has no page", () => {
    const { container } = render(<LogoTile tile={GLOBEX} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(container.firstElementChild?.tagName).toBe("DIV");
    expect(container.firstElementChild).toHaveTextContent(
      /Globex Solutions\s*Hôte de 2 meetups/,
    );
  });

  it("shows the monogram, not an image, when the company has no logo", () => {
    const { container } = render(<LogoTile tile={INITECH} />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("IN")).toBeInTheDocument();
  });

  it("prints no role line when the label is empty", () => {
    const { container } = render(<LogoTile tile={{ ...ACME, label: "" }} />);
    expect(screen.queryByText(/Hôte/)).toBeNull();
    expect(container.firstElementChild).toHaveAccessibleName("Acme Corp");
  });

  it("lifts on hover only when it is a link, and only when motion is allowed", () => {
    const { rerender } = render(<LogoTile tile={ACME} />);
    expect(screen.getByRole("link")).toHaveClass(
      "motion-safe:hover:-translate-y-0.75",
    );
    rerender(<LogoTile tile={GLOBEX} />);
    expect(
      screen.getByText("Globex Solutions").parentElement?.className,
    ).not.toMatch(/translate-y/);
  });
});

describe("LogoSticker", () => {
  it("is one link to the host page named by its title and its label", () => {
    render(<LogoSticker sticker={HOST_STICKER} />);
    const link = screen.getByRole("link", {
      name: "Votre logo ici\u202f? Accueillir un meetup",
    });
    expect(link).toHaveAttribute("href", "/accueillir/");
  });

  it("describes the link with the invitation text", () => {
    render(<LogoSticker sticker={HOST_STICKER} />);
    expect(screen.getByRole("link")).toHaveAccessibleDescription(
      "Recevez 40 crafters un samedi matin. On s'occupe du reste.",
    );
  });

  it("hides the arrow from assistive technology", () => {
    render(<LogoSticker sticker={HOST_STICKER} />);
    expect(screen.getByText("→")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the arrow on the line of the last word", () => {
    render(<LogoSticker sticker={HOST_STICKER} />);
    const arrow = screen.getByText("→");
    expect(arrow.previousSibling?.textContent).toBe("\u00a0");
  });

  it("keeps an in-page href as it is", () => {
    render(<LogoSticker sticker={SPONSOR_STICKER} />);
    expect(
      screen.getByRole("link", {
        name: "Votre logo ici\u202f? Devenir partenaire",
      }),
    ).toHaveAttribute("href", "#sponsor-funnel");
  });

  it("uses the narrow no-break space before the question mark", () => {
    render(<LogoSticker sticker={HOST_STICKER} />);
    expect(screen.getByText(/^Votre logo ici/).textContent).toBe(
      "Votre logo ici\u202f?",
    );
  });
});

describe("LogoWall", () => {
  it("renders one tile for each input tile, in the given order", () => {
    const { container } = render(<LogoWall tiles={TILES} />);
    const wall = container.firstElementChild;
    expect(wall?.children).toHaveLength(TILES.length);
    TILES.forEach((tile, i) => {
      expect(wall?.children[i]).toHaveTextContent(tile.name);
    });
  });

  it("ends with the sticker after the last tile", () => {
    const { container } = render(
      <LogoWall tiles={TILES} sticker={HOST_STICKER} />,
    );
    const wall = container.firstElementChild;
    expect(wall?.children).toHaveLength(TILES.length + 1);
    expect(wall?.lastElementChild).toHaveTextContent("Votre logo ici");
    expect(wall?.lastElementChild?.tagName).toBe("A");
  });

  it("renders no sticker when none is given", () => {
    render(<LogoWall tiles={TILES} />);
    expect(screen.queryByText(/Votre logo ici/)).toBeNull();
  });

  it("renders nothing without a tile and without a sticker", () => {
    const { container } = render(<LogoWall tiles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("carries the id it is given", () => {
    const { container } = render(<LogoWall id="logo-wall" tiles={TILES} />);
    expect(container.firstElementChild).toHaveAttribute("id", "logo-wall");
  });
});

describe("LogoWall compact", () => {
  it("passes the compact size to every tile", () => {
    const { container } = render(<LogoWall compact tiles={TILES} />);
    for (const tile of container.firstElementChild?.children ?? []) {
      expect(tile).toHaveClass("w-28");
    }
  });

  it("keeps the full size when compact is not set", () => {
    const { container } = render(<LogoWall tiles={TILES} />);
    for (const tile of container.firstElementChild?.children ?? []) {
      expect(tile).toHaveClass("w-42");
    }
  });

  it("prints the name under a compact tile and keeps the role out of sight", () => {
    render(<LogoTile compact tile={GLOBEX} />);
    expect(screen.getByText("Globex Solutions")).toBeInTheDocument();
    expect(screen.getByText("Hôte de 2 meetups")).toHaveClass("sr-only");
  });

  it("keeps the role in the name that a screen reader reads for a compact tile", () => {
    render(<LogoTile compact tile={ACME} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(
      /^Acme Corp\s*Partenaire SoCraTes · Hôte d'un meetup$/,
    );
    expect(link).not.toHaveAttribute("title");
  });

  it("keeps the accessible name and description of a compact sticker", () => {
    render(<LogoSticker compact sticker={HOST_STICKER} />);
    const link = screen.getByRole("link", {
      name: "Votre logo ici\u202f? Accueillir un meetup",
    });
    expect(link).toHaveAccessibleDescription(
      "Recevez 40 crafters un samedi matin. On s'occupe du reste.",
    );
  });
});
