import { describe, expect, it } from "vitest";
import {
  collect,
  dateHelp,
  emailBody,
  formatDay,
  leadSubject,
  nextLabel,
  progressLabel,
  recapRows,
} from "./funnel-text";
import { FULL, OFFERS, values } from "./funnel-test-utils";

describe("dateHelp", () => {
  it("is empty without a date", () => {
    expect(dateHelp("", "communautaire")).toBe("");
  });

  it("is empty for a value that is not a real day", () => {
    expect(dateHelp("2026-13-45", "communautaire")).toBe("");
  });

  it("confirms a Saturday", () => {
    expect(dateHelp("2026-11-07", "communautaire")).toBe("Samedi, c'est noté.");
  });

  it("warns about another day for an open meetup", () => {
    expect(dateHelp("2026-11-09", "partenaire")).toBe(
      "C'est un lundi. Les meetups ouverts ont lieu le samedi matin ; on en discutera ensemble.",
    );
    expect(dateHelp("2026-11-08", "")).toBe(
      "C'est un dimanche. Les meetups ouverts ont lieu le samedi matin ; on en discutera ensemble.",
    );
  });

  it("does not warn for the private session, which can take place any day", () => {
    expect(dateHelp("2026-11-09", "prive")).toBe("Lundi, c'est noté.");
  });
});

describe("formatDay", () => {
  it("writes the weekday, the day, the month and the year in French", () => {
    expect(formatDay("2026-11-07")).toBe("samedi 7 novembre 2026");
  });

  it("is empty without a date", () => {
    expect(formatDay("")).toBe("");
  });
});

describe("collect", () => {
  it("trims the text, joins the equipment and normalizes the phone", () => {
    expect(collect(FULL, OFFERS)).toEqual({
      formule: "Meetup partenaire",
      date: "2026-11-07",
      date_alt: "2026-11-14",
      participants: "40-60",
      ville: "Casablanca",
      capacite: "60",
      equipements: "Wifi invités, Parking",
      sujets: "TDD",
      entreprise: "Acme",
      secteur: "Télécoms",
      taille: "20 à 100",
      site: "https://acme.ma",
      adresse: "Anfa",
      nom: "Sara Alaoui",
      fonction: "CTO",
      email: "sara@acme.ma",
      telephone: "0612345678",
      preference: "E-mail",
      message: "Merci",
    });
  });

  it("keeps the raw id when the offer is unknown", () => {
    expect(collect(values({ formule: "inconnue" }), OFFERS).formule).toBe(
      "inconnue",
    );
  });
});

describe("recapRows", () => {
  it("lists the filled summary lines in order", () => {
    expect(recapRows(collect(FULL, OFFERS))).toEqual([
      ["Formule", "Meetup partenaire"],
      ["Date souhaitée", "samedi 7 novembre 2026 (ou samedi 14 novembre 2026)"],
      ["Crafters attendus", "40-60 · salle de 60 places"],
      ["Lieu", "Anfa, Casablanca"],
      ["Sur place", "Wifi invités, Parking"],
      ["Entreprise", "Acme · Télécoms · équipe tech : 20 à 100"],
    ]);
  });

  it("skips the empty lines", () => {
    const lead = collect(
      values({
        formule: "prive",
        date: "2026-11-09",
        participants: "20-40",
        entreprise: "Acme",
      }),
      OFFERS,
    );
    expect(recapRows(lead)).toEqual([
      ["Formule", "Craft session privée"],
      ["Date souhaitée", "lundi 9 novembre 2026"],
      ["Crafters attendus", "20-40"],
      ["Lieu", "Casablanca"],
      ["Entreprise", "Acme"],
    ]);
  });
});

describe("emailBody", () => {
  it("writes one line per filled answer, with the message after a blank line", () => {
    expect(emailBody(collect(FULL, OFFERS))).toBe(
      [
        "Formule : Meetup partenaire",
        "Date souhaitée : samedi 7 novembre 2026",
        "Date alternative : samedi 14 novembre 2026",
        "Crafters attendus : 40-60",
        "Capacité de la salle : 60",
        "Ville : Casablanca (Anfa)",
        "Sur place : Wifi invités, Parking",
        "Sujets : TDD",
        "Entreprise : Acme",
        "Secteur : Télécoms",
        "Équipe tech : 20 à 100",
        "Site : https://acme.ma",
        "Contact : Sara Alaoui, CTO",
        "E-mail : sara@acme.ma",
        "Téléphone : 0612345678",
        "Préférence : E-mail",
        "",
        "Merci",
      ].join("\n"),
    );
  });

  it("leaves out the optional lines that are empty", () => {
    const lead = collect(
      values({
        formule: "communautaire",
        date: "2026-11-07",
        participants: "20-40",
        entreprise: "Acme",
        nom: "Sara",
        email: "sara@acme.ma",
        telephone: "0612345678",
      }),
      OFFERS,
    );
    expect(emailBody(lead)).toBe(
      [
        "Formule : Hôte communautaire",
        "Date souhaitée : samedi 7 novembre 2026",
        "Crafters attendus : 20-40",
        "Ville : Casablanca",
        "Entreprise : Acme",
        "Contact : Sara",
        "E-mail : sara@acme.ma",
        "Téléphone : 0612345678",
        "Préférence : E-mail",
      ].join("\n"),
    );
  });
});

describe("leadSubject", () => {
  it("names the company and the date", () => {
    expect(leadSubject(collect(FULL, OFFERS))).toBe(
      "Demande d'hébergement meetup · Acme · 2026-11-07",
    );
  });
});

describe("labels", () => {
  it("writes the progress label with the step title", () => {
    expect(progressLabel(1)).toBe("Étape 1 sur 4 · Formule");
    expect(progressLabel(2)).toBe("Étape 2 sur 4 · L'événement");
    expect(progressLabel(3)).toBe("Étape 3 sur 4 · Votre entreprise");
    expect(progressLabel(4)).toBe("Étape 4 sur 4 · Contact");
  });

  it("changes the next button label on the last step and while sending", () => {
    expect(nextLabel(1, false)).toBe("Continuer");
    expect(nextLabel(3, false)).toBe("Continuer");
    expect(nextLabel(4, false)).toBe("Envoyer ma demande");
    expect(nextLabel(4, true)).toBe("Envoi…");
  });
});
