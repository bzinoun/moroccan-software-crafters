import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { vi } from "vitest";
import type { SubmitInput, SubmitResult } from "@/lib/forms";
import type { PackageCard } from "@/lib/pages-data";
import {
  LINKEDIN,
  SITE,
  fillContact,
  type User,
} from "../accueillir/test-utils";
import { SponsorForm } from "./SponsorForm";

// Shared set-up of the sponsoring tests. Everything is a fixture written here,
// so a content edit in `sponsoring.json` cannot break a test. The submit
// function is injected: nothing posts to a real endpoint.

export { LINKEDIN, SITE };

export type Submit = (input: SubmitInput) => Promise<SubmitResult>;

export const PACKAGES: PackageCard[] = [
  {
    id: "supporter",
    name: "Supporter",
    price: "10000 MAD",
    highlight: false,
    badge: null,
    limit: null,
    tagline: "Soutenir l'édition.",
    includes: ["Logo sur le site", "Remerciement dans le récap"],
  },
  {
    id: "partenaire",
    name: "Partenaire",
    price: "20000 MAD",
    highlight: true,
    badge: "Le niveau historique",
    limit: null,
    tagline: "Être présent pendant les quatre jours.",
    includes: ["Tout le niveau Supporter", "Une place participant", "Un talk"],
  },
  {
    id: "principal",
    name: "Partenaire principal",
    price: "40000 MAD",
    highlight: false,
    badge: null,
    limit: "Un seul par édition",
    tagline: "Porter l'édition.",
    includes: ["Tout le niveau Partenaire", "Le nom dans le titre"],
  },
];

export const LEVELS = {
  options: [
    { value: "Supporter", label: "Supporter · 10000 MAD" },
    { value: "Partenaire", label: "Partenaire · 20000 MAD" },
    {
      value: "Partenaire principal",
      label: "Partenaire principal · 40000 MAD",
    },
    { value: "En nature", label: "En nature" },
    { value: "À discuter", label: "À discuter" },
  ],
  defaultValue: "À discuter",
};

/** Package id to level value, as the page passes it. */
export const PACKAGE_LEVELS = {
  supporter: "Supporter",
  partenaire: "Partenaire",
  principal: "Partenaire principal",
};

export const SUCCESS = "Le dossier de partenariat part sous 48 heures.";

type SetupOptions = {
  result?: SubmitResult;
  /** Replaces the default double, for example with a request that stays pending. */
  submit?: Submit;
  /** Rendered before the form, for the package buttons of the page. */
  before?: ReactNode;
};

export function renderSponsorForm({
  result = { mode: "endpoint" },
  submit = vi.fn<Submit>().mockResolvedValue(result),
  before,
}: SetupOptions = {}) {
  const double = vi.mocked(submit);
  const view = render(
    <>
      {before}
      <SponsorForm
        site={SITE}
        levels={LEVELS}
        packageLevels={PACKAGE_LEVELS}
        successText={SUCCESS}
        submit={submit}
      />
    </>,
  );
  return { submit: double, user: userEvent.setup(), ...view };
}

export async function fillValid(user: User) {
  await user.type(screen.getByLabelText("Entreprise"), "  Acme  ");
  await fillContact(user, { name: "Sara Alami", phone: "+212 6 12 34 56 78" });
}

export const submitButton = () =>
  screen.getByRole("button", {
    name: /Recevoir le dossier de partenariat|Envoi/,
  });
