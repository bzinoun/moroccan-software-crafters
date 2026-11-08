// Pure logic of the host funnel (`/accueillir/`), ported from
// former `assets/js/funnel.js` (`git show 1353207:assets/js/funnel.js`): step validation, date rules, the lead and its e-mail
// body, the recap, the progress label and the draft. No React, no DOM; the
// storage helpers take no argument and read `localStorage` at call time, so call
// them from handlers and effects only.
// Text is returned as the old site wrote it: the components apply `frenchSpacing()`.

import type { Offer } from "@/content/types";
import { isValidEmail, normalizePhone, validPhone } from "./validation";

export const DRAFT_KEY = "msc-host-draft-v1";
export const TOTAL_STEPS = 4;
export const STEP_TITLES = [
  "Formule",
  "L'événement",
  "Votre entreprise",
  "Contact",
] as const;

/** `type` field of the lead, and the first part of its subject. */
export const LEAD_TYPE = "Hébergement meetup";

const DAYS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
] as const;

/** Option lists, shared by the controls and the draft restore. */
export const PARTICIPANTS = [
  { value: "20-40", label: "20 à 40" },
  { value: "40-60", label: "40 à 60" },
  { value: "60-80", label: "60 à 80" },
  { value: "80+", label: "Plus de 80" },
] as const;
export const VILLES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Autre",
] as const;
export const EQUIPEMENTS = [
  "Salle plénière",
  "Salles pour les tables rondes",
  "Écran ou projecteur",
  "Wifi invités",
  "Café et petit-déjeuner",
  "Parking",
] as const;
export const SECTEURS = [
  "Banque et assurance",
  "ESN et conseil",
  "Éditeur et startup",
  "Télécoms",
  "Industrie et distribution",
  "Secteur public",
  "Autre",
] as const;
export const TAILLES = [
  "Moins de 20",
  "20 à 100",
  "100 à 500",
  "Plus de 500",
] as const;
export const PREFERENCES = ["E-mail", "Téléphone", "WhatsApp"] as const;

/** What the person typed or picked, one entry per control. */
export type FunnelValues = {
  formule: string;
  date: string;
  date_alt: string;
  participants: string;
  ville: string;
  capacite: string;
  equipements: string[];
  sujets: string;
  entreprise: string;
  secteur: string;
  taille: string;
  site: string;
  adresse: string;
  nom: string;
  fonction: string;
  email: string;
  telephone: string;
  preference: string;
  message: string;
  consent: boolean;
};

/** The fields of an offer that the funnel reads. */
export type FunnelOffer = Pick<Offer, "id" | "name" | "tagline" | "price">;

/** The cleaned answers that are sent: trimmed text, equipment as one string. */
export type Lead = {
  formule: string;
  date: string;
  date_alt: string;
  participants: string;
  ville: string;
  capacite: string;
  equipements: string;
  sujets: string;
  entreprise: string;
  secteur: string;
  taille: string;
  site: string;
  adresse: string;
  nom: string;
  fonction: string;
  email: string;
  telephone: string;
  preference: string;
  message: string;
};

/** The fields that carry an error message. */
export type ErrorField =
  | "formule"
  | "date"
  | "participants"
  | "capacite"
  | "entreprise"
  | "site"
  | "nom"
  | "email"
  | "telephone"
  | "consent";
export type FieldErrors = Partial<Record<ErrorField, string>>;

/** The form as it first appears: the first city, the e-mail preference, nothing else. */
export const EMPTY_VALUES: FunnelValues = {
  formule: "",
  date: "",
  date_alt: "",
  participants: "",
  ville: VILLES[0],
  capacite: "",
  equipements: [],
  sujets: "",
  entreprise: "",
  secteur: "",
  taille: "",
  site: "",
  adresse: "",
  nom: "",
  fonction: "",
  email: "",
  telephone: "",
  preference: PREFERENCES[0],
  message: "",
  consent: false,
};

export const ERROR_TEXT = {
  formule: "Choisissez une formule pour continuer.",
  date: "Indiquez une date à venir.",
  participants: "Indiquez une fourchette.",
  capacite: "Entre 10 et 1000 places.",
  entreprise: "Indiquez le nom de l'entreprise.",
  site: "Adresse invalide (elle doit commencer par https://).",
  nom: "Indiquez votre nom.",
  email: "Adresse e-mail invalide.",
  telephoneEmpty: "Indiquez votre numéro.",
  telephoneBad: "Numéro invalide (ex. +212 6 12 34 56 78 ou 06 12 34 56 78).",
  consent: "Votre accord est nécessaire pour envoyer la demande.",
} as const;

/** Texts of the success panel and of the alerts, as in the old page. */
export const MESSAGES = {
  successDefault:
    "Un membre de l'équipe vous recontacte sous 48 heures pour valider la date et la logistique.",
  successMailto:
    "Votre messagerie s'est ouverte avec la demande pré-remplie : il ne reste qu'à l'envoyer. Nous revenons vers vous sous 48 heures.",
  failed:
    "L'envoi n'a pas abouti. Vos réponses sont conservées, réessayez dans un instant.",
  alsoWriteTo: "Vous pouvez aussi nous écrire à",
  alsoWriteOn: "Vous pouvez aussi nous écrire sur",
} as const;

