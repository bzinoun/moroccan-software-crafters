// Vocabulary of the host funnel (`/accueillir/`): the steps, the option lists
// and the types of the answers. The option lists stay in code on purpose: they
// are form vocabulary tied to the validation and to the draft restore, and each
// one gives the union type of its control. No React, no DOM.

import type { Offer } from "@/content/types";

export const TOTAL_STEPS = 4;
export const STEP_TITLES = [
  "Formule",
  "L'événement",
  "Votre entreprise",
  "Contact",
] as const;

/** `type` field of the lead, and the first part of its subject. */
export const LEAD_TYPE = "Hébergement meetup";

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

export type ParticipantRange = (typeof PARTICIPANTS)[number]["value"];
export type Ville = (typeof VILLES)[number];
export type Equipement = (typeof EQUIPEMENTS)[number];
export type Secteur = (typeof SECTEURS)[number];
export type Taille = (typeof TAILLES)[number];
export type Preference = (typeof PREFERENCES)[number];

/**
 * The option of `options` that equals `value`, or undefined. It narrows a
 * string from a control or from storage to the union of the list, with no cast.
 */
export function pick<T extends string>(
  options: readonly T[],
  value: unknown,
): T | undefined {
  return options.find((option) => option === value);
}

/** What the person typed or picked, one entry per control. */
export type FunnelValues = {
  /** An offer id from `offers.json`, empty until one is chosen. */
  formule: string;
  date: string;
  date_alt: string;
  participants: ParticipantRange | "";
  ville: Ville;
  capacite: string;
  equipements: Equipement[];
  sujets: string;
  entreprise: string;
  secteur: Secteur | "";
  taille: Taille | "";
  site: string;
  adresse: string;
  nom: string;
  fonction: string;
  email: string;
  telephone: string;
  preference: Preference;
  message: string;
  consent: boolean;
};

/** The fields bound to a free text value. */
export type TextField = Exclude<
  keyof FunnelValues,
  | "equipements"
  | "consent"
  | "participants"
  | "ville"
  | "secteur"
  | "taille"
  | "preference"
>;

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
