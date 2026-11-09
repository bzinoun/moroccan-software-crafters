import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SocratesEdition, TrustLogo } from "@/lib/home-data";
import { EditionChips, SocratesTeaser, SponsorCall } from "./SocratesTeaser";

// Fixtures written here: the teaser draws the copy, editions, photo and
// partner logos it gets.
const TITLE = "Une unconference annuelle.";
const EDITIONS: SocratesEdition[] = [
  { id: "a", title: "2022 · Alpha", detail: "1re édition · 30 crafters" },
  { id: "b", title: "2023 · Beta", detail: "2e édition · 45 crafters" },
  { id: "c", title: "2024 · Beta", detail: "3e édition · 50 crafters" },
];
const TRUST: TrustLogo[] = [
  {
    id: "acme",
    name: "Acme Corp",
    logoSrc: "/assets/img/logos/acme.png",
    monogram: "AC",
  },
  {
    id: "globex",
    name: "Globex Solutions",
    logoSrc: "/assets/img/logos/globex.png",
    monogram: "GS",
  },
];
const SPONSOR = {
  eyebrow: "Appel à partenaires",
  title: "La prochaine édition se prépare.",
  text: "Chaque édition est financée par des entreprises partenaires.",
  cta: { label: "Devenir partenaire", href: "/socrates/#sponsoring" },
};

function props() {
  return {
    eyebrow: "La conférence",
    title: TITLE,
    lead: "Quatre jours d'open space : sans programme imposé.",
    cta: { label: "Découvrir la conférence", href: "/socrates/" },
    editions: EDITIONS,
    photoSrc: "/assets/img/meetups/2022-03-alpha-groupe.jpg",
    sponsor: SPONSOR,
    trust: TRUST,
  };
}

const region = () => screen.getByRole("region", { name: TITLE });

describe("SocratesTeaser", () => {
  it("is the #socrates section named by its title", () => {
    render(<SocratesTeaser {...props()} />);
    expect(region()).toHaveAttribute("id", "socrates");
    expect(
      within(region()).getByRole("heading", { level: 2 }),
    ).toHaveTextContent(TITLE);
  });

  it("shows the eyebrow and the lead, with a narrow no-break space before the colon", () => {
    render(<SocratesTeaser {...props()} />);
    expect(within(region()).getByText("La conférence")).toBeInTheDocument();
    expect(within(region()).getByText(/^Quatre jours/).textContent).toBe(
      "Quatre jours d'open space\u202f: sans programme imposé.",
    );
  });

  it("marks the eyebrow with the khatam star, not the red rule", () => {
    render(<SocratesTeaser {...props()} />);
    const eyebrow = within(region()).getByText("La conférence");
    expect(eyebrow).toHaveClass("before:size-3.5");
    expect(eyebrow).not.toHaveClass("before:w-[22px]");
  });

  it("lists the editions in the given order", () => {
    render(<SocratesTeaser {...props()} />);
    const items = within(region()).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(
      EDITIONS.map((edition) => `${edition.title}${edition.detail}`),
    );
  });

  it("links the main call to action to the SoCraTes page", () => {
    render(<SocratesTeaser {...props()} />);
    const link = within(region()).getByRole("link", {
      name: "Découvrir la conférence",
    });
    expect(link).toHaveAttribute("href", "/socrates/");
  });

  it("shows the group photo with its static alt text", () => {
    render(<SocratesTeaser {...props()} />);
    const photo = within(region()).getByRole("img", {
      name: "Photo de groupe des participants de SoCraTes Maroc 2022 à Marrakech",
    });
    expect(photo).toHaveAttribute(
      "src",
      "/assets/img/meetups/2022-03-alpha-groupe.jpg",
    );
    expect(photo).toHaveAttribute("loading", "lazy");
    expect(photo).toHaveAttribute("width", "1600");
    expect(photo).toHaveAttribute("height", "1200");
  });

  it("puts the photo after the text", () => {
    render(<SocratesTeaser {...props()} />);
    const photo = within(region()).getByRole("img", {
      name: /Photo de groupe/,
    });
    const heading = within(region()).getByRole("heading", { level: 2 });
    expect(heading.compareDocumentPosition(photo)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the sponsor call with its title, text and partner logos", () => {
    render(<SocratesTeaser {...props()} />);
    const call = within(region()).getByRole("heading", {
      level: 3,
      name: SPONSOR.title,
    }).parentElement as HTMLElement;
    expect(within(call).getByText(SPONSOR.text)).toBeInTheDocument();
    const row = within(call).getByRole("group", {
      name: "Partenaires présents à chaque édition",
    });
    expect(
      within(row)
        .getAllByRole("img")
        .map((img) => img.getAttribute("alt")),
    ).toEqual(TRUST.map((logo) => logo.name));
  });

  it("links the sponsor call to the sponsoring anchor", () => {
    render(<SocratesTeaser {...props()} />);
    expect(
      within(region()).getByRole("link", { name: "Devenir partenaire" }),
    ).toHaveAttribute("href", "/socrates/#sponsoring");
  });
});

describe("EditionChips without an edition", () => {
  it("renders nothing", () => {
    const { container } = render(<EditionChips editions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("EditionChips", () => {
  it("renders one chip per edition with the year line and the detail line", () => {
    render(<EditionChips editions={EDITIONS.slice(0, 2)} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[1]!).getByText("2023 · Beta")).toBeInTheDocument();
    expect(
      within(items[1]!).getByText("2e édition · 45 crafters"),
    ).toBeInTheDocument();
  });
});

describe("SponsorCall", () => {
  it("labels the logo row and keeps the class name of the caller, also outside the teaser", () => {
    const { container } = render(
      <SponsorCall sponsor={SPONSOR} trust={TRUST} className="my-10" />,
    );
    expect(container.firstElementChild).toHaveClass("my-10");
    expect(
      screen.getByRole("group", {
        name: "Partenaires présents à chaque édition",
      }),
    ).toBeInTheDocument();
  });
});

describe("EditionChips list semantics", () => {
  it("keeps the list role explicit", () => {
    render(<EditionChips editions={EDITIONS.slice(0, 1)} />);
    expect(screen.getByRole("list")).toHaveAttribute("role", "list");
  });
});
