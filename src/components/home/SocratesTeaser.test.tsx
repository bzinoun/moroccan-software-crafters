import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  loadCompanies,
  loadEvents,
  loadHome,
  loadSponsoring,
} from "@/content/load";
import { socratesEditions, socratesPhoto, trustLogos } from "@/lib/home-data";
import { EditionChips, SocratesTeaser, SponsorCall } from "./SocratesTeaser";

// Props come from the real content files, as the home page passes them.
function props() {
  const home = loadHome();
  return {
    eyebrow: home.socrates.eyebrow,
    title: home.socrates.title,
    lead: home.socrates.lead,
    cta: home.socrates.cta,
    editions: socratesEditions(loadEvents()),
    photoSrc: socratesPhoto(home),
    sponsor: home.socrates.sponsor,
    trust: trustLogos(loadSponsoring(), loadCompanies().items),
  };
}

const region = () =>
  screen.getByRole("region", {
    name: "SoCraTes Maroc, l'unconference annuelle.",
  });

describe("SocratesTeaser", () => {
  it("is the dark #socrates section named by its title", () => {
    render(<SocratesTeaser {...props()} />);
    expect(region()).toHaveAttribute("id", "socrates");
    expect(region()).toHaveClass("bg-green-deep");
    expect(
      within(region()).getByRole("heading", { level: 2 }),
    ).toHaveTextContent("SoCraTes Maroc, l'unconference annuelle.");
  });

  it("shows the eyebrow and the lead of content/home.json", () => {
    render(<SocratesTeaser {...props()} />);
    expect(within(region()).getByText("La conférence")).toBeInTheDocument();
    // The lead has a space before the colon in the JSON; it renders with U+202F.
    expect(
      within(region()).getByText(
        "L'édition marocaine de SoCraTes (Software Craft and Testing) : quatre jours d'open space entre crafters, sans programme imposé, dans un lieu en retrait de la ville.",
      ),
    ).toBeInTheDocument();
  });

  it("marks both eyebrows with the khatam star, not the red rule", () => {
    render(<SocratesTeaser {...props()} />);
    const eyebrows = [
      within(region()).getByText("La conférence"),
      within(region()).getByText("Appel à partenaires"),
    ];
    for (const eyebrow of eyebrows) {
      expect(eyebrow).toHaveClass("text-sage", "before:size-3.5");
      expect(eyebrow).not.toHaveClass("before:w-[22px]");
    }
  });

  it("keeps the compact sponsor eyebrow of the old site: .98rem, 8px below", () => {
    render(<SocratesTeaser {...props()} />);
    const eyebrow = within(region()).getByText("Appel à partenaires");
    expect(eyebrow).toHaveClass("mb-2", "text-[0.98rem]");
    expect(eyebrow).not.toHaveClass("mb-4", "text-[0.8rem]");
  });

  it("lists the four editions oldest first with city, ordinal and crafters", () => {
    render(<SocratesTeaser {...props()} />);
    // content/events.json: 2022 Marrakech 30, 2023 Bouznika 45,
    // 2024 Bouznika 50, 2025 Bouznika 50 crafters.
    const items = within(region()).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual([
      "2022 · Marrakech1re édition · 30 crafters",
      "2023 · Bouznika2e édition · 45 crafters",
      "2024 · Bouznika3e édition · 50 crafters",
      "2025 · Bouznika4e édition · 50 crafters",
    ]);
  });

  it("links the main call to action to the SoCraTes page without the red glow", () => {
    render(<SocratesTeaser {...props()} />);
    const link = within(region()).getByRole("link", {
      name: "Découvrir SoCraTes Maroc",
    });
    expect(link).toHaveAttribute("href", "/socrates/");
    expect(link).toHaveClass("bg-red");
    expect(
      link.className.split(" ").filter((c) => c.startsWith("shadow")),
    ).toEqual([]);
  });

  it("shows the 2022 group photo with its static alt text", () => {
    render(<SocratesTeaser {...props()} />);
    const photo = within(region()).getByRole("img", {
      name: "Photo de groupe des participants de SoCraTes Maroc 2022 à Marrakech",
    });
    expect(photo).toHaveAttribute(
      "src",
      "/assets/img/meetups/2022-03-socrates-groupe.jpg",
    );
    expect(photo).toHaveAttribute("loading", "lazy");
    expect(photo).toHaveAttribute("width", "1600");
    expect(photo).toHaveAttribute("height", "1200");
  });

  it("puts the photo after the text and in two columns from md", () => {
    render(<SocratesTeaser {...props()} />);
    const photo = within(region()).getByRole("img", {
      name: /Photo de groupe/,
    });
    const heading = within(region()).getByRole("heading", { level: 2 });
    expect(
      heading.compareDocumentPosition(photo) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    const grid = photo.parentElement;
    expect(grid).toHaveClass("grid", "md:grid-cols-[1.05fr_0.95fr]");
  });

  it("renders the sponsor call with its title, text and partner logos", () => {
    render(<SocratesTeaser {...props()} />);
    const call = within(region()).getByRole("heading", {
      level: 3,
      name: "La 5e édition se prépare.",
    }).parentElement as HTMLElement;
    expect(
      within(call).getByText(
        "Chaque édition est financée par cinq à dix entreprises partenaires. Cinq d'entre elles ont soutenu les quatre éditions depuis 2022.",
      ),
    ).toBeInTheDocument();
    const row = within(call).getByRole("group", {
      name: "Partenaires présents à chaque édition",
    });
    expect(
      within(row)
        .getAllByRole("img")
        .map((img) => img.getAttribute("alt")),
    ).toEqual([
      "McKinsey & Company",
      "Maltem Africa",
      "inwi",
      "Keiken digital solutions",
      "Gemography",
    ]);
  });

  it("links the sponsor call to the sponsoring anchor with a white ghost button", () => {
    render(<SocratesTeaser {...props()} />);
    const link = within(region()).getByRole("link", {
      name: "Devenir partenaire",
    });
    expect(link).toHaveAttribute("href", "/socrates/#sponsoring");
    expect(link).toHaveClass("border-white", "text-white", "hover:bg-white");
    expect(link).not.toHaveClass("border-ink");
  });
});

describe("EditionChips", () => {
  it("renders one chip per edition with the year line and the detail line", () => {
    render(
      <EditionChips
        editions={[
          {
            id: "a",
            title: "2022 · Marrakech",
            detail: "1re édition · 30 crafters",
          },
          {
            id: "b",
            title: "2023 · Bouznika",
            detail: "2e édition · 45 crafters",
          },
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[1]).getByText("2023 · Bouznika")).toBeInTheDocument();
    expect(
      within(items[1]).getByText("2e édition · 45 crafters"),
    ).toBeInTheDocument();
  });
});

describe("SponsorCall", () => {
  it("keeps its box and labels the logo row, also outside the teaser", () => {
    const { sponsor, trust } = props();
    const { container } = render(
      <SponsorCall sponsor={sponsor} trust={trust} className="my-10" />,
    );
    expect(container.firstElementChild).toHaveClass(
      "rounded-card",
      "border-sage/35",
      "bg-sage/10",
      "my-10",
    );
    expect(
      screen.getByRole("group", {
        name: "Partenaires présents à chaque édition",
      }),
    ).toBeInTheDocument();
  });
});

describe("EditionChips list semantics", () => {
  it("keeps the list role explicit", () => {
    render(
      <EditionChips
        editions={[
          { id: "a", title: "2022 · Marrakech", detail: "1re édition" },
        ]}
      />,
    );
    expect(screen.getByRole("list")).toHaveAttribute("role", "list");
  });
});
