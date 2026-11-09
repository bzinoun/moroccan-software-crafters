// A lead from one of the site forms, as the server stores it, and its mapping
// to the properties of the Notion "Leads" database.
import { z } from "zod";

const SOURCES = {
  "Hébergement meetup": "Accueillir un meetup",
  "Sponsoring SoCraTes": "Sponsor SoCraTes",
} as const;

const text = (max: number) => z.string().trim().max(max).default("");

/** The payload both forms send (see buildPayload in src/lib/forms.ts). */
const payloadSchema = z.object({
  type: z.enum(["Hébergement meetup", "Sponsoring SoCraTes"]),
  entreprise: z.string().trim().min(1).max(200),
  nom: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  fonction: text(200),
  telephone: text(40),
  formule: text(200),
  niveau: text(200),
  ville: text(200),
  secteur: text(200),
  taille: text(200),
  date: text(10),
  date_alt: text(10),
  participants: text(40),
  capacite: text(10),
  equipements: text(1000),
  sujets: text(2000),
  site: text(300),
  adresse: text(500),
  preference: text(100),
  message: text(5000),
  source: text(500),
  utm_source: text(200),
  utm_medium: text(200),
  utm_campaign: text(200),
  referrer: text(500),
});

export type Lead = {
  source: (typeof SOURCES)[keyof typeof SOURCES];
  entreprise: string;
  contact: string;
  email: string;
  telephone: string;
  formule: string;
  niveau: string;
  ville: string;
  secteur: string;
  taille: string;
  date: string;
  dateAlt: string;
  participants: string;
  capacite: number | null;
  equipements: string[];
  message: string;
  page: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
};

export type LeadResult =
  { ok: true; lead: Lead } | { ok: false; error: string };

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Reads an untrusted form payload into a lead, or says why it is refused. */
export function toLead(payload: unknown): LeadResult {
  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  const p = parsed.data;
  const capacity = /^\d+$/.test(p.capacite) ? Number(p.capacite) : null;
  const extras = [
    p.sujets && `Sujets : ${p.sujets}`,
    p.site && `Site : ${p.site}`,
    p.adresse && `Adresse : ${p.adresse}`,
    p.preference && `Contact préféré : ${p.preference}`,
  ].filter(Boolean);
  return {
    ok: true,
    lead: {
      source: SOURCES[p.type],
      entreprise: p.entreprise,
      contact: p.fonction ? `${p.nom} (${p.fonction})` : p.nom,
      email: p.email,
      telephone: p.telephone,
      formule: p.formule,
      niveau: p.niveau,
      ville: p.ville,
      secteur: p.secteur,
      taille: p.taille,
      date: ISO_DAY.test(p.date) ? p.date : "",
      dateAlt: ISO_DAY.test(p.date_alt) ? p.date_alt : "",
      participants: p.participants,
      capacite: capacity,
      equipements: p.equipements
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      message: [p.message, extras.join("\n")].filter(Boolean).join("\n\n"),
      page: p.source,
      utmSource: p.utm_source,
      utmMedium: p.utm_medium,
      utmCampaign: p.utm_campaign,
      referrer: p.referrer,
    },
  };
}

type NotionProperty = Record<string, unknown>;

// Notion caps one rich text object at 2000 characters.
const richText = (value: string) => ({
  rich_text: [{ text: { content: value.slice(0, 2000) } }],
});

/** Properties of a new page in the Leads database. Empty values are left out. */
export function toNotionProperties(lead: Lead): Record<string, NotionProperty> {
  const properties: Record<string, NotionProperty> = {
    Entreprise: { title: [{ text: { content: lead.entreprise } }] },
    Contact: richText(lead.contact),
    "E-mail": { email: lead.email },
    Source: { select: { name: lead.source } },
    // The forms refuse to send without the consent box checked.
    Consentement: { checkbox: true },
    Statut: { select: { name: "Nouveau" } },
  };
  const optional: [string, string, (v: string) => NotionProperty][] = [
    ["Téléphone", lead.telephone, (v) => ({ phone_number: v })],
    ["Formule", lead.formule, (v) => ({ select: { name: v } })],
    ["Niveau", lead.niveau, (v) => ({ select: { name: v } })],
    ["Ville", lead.ville, richText],
    ["Secteur", lead.secteur, richText],
    ["Taille", lead.taille, richText],
    ["Date souhaitée", lead.date, (v) => ({ date: { start: v } })],
    ["Date alternative", lead.dateAlt, (v) => ({ date: { start: v } })],
    ["Crafters attendus", lead.participants, richText],
    ["Message", lead.message, richText],
    ["UTM source", lead.utmSource, richText],
    ["UTM medium", lead.utmMedium, richText],
    ["UTM campaign", lead.utmCampaign, richText],
    ["Référent", lead.referrer, richText],
    ["Page", lead.page, richText],
  ];
  for (const [name, value, build] of optional) {
    if (value) properties[name] = build(value);
  }
  if (lead.capacite !== null)
    properties["Capacité salle"] = { number: lead.capacite };
  if (lead.equipements.length)
    properties["Équipement"] = {
      multi_select: lead.equipements.map((name) => ({ name })),
    };
  return properties;
}
