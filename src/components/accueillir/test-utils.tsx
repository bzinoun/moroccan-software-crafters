import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, vi, type MockInstance } from "vitest";
import type { FormSite, SubmitResult } from "@/lib/forms";
import { submitFormInBrowser } from "@/lib/forms-browser";
import { DRAFT_KEY, type FunnelOffer } from "@/lib/funnel";
import { HostFunnel } from "./HostFunnel";

// Shared set-up of the funnel and of the sponsor form tests. A test file that
// uses `submit` or `setUpFunnelEnvironment` must replace the submit module first:
// `vi.mock("@/lib/forms-browser", () => ({ submitFormInBrowser: vi.fn() }))`.
// Nothing here posts anywhere.

export type User = ReturnType<typeof userEvent.setup>;

/** The offers as `offers.json` gives them to the funnel, written by hand. */
export const OFFERS: readonly FunnelOffer[] = [
  {
    id: "communautaire",
    name: "Hôte communautaire",
    tagline: "Vous ouvrez vos portes.",
    price: "Gratuit",
  },
  {
    id: "partenaire",
    name: "Meetup partenaire",
    tagline: "Un meetup ouvert, porté par votre marque.",
    price: "À partir de 9000 MAD",
  },
  {
    id: "prive",
    name: "Craft session privée",
    tagline: "Le format meetup pour vos équipes.",
    price: "À partir de 20000 MAD",
  },
];

export const LINKEDIN = "https://www.linkedin.com/company/test-page/";

export const SITE: FormSite = {
  links: { linkedin: LINKEDIN },
  contact: { email: "" },
  form: { endpoint: "https://formspree.io/f/xtestid", extraFields: {} },
};

// 7 November 2026 is a Saturday: the first date allowed is Sunday 8 November.
export const NOW = new Date(2026, 10, 7, 10, 0);

/** The mocked submit module (see the note at the top of this file). */
export const submit = vi.mocked(submitFormInBrowser);

/** A result that the test settles by hand, to look at the state while a request runs. */
export function pendingResult() {
  let settle: (result: SubmitResult) => void = () => {};
  const promise = new Promise<SubmitResult>((resolve) => {
    settle = resolve;
  });
  return { promise, settle };
}

export function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query === "(prefers-reduced-motion: reduce)",
  }));
}

/**
 * Registers the hooks of a funnel test file: the date fixed to `NOW`, a
 * resolved `submit`, a silent console, no saved draft, the URL reset.
 * The returned object gives the spy that hides `console.error`.
 */
export function setUpFunnelEnvironment() {
  const env = { errorSpy: undefined as unknown as MockInstance };
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    submit.mockReset();
    submit.mockResolvedValue({ mode: "endpoint" });
    env.errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    Element.prototype.scrollIntoView = vi.fn();
    stubReducedMotion(false);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
    window.history.replaceState(null, "", "/");
  });
  return env;
}

export function storeDraft(draft: Record<string, unknown>) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export const savedDraft = () =>
  JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");

export function renderFunnel(site: FormSite = SITE) {
  const user = userEvent.setup();
  const view = render(<HostFunnel offers={OFFERS} site={site} />);
  return { user, ...view };
}

export const next = () =>
  screen.getByRole("button", { name: /Continuer|Envoyer|Envoi/ });

export const legend = (step: number) =>
  document.getElementById(`step-${step}-legend`) as HTMLElement;

export async function chooseOffer(user: User, name = "Meetup partenaire") {
  await user.click(screen.getByRole("radio", { name: new RegExp(name) }));
}

export async function toStep2(user: User) {
  await chooseOffer(user);
  await user.click(next());
}

export async function fillStep2(user: User, date = "2026-11-14") {
  fireEvent.change(screen.getByLabelText("Date souhaitée"), {
    target: { value: date },
  });
  await user.click(screen.getByRole("radio", { name: "40 à 60" }));
}

export async function toStep3(user: User) {
  await toStep2(user);
  await fillStep2(user);
  await user.click(next());
}

export async function toStep4(user: User) {
  await toStep3(user);
  await user.type(screen.getByLabelText("Nom de l'entreprise"), "Acme");
  await user.click(next());
}

type Contact = { name: string; email: string; phone: string };

/** Types the contact block that the funnel (step 4) and the sponsor form share. */
export async function fillContact(user: User, contact: Partial<Contact> = {}) {
  const { name, email, phone } = {
    name: "Sara Alaoui",
    email: "sara@acme.ma",
    phone: "06 12 34 56 78",
    ...contact,
  };
  await user.type(screen.getByLabelText("Prénom et nom"), name);
  await user.type(screen.getByLabelText("E-mail professionnel"), email);
  await user.type(screen.getByRole("textbox", { name: "Téléphone" }), phone);
  await user.click(screen.getByRole("checkbox", { name: /J'accepte/ }));
}

/** Answers the four steps of a valid request and clicks the last button. */
export async function sendRequest(user: User) {
  await toStep4(user);
  await fillContact(user);
  await user.click(next());
}
