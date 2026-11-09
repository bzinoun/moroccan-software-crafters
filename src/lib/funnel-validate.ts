// Validation of the host funnel: one step at a time, or all steps before the
// send. Messages come back as written; the components apply
// `frenchSpacing()`.

import { parseIsoDay } from "./dates";
import { CAPACITY_SHAPE, TOTAL_STEPS } from "./funnel-fields";
import type { ErrorField, FieldErrors, FunnelValues } from "./funnel-fields";
import {
  CONSENT_ERROR,
  validateContact,
  type ContactErrors,
} from "./validation";

const ERROR_TEXT = {
  formule: "Choisissez une formule pour continuer.",
  date: "Indiquez une date à venir.",
  dateAlt: "Indiquez une date à venir.",
  participants: "Indiquez une fourchette.",
  capacite: "Entre 10 et 1000 places.",
  site: "Adresse invalide (elle doit commencer par https://).",
} as const;

type StepValidation = {
  errors: FieldErrors;
  /** The first invalid field, in page order, or null when the step is valid. */
  first: ErrorField | null;
};

/** Checks one step. `min` is the first date allowed (`tomorrowIso`). */
export function validateStep(
  step: number,
  v: FunnelValues,
  min: string,
): StepValidation {
  const errors: FieldErrors = {};
  let first: ErrorField | null = null;
  const fail = (field: ErrorField, message: string) => {
    errors[field] = message;
    first ??= field;
  };
  // The contact messages are shared with the sponsor form. Fields in page order.
  const failContact = (
    fields: readonly (keyof ContactErrors)[],
    found: ContactErrors,
  ) => {
    for (const field of fields) {
      const message = found[field];
      if (message) fail(field, message);
    }
  };

  if (step === 1 && !v.formule) fail("formule", ERROR_TEXT.formule);
  if (step === 2) {
    if (!v.date || v.date < min) fail("date", ERROR_TEXT.date);
    // The alternative day is optional, but a typed one follows the same rule as
    // a restored one: a real day that is not past.
    if (v.date_alt && !(parseIsoDay(v.date_alt) && v.date_alt >= min)) {
      fail("date_alt", ERROR_TEXT.dateAlt);
    }
    if (!v.participants) fail("participants", ERROR_TEXT.participants);
    if (
      v.capacite &&
      !(
        CAPACITY_SHAPE.test(v.capacite) &&
        Number(v.capacite) >= 10 &&
        Number(v.capacite) <= 1000
      )
    ) {
      fail("capacite", ERROR_TEXT.capacite);
    }
  }
  if (step === 3) {
    failContact(["entreprise"], validateContact(v, ["entreprise"]));
    const site = v.site.trim();
    if (site && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(site)) {
      fail("site", ERROR_TEXT.site);
    }
  }
  if (step === 4) {
    const contactFields = ["nom", "email", "telephone"] as const;
    failContact(contactFields, validateContact(v, contactFields));
    if (!v.consent) fail("consent", CONSENT_ERROR);
  }
  return { errors, first };
}

type FormValidation = StepValidation & {
  /** The step to go back to. */
  step: number;
  first: ErrorField;
};

/**
 * Checks steps 1 to 4 in order and returns the first invalid one, or null.
 * The last step runs this before sending, as a saved draft can open on step 4
 * with an earlier step incomplete or out of date.
 */
export function validateAll(
  v: FunnelValues,
  min: string,
): FormValidation | null {
  for (let step = 1; step <= TOTAL_STEPS; step++) {
    const { errors, first } = validateStep(step, v, min);
    if (first) return { step, errors, first };
  }
  return null;
}
