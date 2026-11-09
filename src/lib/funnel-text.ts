// Texts of the host funnel: the success and alert messages, the date lines,
// the lead, its recap and its e-mail body, the progress and button labels.
// Text is returned as written: the components apply `frenchSpacing()`.

import type { Offer } from "@/content/types";
import { parseIsoDay } from "./dates";
import { STEP_TITLES, TOTAL_STEPS } from "./funnel-fields";
import type { FunnelValues, Lead } from "./funnel-fields";
import { normalizePhone } from "./validation";

const DAYS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
] as const;

/** Texts of the success panel and of the alerts, for the host funnel. */
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

/** "2026-11-07" gives "samedi 7 novembre 2026". Empty or invalid in, empty out. */
export function formatDay(iso: string): string {
  const day = parseIsoDay(iso);
  if (!day) return "";
  return day.toLocaleDateString("fr-FR", {
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
  const parsed = parseIsoDay(date);
  if (!parsed) return "";
  const day = parsed.getDay();
  const name = DAYS[day];
  if (name === undefined) return "";
  if (day !== 6 && formule !== "prive") {
    return `C'est un ${name}. Les meetups ouverts ont lieu le samedi matin ; on en discutera ensemble.`;
  }
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}, c'est noté.`;
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
    // A restored draft can lose the main day or the range: join what is left.
    [
      "Date souhaitée",
      d.date
        ? formatDay(d.date) +
          (d.date_alt ? ` (ou ${formatDay(d.date_alt)})` : "")
        : "",
    ],
    [
      "Crafters attendus",
      [d.participants, d.capacite && `salle de ${d.capacite} places`]
        .filter(Boolean)
        .join(" · "),
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
