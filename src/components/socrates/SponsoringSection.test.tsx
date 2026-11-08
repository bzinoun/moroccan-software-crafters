import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Sponsoring } from "@/content/types";
import type { TrustLogo } from "@/lib/home-data";
import { LEVELS, PACKAGES, PACKAGE_LEVELS, SITE, SUCCESS } from "./test-utils";
import { SponsoringSection } from "./SponsoringSection";

// A section written by hand: a content edit must not break this file.
const SPONSORING: Sponsoring = {
  eyebrow: "Devenir partenaire",
  title: "Financez quatre jours qui font avancer le craft.",
  lead: "Ce sont les partenaires qui rendent l'édition possible.",
  arguments: [
    { title: "Des profils rares", text: "Texte un." },
    { title: "Une marque visible", text: "Texte deux." },
    { title: "Un recrutement direct", text: "Texte trois." },
  ],
  trust: { title: "Ils soutiennent chaque édition.", ids: ["a", "b"] },
  packages: [],
  inKind: { title: "Partenariat en nature", text: "Transport et repas." },
  note: "Tarifs indicatifs hors taxes.",
  faq: [
    { q: "Première question ?", a: "Première réponse." },
    { q: "Deuxième question ?", a: "Deuxième réponse." },
  ],
  form: {
    title: "Parlons de la prochaine édition",
    lead: "Laissez-nous vos coordonnées.",
    success: SUCCESS,
  },
};
const TRUST: TrustLogo[] = [
  { id: "a", name: "Alpha", logoSrc: null, monogram: "AL" },
  { id: "b", name: "Beta", logoSrc: null, monogram: "BE" },
];

function setup() {
  return render(
    <SponsoringSection
      sponsoring={SPONSORING}
      trust={TRUST}
      packages={PACKAGES}
      levels={LEVELS}
      packageLevels={PACKAGE_LEVELS}
      site={SITE}
    />,
  );
}

describe("SponsoringSection", () => {
  it("is the #sponsoring section named by its title", () => {
    setup();
    const section = screen.getByRole("region", { name: SPONSORING.title });
    expect(section).toHaveAttribute("id", "sponsoring");
    expect(section).toHaveTextContent(SPONSORING.eyebrow);
    expect(section).toHaveTextContent(SPONSORING.lead);
  });

  it("shows one card per argument", () => {
    const { container } = setup();
    const args = container.querySelector("#arguments") as HTMLElement;
    expect(within(args).getAllByRole("article")).toHaveLength(
      SPONSORING.arguments.length,
    );
    expect(
      within(args).getByRole("heading", {
        level: 3,
        name: "Des profils rares",
      }),
    ).toBeInTheDocument();
  });

  it("shows the trusted partners under their heading", () => {
    const { container } = setup();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: SPONSORING.trust.title,
      }),
    ).toBeInTheDocument();
    const row = container.querySelector("#trust-logos") as HTMLElement;
    expect(row).toHaveAccessibleName(SPONSORING.trust.title);
    expect(within(row).getAllByRole("img")).toHaveLength(TRUST.length);
  });

  it("shows the packages, the in-kind card and the note", () => {
    const { container } = setup();
    const packages = container.querySelector("#packages") as HTMLElement;
    expect(within(packages).getAllByRole("article")).toHaveLength(
      PACKAGES.length,
    );
    const inKind = container.querySelector("#in-kind") as HTMLElement;
    expect(
      within(inKind).getByRole("heading", {
        level: 3,
        name: SPONSORING.inKind.title,
      }),
    ).toBeInTheDocument();
    expect(inKind).toHaveTextContent(SPONSORING.inKind.text);
    expect(screen.getByText(SPONSORING.note)).toBeInTheDocument();
  });

  it("holds the sponsor form and its FAQ after the other blocks, in this order", () => {
    const { container } = setup();
    expect(container.querySelector("#sponsor-form")).toBeInstanceOf(
      HTMLFormElement,
    );
    const blocks = [
      "arguments",
      "trust-logos",
      "packages",
      "in-kind",
      "sponsor-faq",
      "sponsor-funnel",
    ].map((id) => container.querySelector(`#${id}`) as Element);
    for (const block of blocks) expect(block).not.toBeNull();
    for (let i = 1; i < blocks.length; i += 1) {
      expect(blocks[i - 1]!.compareDocumentPosition(blocks[i]!)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
  });

  it("checks the package level in the form when 'Choisir ce niveau' is clicked", async () => {
    setup();
    const user = userEvent.setup();
    const offer = screen
      .getByRole("heading", { level: 3, name: "Partenaire principal" })
      .closest("article") as HTMLElement;
    await user.click(
      within(offer).getByRole("link", { name: "Choisir ce niveau" }),
    );
    expect(
      screen.getByRole("radio", { name: "Partenaire principal · 40000 MAD" }),
    ).toBeChecked();
  });
});
