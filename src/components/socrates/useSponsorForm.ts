"use client";

import {
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { HONEYPOT_FIELD, type FormSite } from "@/lib/forms";
import { submitFormInBrowser } from "@/lib/forms-browser";
import type { SponsorLevel } from "@/lib/pages-data";
import {
  useLeadSubmit,
  type Outcome,
  type OutcomeTexts,
  type Submit,
} from "@/lib/submit-outcome";
import {
  CONSENT_ERROR,
  normalizePhone,
  validateContact,
  withoutError,
} from "@/lib/validation";
import {
  currentPackageChoice,
  noPackageChoice,
  subscribePackageChoice,
} from "./package-choice";

// State of the SoCraTes sponsor form, as `useHostFunnel` is for the funnel: the
// errors, the level, the validation, the send and the thanks. The component
// keeps the view. One step: validate, send through `submit`, then the thanks
// panel or an alert.

const TYPE = "Sponsoring SoCraTes";
const MAILTO_SUCCESS =
  "Votre messagerie s'est ouverte avec la demande pré-remplie : il ne reste qu'à l'envoyer.";
const RETRY = "L'envoi n'a pas abouti. Réessayez dans un instant";
const FAILURE_TEXTS = {
  plain: `${RETRY}.`,
  mailLead: `${RETRY}, ou écrivez-nous à`,
  linkedinLead: `${RETRY}, ou écrivez-nous sur`,
};

type FieldName = "entreprise" | "nom" | "email" | "telephone" | "consent";
type Errors = Partial<Record<FieldName, string>>;

/** The `value` of a level option: the name of a package, "En nature" or "À discuter". */
export type SponsorLevelValue = SponsorLevel["value"];

/** The options of the level radio group and the one checked first. */
export type SponsorLevels = {
  options: readonly SponsorLevel[];
  defaultValue: SponsorLevelValue;
};

/** Package id to the level that choosing that package checks. */
export type PackageLevels = Readonly<Record<string, SponsorLevelValue>>;

export type SponsorFormOptions = {
  /** The parts of `site.json` the submit code reads: `links.linkedin`, `contact.email`, `form`. */
  site: FormSite;
  /** `sponsorLevels(loadSponsoring())`. */
  levels: SponsorLevels;
  /** Package id to level value: choosing a package checks that level. */
  packageLevels: PackageLevels;
  /** `loadSponsoring().form.success`. */
  successText: string;
  /** The send function. Tests pass a fake; the default posts from the browser. */
  submit?: Submit;
};

export function useSponsorForm({
  site,
  levels,
  packageLevels,
  successText,
  submit = submitFormInBrowser,
}: SponsorFormOptions) {
  const [errors, setErrors] = useState<Errors>({});
  const [niveau, setNiveau] = useState<SponsorLevelValue>(levels.defaultValue);
  const [alert, setAlert] = useState<ReactNode>(null);
  const [thanks, setThanks] = useState<string | null>(null);
  const { busy, isSending, send } = useLeadSubmit(submit, {
    success: successText,
    mailto: MAILTO_SUCCESS,
    failure: FAILURE_TEXTS,
  } satisfies OutcomeTexts);

  // The package buttons live elsewhere in the page: they announce their choice
  // in `package-choice`. A new announcement checks its level. This follows the
  // documented "adjust state while rendering" pattern, so no effect is needed.
  const choice = useSyncExternalStore(
    subscribePackageChoice,
    currentPackageChoice,
    noPackageChoice,
  );
  const [seenChoice, setSeenChoice] = useState(choice);
  if (choice !== seenChoice) {
    setSeenChoice(choice);
    const level = choice ? packageLevels[choice.packageId] : undefined;
    if (level) setNiveau(level);
  }

  // A field stops being invalid as soon as the visitor edits it.
  function onChange(event: ChangeEvent<HTMLFormElement>) {
    const target: unknown = event.target;
    if (!(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    )) {
      return;
    }
    setErrors((current) => withoutError(current, target.name));
  }

  function showOutcome(outcome: Outcome) {
    if (outcome.kind === "success") setThanks(outcome.text);
    else setAlert(outcome.content);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending()) return;
    const form = event.currentTarget;
    setAlert(null);

    const values = new FormData(form);
    const get = (name: string) => String(values.get(name) ?? "").trim();
    const found: Errors = validateContact({
      entreprise: get("entreprise"),
      nom: get("nom"),
      email: get("email"),
      telephone: get("telephone"),
    });
    if (!values.has("consent")) found.consent = CONSENT_ERROR;
    setErrors(found);
    const first = (
      ["entreprise", "nom", "email", "telephone", "consent"] as const
    ).find((name) => found[name]);
    if (first) {
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    const data = {
      entreprise: get("entreprise"),
      nom: get("nom"),
      fonction: get("fonction"),
      email: get("email"),
      telephone: normalizePhone(get("telephone")),
      niveau,
      message: get("message"),
    };
    showOutcome(
      await send({
        site,
        data,
        type: TYPE,
        subject: `Partenariat SoCraTes · ${data.entreprise} · ${data.niveau}`,
        // As typed: the trap field is not trimmed.
        honeypot: String(values.get(HONEYPOT_FIELD) ?? ""),
      }),
    );
  }

  return {
    errors,
    niveau,
    setNiveau,
    busy,
    alert,
    thanks,
    successText,
    onChange,
    onSubmit,
  };
}
