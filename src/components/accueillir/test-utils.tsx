import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach } from "vitest";
import type { FormSite, SubmitResult } from "@/lib/forms";
import { DRAFT_KEY } from "@/lib/funnel-draft";
import { type FunnelOffer } from "@/lib/funnel-fields";
import { PortsProvider, type Ports } from "@/lib/ports";
import { inMemoryClock } from "@/test/in-memory-clock";
import { inMemoryErrorReporter } from "@/test/in-memory-error-reporter";
import { inMemoryLeadSubmit } from "@/test/in-memory-lead-submit";
import { inMemoryMotion } from "@/test/in-memory-motion";
import { inMemoryScroller } from "@/test/in-memory-scroller";
import { inMemoryStorage } from "@/test/in-memory-storage";
import { HostFunnel } from "./HostFunnel";

// Shared set-up of the funnel tests. The funnel reads its side effects (clock,
// storage, scroll, motion preference, error report) from the ports and takes
// its send function as a prop (or an argument of the hook). Each one is an
// in-memory adapter here, so nothing posts anywhere and nothing is mocked.

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

/** A result that the test settles by hand, to look at the state while a request runs. */
export function pendingResult() {
  let settle: (result: SubmitResult) => void = () => {};
  const promise = new Promise<SubmitResult>((resolve) => {
    settle = resolve;
  });
  return { promise, settle };
}

/** The in-memory side effects of one test, built fresh before each test. */
export type FunnelEnv = {
  clock: ReturnType<typeof inMemoryClock>;
  storage: ReturnType<typeof inMemoryStorage>;
  reporter: ReturnType<typeof inMemoryErrorReporter>;
  scroller: ReturnType<typeof inMemoryScroller>;
  lead: ReturnType<typeof inMemoryLeadSubmit>;
  /** The ports that `renderFunnel` and `wrapper` give to the funnel. */
  ports: Partial<Ports>;
  /** Asks for reduced motion. Call it before the render. */
  reduceMotion(): void;
  /** Wraps a hook in the ports of this test. */
  wrapper: (props: { children: ReactNode }) => ReactNode;
};

/** Fills `env` with fresh adapters. `env` stays the same object for the whole file. */
function reset(env: FunnelEnv) {
  const clock = inMemoryClock(NOW);
  const storage = inMemoryStorage();
  const reporter = inMemoryErrorReporter();
  const scroller = inMemoryScroller();
  const lead = inMemoryLeadSubmit({ mode: "endpoint" });
  Object.assign(env, {
    clock,
    storage,
    reporter,
    scroller,
    lead,
    ports: {
      clock,
      storage,
      errorReporter: reporter,
      scroller,
      motion: inMemoryMotion(false),
    },
  });
}

// The environment of the running test: the draft helpers below read it too.
// The adapters are filled in by `reset` before each test.
const active = {
  reduceMotion() {
    active.ports = { ...active.ports, motion: inMemoryMotion(true) };
  },
  wrapper: ({ children }) => (
    <PortsProvider ports={active.ports}>{children}</PortsProvider>
  ),
} as FunnelEnv;

/**
 * Registers the hooks of a funnel test file: the time set to `NOW`, an empty
 * store, a send that succeeds, no report, no scroll, the URL reset. The fields
 * of the returned object are replaced before each test, so read them in the tests.
 */
export function setUpFunnelEnvironment(): FunnelEnv {
  beforeEach(() => {
    reset(active);
    window.history.replaceState(null, "", "/");
  });
  return active;
}

/** Saves a draft as the page would have, at the set time of the tests. */
export function storeDraft(draft: Record<string, unknown>) {
  active.storage.setItem(
    DRAFT_KEY,
    JSON.stringify({ _savedAt: NOW.getTime(), ...draft }),
  );
}

export const savedDraft = () =>
  JSON.parse(active.storage.getItem(DRAFT_KEY) ?? "null");

/** Renders the funnel on the ports of the test; `ports` replaces some of them. */
export function renderFunnel(
  site: FormSite = SITE,
  ports: Partial<Ports> = {},
) {
  const user = userEvent.setup();
  const view = render(
    <PortsProvider ports={{ ...active.ports, ...ports }}>
      <HostFunnel offers={OFFERS} site={site} submit={active.lead.submit} />
    </PortsProvider>,
  );
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
