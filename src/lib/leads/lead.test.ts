import { describe, expect, it } from "vitest";
import { toLead, toNotionProperties } from "./lead";

const hostPayload = {
  formule: "Meetup partenaire",
  date: "2026-12-05",
  date_alt: "2026-12-12",
  participants: "40-60",
  ville: "Casablanca",
  capacite: "60",
  equipements: "Écran, Micro",
  sujets: "TDD",
  entreprise: "Acme",
  secteur: "Banque",
  taille: "200-1000",
  site: "acme.ma",
  adresse: "Bd Anfa",
  nom: "Sara Alami",
  fonction: "CTO",
  email: "sara@acme.ma",
  telephone: "+212612345678",
  preference: "E-mail",
  message: "Bonjour",
  type: "Hébergement meetup",
  subject: "ignored",
  source: "https://example.org/accueillir/",
  envoye_le: "2026-11-09T10:00:00.000Z",
  utm_source: "linkedin",
  utm_medium: "social",
  utm_campaign: "launch",
  referrer: "https://www.linkedin.com/",
};

const sponsorPayload = {
  entreprise: "Globex",
  nom: "Omar",
  fonction: "",
  email: "omar@globex.ma",
  telephone: "",
  niveau: "Partenaire",
  message: "",
  type: "Sponsoring SoCraTes",
  source: "https://example.org/socrates/",
};

describe("toLead", () => {
  it("reads a host funnel payload into a lead with the meetup source", () => {
    const result = toLead(hostPayload);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.lead).toMatchObject({
      source: "Accueillir un meetup",
      entreprise: "Acme",
      contact: "Sara Alami (CTO)",
      email: "sara@acme.ma",
      telephone: "+212612345678",
      formule: "Meetup partenaire",
      ville: "Casablanca",
      secteur: "Banque",
      taille: "200-1000",
      date: "2026-12-05",
      dateAlt: "2026-12-12",
      participants: "40-60",
      capacite: 60,
      equipements: ["Écran", "Micro"],
      page: "https://example.org/accueillir/",
      utmSource: "linkedin",
      utmMedium: "social",
      utmCampaign: "launch",
      referrer: "https://www.linkedin.com/",
    });
  });

  it("keeps the funnel answers that have no column in the message", () => {
    const result = toLead(hostPayload);
    if (!result.ok) throw new Error("expected a lead");
    expect(result.lead.message).toBe(
      "Bonjour\n\nSujets : TDD\nSite : acme.ma\nAdresse : Bd Anfa\nContact préféré : E-mail",
    );
  });

  it("reads a sponsor form payload with the SoCraTes source and the level", () => {
    const result = toLead(sponsorPayload);
    if (!result.ok) throw new Error("expected a lead");
    expect(result.lead).toMatchObject({
      source: "Sponsor SoCraTes",
      entreprise: "Globex",
      contact: "Omar",
      niveau: "Partenaire",
      equipements: [],
      capacite: null,
    });
  });

  it("refuses a payload without a company, a name or a valid e-mail", () => {
    expect(toLead({ ...sponsorPayload, entreprise: " " }).ok).toBe(false);
    expect(toLead({ ...sponsorPayload, nom: "" }).ok).toBe(false);
    expect(toLead({ ...sponsorPayload, email: "omar@" }).ok).toBe(false);
    expect(toLead("not an object").ok).toBe(false);
  });

  it("refuses an unknown form type", () => {
    expect(toLead({ ...sponsorPayload, type: "Autre" }).ok).toBe(false);
  });

  it("refuses an over-long field instead of storing it", () => {
    expect(toLead({ ...sponsorPayload, message: "x".repeat(5001) }).ok).toBe(
      false,
    );
  });
});

describe("toNotionProperties", () => {
  it("maps a full lead to the Leads database properties, status Nouveau", () => {
    const result = toLead(hostPayload);
    if (!result.ok) throw new Error("expected a lead");
    const p = toNotionProperties(result.lead);
    expect(p["Entreprise"]).toEqual({ title: [{ text: { content: "Acme" } }] });
    expect(p["Contact"]).toEqual({
      rich_text: [{ text: { content: "Sara Alami (CTO)" } }],
    });
    expect(p["E-mail"]).toEqual({ email: "sara@acme.ma" });
    expect(p["Téléphone"]).toEqual({ phone_number: "+212612345678" });
    expect(p["Source"]).toEqual({ select: { name: "Accueillir un meetup" } });
    expect(p["Formule"]).toEqual({ select: { name: "Meetup partenaire" } });
    expect(p["Date souhaitée"]).toEqual({ date: { start: "2026-12-05" } });
    expect(p["Date alternative"]).toEqual({ date: { start: "2026-12-12" } });
    expect(p["Capacité salle"]).toEqual({ number: 60 });
    expect(p["Équipement"]).toEqual({
      multi_select: [{ name: "Écran" }, { name: "Micro" }],
    });
    expect(p["Consentement"]).toEqual({ checkbox: true });
    expect(p["UTM source"]).toEqual({
      rich_text: [{ text: { content: "linkedin" } }],
    });
    expect(p["Page"]).toEqual({
      rich_text: [{ text: { content: "https://example.org/accueillir/" } }],
    });
    expect(p["Statut"]).toEqual({ select: { name: "Nouveau" } });
  });

  it("leaves out the empty values", () => {
    const result = toLead(sponsorPayload);
    if (!result.ok) throw new Error("expected a lead");
    const p = toNotionProperties(result.lead);
    expect(p).not.toHaveProperty("Téléphone");
    expect(p).not.toHaveProperty("Formule");
    expect(p).not.toHaveProperty("Date souhaitée");
    expect(p).not.toHaveProperty("Capacité salle");
    expect(p).not.toHaveProperty("Équipement");
    expect(p).not.toHaveProperty("Message");
    expect(p["Niveau"]).toEqual({ select: { name: "Partenaire" } });
  });
});
