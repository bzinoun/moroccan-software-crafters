// Field rules shared by the lead forms (host funnel and SoCraTes sponsor form):
// the patterns, the French messages of the contact fields and
// `validateContact`, which both forms call. Messages come back as written: the
// components apply `frenchSpacing()`.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** True for `name@domain.tld`. The caller trims the value first. */
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

/** The phone number without spaces, dots, dashes and brackets. */
export function normalizePhone(value: string): string {
  return value.replace(/[\s.\-()]/g, "");
}

/** Moroccan `05`, `06` or `07` plus 8 digits, or international `+` or `00` plus 8 to 15 digits. */
export function validPhone(value: string): boolean {
  const phone = normalizePhone(value);
  return /^0[5-7]\d{8}$/.test(phone) || /^(\+|00)\d{8,15}$/.test(phone);
}

/**
 * `errors` without the entry of `name`: a field stops being invalid as soon as
 * the visitor edits it. Gives back the same object when there is no entry, so
 * a state update that uses it does not render again.
 */
export function withoutError<E extends Partial<Record<string, string>>>(
  errors: E,
  name: string,
): E {
  if (!(name in errors)) return errors;
  const rest = { ...errors };
  delete rest[name];
  return rest;
}

export type ContactField = "entreprise" | "nom" | "email" | "telephone";
export type ContactErrors = Partial<Record<ContactField, string>>;

const CONTACT_FIELDS = ["entreprise", "nom", "email", "telephone"] as const;

export const CONTACT_ERROR = {
  entreprise: "Indiquez le nom de l'entreprise.",
  nom: "Indiquez votre nom.",
  email: "Adresse e-mail invalide.",
  telephoneEmpty: "Indiquez votre numéro.",
  telephoneBad: "Numéro invalide (ex. +212 6 12 34 56 78 ou 06 12 34 56 78).",
} as const;

export const CONSENT_ERROR =
  "Votre accord est nécessaire pour envoyer la demande.";

/**
 * Checks the contact fields: company, name, e-mail and phone, each trimmed.
 * `fields` limits the check (the funnel asks for the company on step 3 and for
 * the rest on step 4). The result has one message per invalid field.
 */
export function validateContact(
  values: Record<ContactField, string>,
  fields: readonly ContactField[] = CONTACT_FIELDS,
): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of fields) {
    const value = values[field].trim();
    if (field === "telephone") {
      if (!value) errors.telephone = CONTACT_ERROR.telephoneEmpty;
      else if (!validPhone(value))
        errors.telephone = CONTACT_ERROR.telephoneBad;
    } else if (field === "email") {
      if (!isValidEmail(value)) errors.email = CONTACT_ERROR.email;
    } else if (!value) {
      errors[field] = CONTACT_ERROR[field];
    }
  }
  return errors;
}
