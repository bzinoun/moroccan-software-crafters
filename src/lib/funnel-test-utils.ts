import { EMPTY_VALUES, type FunnelValues } from "./funnel-fields";

// Fixtures of the funnel tests. Nothing here reads live content.

// Dates used below (2026): 7 and 14 November are Saturdays, 8 November is a
// Sunday, 9 November is a Monday.

export const OFFERS = [
  { id: "communautaire", name: "Hôte communautaire", tagline: "x" },
  { id: "partenaire", name: "Meetup partenaire", tagline: "x" },
  { id: "prive", name: "Craft session privée", tagline: "x" },
];
export const OFFER_IDS = OFFERS.map((o) => o.id);

export function values(patch: Partial<FunnelValues> = {}): FunnelValues {
  return { ...EMPTY_VALUES, ...patch };
}

export const FULL: FunnelValues = values({
  formule: "partenaire",
  date: "2026-11-07",
  date_alt: "2026-11-14",
  participants: "40-60",
  ville: "Casablanca",
  capacite: "60",
  equipements: ["Wifi invités", "Parking"],
  sujets: " TDD ",
  entreprise: " Acme ",
  secteur: "Télécoms",
  taille: "20 à 100",
  site: "https://acme.ma",
  adresse: "Anfa",
  nom: " Sara Alaoui ",
  fonction: "CTO",
  email: " sara@acme.ma ",
  telephone: "06 12 34 56 78",
  preference: "E-mail",
  message: " Merci ",
  consent: true,
});