// ---- dates ----------------------------------------------------------------

/** The local day after `now`, as `YYYY-MM-DD`: the `min` of the date fields. */
export function tomorrowIso(now: Date): string {
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/** "2026-11-07" gives "samedi 7 novembre 2026". Empty in, empty out. */
export function formatDay(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * The help line under the date. A day other than Saturday gets a warning,
 * except for the private session (offer id `prive`), which can take place any day.
 */
export function dateHelp(date: string, formule: string): string {
  if (!date) return "";
  const day = new Date(`${date}T12:00:00`).getDay();
  const name = DAYS[day]!;
  if (day !== 6 && formule !== "prive") {
    return `C'est un ${name}. Les meetups ouverts ont lieu le samedi matin ; on en discutera ensemble.`;
  }
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}, c'est noté.`;
}

// ---- validation -----------------------------------------------------------

export type StepValidation = {
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

  if (step === 1 && !v.formule) fail("formule", ERROR_TEXT.formule);
  if (step === 2) {
    if (!v.date || v.date < min) fail("date", ERROR_TEXT.date);
    if (!v.participants) fail("participants", ERROR_TEXT.participants);
    if (v.capacite && (Number(v.capacite) < 10 || Number(v.capacite) > 1000)) {
      fail("capacite", ERROR_TEXT.capacite);
    }
  }
  if (step === 3) {
    if (!v.entreprise.trim()) fail("entreprise", ERROR_TEXT.entreprise);
    const site = v.site.trim();
    if (site && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(site)) {
      fail("site", ERROR_TEXT.site);
    }
  }
  if (step === 4) {
    if (!v.nom.trim()) fail("nom", ERROR_TEXT.nom);
    if (!isValidEmail(v.email.trim())) {
      fail("email", ERROR_TEXT.email);
    }
    if (!validPhone(v.telephone)) {
      fail(
        "telephone",
        v.telephone.trim()
          ? ERROR_TEXT.telephoneBad
          : ERROR_TEXT.telephoneEmpty,
      );
    }
    if (!v.consent) fail("consent", ERROR_TEXT.consent);
  }
  return { errors, first };
}

export type FormValidation = StepValidation & {
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

// ---- lead, recap, e-mail --------------------------------------------------

export function collect(
  v: FunnelValues,
  offers: readonly Pick<Offer, "id" | "name">[],
): Lead {
  const offer = offers.find((o) => o.id === v.formule);
  return {
    formule: offer ? offer.name : v.formule,
    date: v.date,
    date_alt: v.date_alt,
    participants: v.participants,
    ville: v.ville,
    capacite: v.capacite,
    equipements: v.equipements.join(", "),
    sujets: v.sujets.trim(),
    entreprise: v.entreprise.trim(),
    secteur: v.secteur,
    taille: v.taille,
    site: v.site.trim(),
    adresse: v.adresse.trim(),
    nom: v.nom.trim(),
    fonction: v.fonction.trim(),
    email: v.email.trim(),
    telephone: normalizePhone(v.telephone),
    preference: v.preference,
    message: v.message.trim(),
  };
}

/** The lines of the summary box on step 4, without the empty ones. */
export function recapRows(d: Lead): [label: string, value: string][] {
  const rows: [string, string][] = [
    ["Formule", d.formule],
    [
      "Date souhaitée",
      formatDay(d.date) + (d.date_alt ? ` (ou ${formatDay(d.date_alt)})` : ""),
    ],
    [
      "Crafters attendus",
      d.participants + (d.capacite ? ` · salle de ${d.capacite} places` : ""),
    ],
    ["Lieu", [d.adresse, d.ville].filter(Boolean).join(", ")],
    ["Sur place", d.equipements],
    [
      "Entreprise",
      [d.entreprise, d.secteur, d.taille && `équipe tech : ${d.taille}`]
        .filter(Boolean)
        .join(" · "),
    ],
  ];
  return rows.filter(([, value]) => value);
}

/** The body of the prefilled e-mail: one line per filled answer. */
export function emailBody(d: Lead): string {
  return [
    `Formule : ${d.formule}`,
    `Date souhaitée : ${formatDay(d.date)}`,
    d.date_alt && `Date alternative : ${formatDay(d.date_alt)}`,
    `Crafters attendus : ${d.participants}`,
    d.capacite && `Capacité de la salle : ${d.capacite}`,
    `Ville : ${d.ville}${d.adresse ? ` (${d.adresse})` : ""}`,
    d.equipements && `Sur place : ${d.equipements}`,
    d.sujets && `Sujets : ${d.sujets}`,
    "",
    `Entreprise : ${d.entreprise}`,
    d.secteur && `Secteur : ${d.secteur}`,
    d.taille && `Équipe tech : ${d.taille}`,
    d.site && `Site : ${d.site}`,
    "",
    `Contact : ${d.nom}${d.fonction ? `, ${d.fonction}` : ""}`,
    `E-mail : ${d.email}`,
    `Téléphone : ${d.telephone}`,
    `Préférence : ${d.preference}`,
    d.message && `\n${d.message}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function leadSubject(d: Lead): string {
  return `Demande d'hébergement meetup · ${d.entreprise} · ${d.date}`;
}

// ---- labels ---------------------------------------------------------------

export function progressLabel(step: number): string {
  return `Étape ${step} sur ${TOTAL_STEPS} · ${STEP_TITLES[step - 1]}`;
}

export function nextLabel(step: number, busy: boolean): string {
  if (busy) return "Envoi…";
  return step === TOTAL_STEPS ? "Envoyer ma demande" : "Continuer";
}

// ---- draft ----------------------------------------------------------------

export type Draft = Record<string, unknown>;

/**
 * What the old page saved: every control except the consent and the honeypot,
 * keyed by field name in page order. A radio group with no choice and an empty
 * equipment list have no key, as with `FormData`.
 */
export function toDraft(v: FunnelValues, step: number): Draft {
  const draft: Draft = {};
  if (v.formule) draft.formule = v.formule;
  draft.date = v.date;
  draft.date_alt = v.date_alt;
  if (v.participants) draft.participants = v.participants;
  draft.ville = v.ville;
  draft.capacite = v.capacite;
  if (v.equipements.length) draft.equipements = [...v.equipements];
  draft.sujets = v.sujets;
  draft.entreprise = v.entreprise;
  draft.secteur = v.secteur;
  draft.taille = v.taille;
  draft.site = v.site;
  draft.adresse = v.adresse;
  draft.nom = v.nom;
  draft.fonction = v.fonction;
  draft.email = v.email;
  draft.telephone = v.telephone;
  draft.preference = v.preference;
  draft.message = v.message;
  draft._step = step;
  return draft;
}

const DATE_SHAPE = /^\d{4}-\d{2}-\d{2}$/;
const CAPACITY_SHAPE = /^(\d{1,4})?$/;

/** `YYYY-MM-DD` that names a day of the calendar ("2027-02-30" does not). */
function isRealDate(value: string): boolean {
  if (!DATE_SHAPE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}
const TEXT_FIELDS = [
  "capacite",
  "sujets",
  "entreprise",
  "site",
  "adresse",
  "nom",
  "fonction",
  "email",
  "telephone",
  "message",
] as const;

type RestoreInput = {
  draft: Draft | null;
  /** `location.search`, with or without the leading ?. */
  search: string;
  offerIds: readonly string[];
  /** First date allowed (`tomorrowIso`): an earlier saved date is dropped. */
  min: string;
};

/**
 * The saved answers plus `?formule=<id>`, and the step to open. The offer in
 * the URL replaces the saved one, even when it names no offer (the choice is
 * then empty). Coming from an offer card with no saved step opens step 2.
 * A saved value that is not an option of its control is ignored.
 */
export function restoreDraft({ draft, search, offerIds, min }: RestoreInput): {
  values: FunnelValues;
  step: number;
} {
  const stored: Draft = draft ?? {};
  const paramFormule = new URLSearchParams(search).get("formule");
  const source: Draft = paramFormule
    ? { ...stored, formule: paramFormule }
    : stored;
  const values: FunnelValues = { ...EMPTY_VALUES, equipements: [] };

  const choice = (value: unknown, options: readonly string[]) =>
    typeof value === "string" && options.includes(value) ? value : undefined;
  const asString = (value: unknown) =>
    typeof value === "string" ? value : undefined;

  values.formule = choice(source.formule, offerIds) ?? values.formule;
  values.participants =
    choice(
      source.participants,
      PARTICIPANTS.map((p) => p.value),
    ) ?? values.participants;
  values.ville = choice(source.ville, VILLES) ?? values.ville;
  values.secteur = choice(source.secteur, ["", ...SECTEURS]) ?? values.secteur;
  values.taille = choice(source.taille, ["", ...TAILLES]) ?? values.taille;
  values.preference =
    choice(source.preference, PREFERENCES) ?? values.preference;
  if (Array.isArray(source.equipements)) {
    values.equipements = EQUIPEMENTS.filter((e) =>
      (source.equipements as unknown[]).includes(e),
    );
  }
  for (const key of TEXT_FIELDS) values[key] = asString(source[key]) ?? "";
  // A number of places is one to four digits; the range is checked on send.
  if (!CAPACITY_SHAPE.test(values.capacite)) values.capacite = "";
  for (const key of ["date", "date_alt"] as const) {
    const value = asString(source[key]);
    values[key] = value && isRealDate(value) && value >= min ? value : "";
  }

  if (paramFormule && values.formule && !stored._step) {
    return { values, step: 2 };
  }
  const saved = Math.trunc(Number(stored._step)) || 1;
  return { values, step: Math.min(Math.max(saved, 1), TOTAL_STEPS) };
}

// The storage can be unavailable (private browsing): the form works without it.

export function readDraft(): Draft | null {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(DRAFT_KEY) || "null",
    );
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Draft)
      : null;
  } catch {
    return null;
  }
}

export function writeDraft(draft: Draft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // the draft is not kept
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // nothing to clean
  }
}
