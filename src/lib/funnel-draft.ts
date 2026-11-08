// The saved draft of the host funnel: what is written to `localStorage`, and
// how a saved draft plus `?formule=<id>` becomes the answers and the step to
// open. The storage helpers take no argument and read `localStorage` at call
// time, so call them from handlers and effects only.

import { parseIsoDay } from "./dates";
import {
  CAPACITY_SHAPE,
  EMPTY_VALUES,
  EQUIPEMENTS,
  PARTICIPANTS,
  PREFERENCES,
  SECTEURS,
  TAILLES,
  TOTAL_STEPS,
  VILLES,
  pick,
} from "./funnel-fields";
import type { FunnelValues } from "./funnel-fields";

export const DRAFT_KEY = "msc-host-draft-v1";

type Draft = Record<string, unknown>;

/**
 * What the page saves: every control except the consent and the honeypot,
 * keyed by field name in page order. A set of radios with no choice and an empty
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

  const asString = (value: unknown) =>
    typeof value === "string" ? value : undefined;

  values.formule = pick(offerIds, source.formule) ?? values.formule;
  values.participants =
    pick(
      PARTICIPANTS.map((p) => p.value),
      source.participants,
    ) ?? values.participants;
  values.ville = pick(VILLES, source.ville) ?? values.ville;
  values.secteur = pick(SECTEURS, source.secteur) ?? values.secteur;
  values.taille = pick(TAILLES, source.taille) ?? values.taille;
  values.preference = pick(PREFERENCES, source.preference) ?? values.preference;
  if (Array.isArray(source.equipements)) {
    const saved: unknown[] = source.equipements;
    values.equipements = EQUIPEMENTS.filter((e) => saved.includes(e));
  }
  for (const key of TEXT_FIELDS) values[key] = asString(source[key]) ?? "";
  // A number of places is one to four digits; the range is checked on send.
  if (values.capacite && !CAPACITY_SHAPE.test(values.capacite)) {
    values.capacite = "";
  }
  for (const key of ["date", "date_alt"] as const) {
    const value = asString(source[key]);
    values[key] = value && parseIsoDay(value) && value >= min ? value : "";
  }

  if (paramFormule && values.formule && !stored._step) {
    return { values, step: 2 };
  }
  const saved = Math.trunc(Number(stored._step)) || 1;
  return { values, step: Math.min(Math.max(saved, 1), TOTAL_STEPS) };
}

// The storage can be unavailable (private browsing): the form works without it.

/** A saved draft holds a name, an e-mail and a phone number (law 09-08): it does not stay longer. */
export const DRAFT_MAX_AGE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The saved draft, or null. A draft is deleted when it is older than
 * `DRAFT_MAX_AGE_DAYS` or has no valid past timestamp. `now` is the test clock.
 */
export function readDraft(now: Date = new Date()): Draft | null {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(DRAFT_KEY) || "null",
    );
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const draft = parsed as Draft;
    const savedAt = draft._savedAt;
    const age =
      typeof savedAt === "number" ? now.getTime() - savedAt : Number.NaN;
    // A stamp in the future (a clock that was set ahead) would extend the 30 days.
    if (!(age >= 0 && age <= DRAFT_MAX_AGE_DAYS * DAY_MS)) {
      clearDraft();
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

/** Saves the draft with the time of the write, which starts the 30 days. */
export function writeDraft(draft: Draft, now: Date = new Date()): void {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ ...draft, _savedAt: now.getTime() }),
    );
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
