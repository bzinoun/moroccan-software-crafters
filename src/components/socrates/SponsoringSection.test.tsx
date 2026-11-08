import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadCompanies, loadSponsoring } from "@/content/load";
import { trustLogos } from "@/lib/home-data";
import {
  levelForPackage,
  sponsorLevels,
  sponsorPackages,
} from "@/lib/pages-data";
import { SponsoringSection } from "./SponsoringSection";

const SITE = {
  links: { linkedin: "https://www.linkedin.com/company/test-page/" },
  contact: { email: "" },
  form: { endpoint: "", extraFields: {} },
};

function setup() {
  const sp = loadSponsoring();
  return render(
    <SponsoringSection
      sponsoring={sp}
      trust={trustLogos(sp, loadCompanies().items)}
      packages={sponsorPackages(sp)}
      levels={sponsorLevels(sp)}
      packageLevels={Object.fromEntries(
        sp.packages.map((p) => [p.id, levelForPackage(sp, p.id) ?? ""]),
      )}
      site={SITE}
    />,
  );
}

describe("SponsoringSection", () => {
  it("is the dark #sponsoring section named by its title", () => {
    setup();
    const section = screen.getByRole("region", {
      name: "Financez quatre jours qui font avancer le craft au Maroc.",
    });
    expect(section).toHaveAttribute("id", "sponsoring");
    expect(section).toHaveClass("bg-green-deep");
    expect(section).toHaveTextContent("Devenir partenaire");
    expect(section).toHaveTextContent(
      "Ce sont les partenaires qui rendent l'édition possible",
    );
  });

  it("shows the four arguments", () => {
    const { container } = setup();
    const args = container.querySelector("#arguments") as HTMLElement;
    expect(within(args).getAllByRole("article")).toHaveLength(4);
    expect(
      within(args).getByRole("heading", {
        level: 3,
        name: "Des profils rares, en immersion",
      }),
    ).toBeInTheDocument();
  });

  it("shows the five trusted partners under their heading", () => {
    const { container } = setup();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Cinq entreprises ont soutenu chacune des quatre éditions depuis 2022.",
      }),
    ).toBeInTheDocument();
    const row = container.querySelector("#trust-logos") as HTMLElement;
    expect(row).toHaveAccessibleName(
      "Cinq entreprises ont soutenu chacune des quatre éditions depuis 2022.",
    );
    expect(within(row).getAllByRole("img")).toHaveLength(5);
  });

  it("shows the three packages, the in-kind card and the note", () => {
    const { container } = setup();
    const packages = container.querySelector("#packages") as HTMLElement;
    expect(within(packages).getAllByRole("article")).toHaveLength(3);
    const inKind = container.querySelector("#in-kind") as HTMLElement;
    expect(
      within(inKind).getByRole("heading", {
        level: 3,
        name: "Partenariat en nature",
      }),
    ).toBeInTheDocument();
    expect(inKind).toHaveTextContent("Transport des participants");
    expect(
      screen.getByText(/^Tarifs indicatifs hors taxes\./),
    ).toBeInTheDocument();
  });

  it("holds the sponsor form and its FAQ at the end", () => {
    const { container } = setup();
    expect(container.querySelector("#sponsor-form")).toBeInstanceOf(
      HTMLFormElement,
    );
    expect(container.querySelector("#sponsor-faq")).not.toBeNull();
    const ids = [
      "arguments",
      "trust-logos",
      "packages",
      "in-kind",
      "sponsor-faq",
      "sponsor-funnel",
    ].map((id) => container.querySelector(`#${id}`));
    for (let i = 1; i < ids.length; i += 1) {
      expect(
        ids[i - 1]!.compareDocumentPosition(ids[i]!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  it("checks the package level in the form when 'Choisir ce niveau' is clicked", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    setup();
    const user = userEvent.setup();
    const offer = screen
      .getByRole("heading", { level: 3, name: "Partenaire principal" })
      .closest("article") as HTMLElement;
    await user.click(
      within(offer).getByRole("link", { name: "Choisir ce niveau" }),
    );
    expect(
      screen.getByRole("radio", { name: "Partenaire principal · 70 000 MAD" }),
    ).toBeChecked();
  });
});
