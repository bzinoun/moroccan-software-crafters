import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DRAFT_KEY,
  EMPTY_VALUES,
  clearDraft,
  collect,
  dateHelp,
  emailBody,
  formatDay,
  leadSubject,
  nextLabel,
  progressLabel,
  readDraft,
  recapRows,
  restoreDraft,
  toDraft,
  tomorrowIso,
  validateAll,
  validateStep,
  writeDraft,
  type FunnelValues,
} from "./funnel";

// Dates used below (2026): 7 and 14 November are Saturdays, 8 November is a
// Sunday, 9 November is a Monday.

const OFFERS = [
  { id: "communautaire", name: "Hôte communautaire", tagline: "x" },
  { id: "partenaire", name: "Meetup partenaire", tagline: "x" },
  { id: "prive", name: "Craft session privée", tagline: "x" },
];
const OFFER_IDS = OFFERS.map((o) => o.id);

function values(patch: Partial<FunnelValues> = {}): FunnelValues {
  return { ...EMPTY_VALUES, ...patch };
}

const FULL: FunnelValues = values({
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

describe("EMPTY_VALUES", () => {
  it("starts on the first city and the e-mail preference, like the old form", () => {
    expect(EMPTY_VALUES).toMatchObject({
      formule: "",
      ville: "Casablanca",
      preference: "E-mail",
      equipements: [],
      consent: false,
    });
  });
});

describe("tomorrowIso", () => {
  it("returns the next local day as YYYY-MM-DD", () => {
    expect(tomorrowIso(new Date(2026, 10, 7, 23, 30))).toBe("2026-11-08");
  });

  it("crosses the end of the year", () => {
    expect(tomorrowIso(new Date(2026, 11, 31, 8, 0))).toBe("2027-01-01");
  });
});

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

describe("validateStep", () => {
  const MIN = "2026-11-08";

  it("step 1 asks for an offer", () => {
    expect(validateStep(1, values(), MIN)).toEqual({
      errors: { formule: "Choisissez une formule pour continuer." },
      first: "formule",
    });
    expect(validateStep(1, values({ formule: "prive" }), MIN)).toEqual({
      errors: {},
      first: null,
    });
  });

  it("step 2 lists the date, the attendees and the capacity in this order", () => {
    const result = validateStep(2, values({ capacite: "9" }), MIN);
    expect(result.errors).toEqual({
      date: "Indiquez une date à venir.",
      participants: "Indiquez une fourchette.",
      capacite: "Entre 10 et 1000 places.",
    });
    expect(result.first).toBe("date");
  });

  it("step 2 rejects a date before the minimum and accepts the minimum", () => {
    const base = { participants: "20-40" };
    expect(
      validateStep(2, values({ ...base, date: "2026-11-07" }), MIN).first,
    ).toBe("date");
    expect(
      validateStep(2, values({ ...base, date: "2026-11-08" }), MIN),
    ).toEqual({ errors: {}, first: null });
  });

  it("step 2 accepts an empty capacity and the limits 10 and 1000", () => {
    const base = { date: "2026-11-14", participants: "80+" };
    for (const capacite of ["", "10", "1000"]) {
      expect(validateStep(2, values({ ...base, capacite }), MIN).first).toBe(
        null,
      );
    }
    for (const capacite of ["9", "1001"]) {
      expect(validateStep(2, values({ ...base, capacite }), MIN).first).toBe(
        "capacite",
      );
    }
  });

  it("step 3 needs the company name, not only spaces", () => {
    expect(validateStep(3, values({ entreprise: "  " }), MIN)).toEqual({
      errors: { entreprise: "Indiquez le nom de l'entreprise." },
      first: "entreprise",
    });
  });

  it("step 3 checks the web address only when it is filled", () => {
    const ok = (site: string) =>
      validateStep(3, values({ entreprise: "Acme", site }), MIN).first;
    expect(ok("")).toBe(null);
    expect(ok("https://acme.ma")).toBe(null);
    expect(ok("HTTP://www.acme.ma/page")).toBe(null);
    expect(ok("acme.ma")).toBe("site");
    expect(ok("https://acme")).toBe("site");
    expect(ok("https://a cme.ma")).toBe("site");
    expect(
      validateStep(3, values({ entreprise: "Acme", site: "acme.ma" }), MIN)
        .errors.site,
    ).toBe("Adresse invalide (elle doit commencer par https://).");
  });

  it("step 4 lists the name, e-mail, phone and consent in this order", () => {
    const result = validateStep(4, values({ email: "sara@acme" }), MIN);
    expect(result.errors).toEqual({
      nom: "Indiquez votre nom.",
      email: "Adresse e-mail invalide.",
      telephone: "Indiquez votre numéro.",
      consent: "Votre accord est nécessaire pour envoyer la demande.",
    });
    expect(result.first).toBe("nom");
  });

  it("step 4 gives the empty message for an empty phone and the format message for a wrong one", () => {
    const base = { nom: "Sara", email: "sara@acme.ma", consent: true };
    expect(
      validateStep(4, values({ ...base, telephone: "  " }), MIN).errors
        .telephone,
    ).toBe("Indiquez votre numéro.");
    expect(
      validateStep(4, values({ ...base, telephone: "0412" }), MIN).errors
        .telephone,
    ).toBe("Numéro invalide (ex. +212 6 12 34 56 78 ou 06 12 34 56 78).");
  });

  it("step 4 passes with valid contact data and consent", () => {
    expect(validateStep(4, FULL, MIN)).toEqual({ errors: {}, first: null });
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

describe("toDraft", () => {
  it("keeps every answer and the step, without the consent", () => {
    expect(toDraft(FULL, 3)).toEqual({
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
      _step: 3,
    });
  });

  it("leaves out an unchecked radio group and an empty equipment list, as a form would", () => {
    const draft = toDraft(values(), 1);
    expect(draft).not.toHaveProperty("formule");
    expect(draft).not.toHaveProperty("participants");
    expect(draft).not.toHaveProperty("equipements");
    expect(draft).not.toHaveProperty("consent");
    expect(draft).toMatchObject({ ville: "Casablanca", _step: 1 });
  });
});

describe("restoreDraft", () => {
  const MIN = "2026-11-08";
  const restore = (
    draft: Record<string, unknown> | null,
    search = "",
    min = MIN,
  ) => restoreDraft({ draft, search, offerIds: OFFER_IDS, min });

  it("gives the empty form on step 1 without a draft", () => {
    expect(restore(null)).toEqual({ values: EMPTY_VALUES, step: 1 });
  });

  it("restores the answers and the step of a draft", () => {
    const result = restore(toDraft(FULL, 3), "", "2026-11-01");
    expect(result.step).toBe(3);
    expect(result.values).toEqual({ ...FULL, consent: false });
  });

  it("clamps the step to 1..4 and falls back to 1", () => {
    expect(restore({ _step: 99 }).step).toBe(4);
    expect(restore({ _step: -2 }).step).toBe(1);
    expect(restore({ _step: 0 }).step).toBe(1);
    expect(restore({ _step: "abc" }).step).toBe(1);
    expect(restore({ _step: "3" }).step).toBe(3);
  });

  it("clears a date that is before the minimum", () => {
    const result = restore({ date: "2026-11-07", date_alt: "2026-11-08" });
    expect(result.values.date).toBe("");
    expect(result.values.date_alt).toBe("2026-11-08");
  });

  it("ignores a value that is not an option of its control", () => {
    const result = restore({
      ville: "Paris",
      participants: "999",
      preference: "Pigeon",
      secteur: "Autre",
      equipements: ["Parking", "Piscine"],
    });
    expect(result.values).toMatchObject({
      ville: "Casablanca",
      participants: "",
      preference: "E-mail",
      secteur: "Autre",
      equipements: ["Parking"],
    });
  });

  it("ignores values that are not strings", () => {
    const result = restore({ nom: 12, email: ["x"], sujets: null });
    expect(result.values).toEqual(EMPTY_VALUES);
  });

  it("preselects the offer from ?formule= and opens step 2 when there is no saved step", () => {
    const result = restore(null, "?formule=partenaire");
    expect(result.values.formule).toBe("partenaire");
    expect(result.step).toBe(2);
  });

  it("lets ?formule= win over the saved offer but keeps the saved step", () => {
    const result = restore(
      { formule: "communautaire", _step: 3 },
      "?formule=prive",
    );
    expect(result.values.formule).toBe("prive");
    expect(result.step).toBe(3);
  });

  it("drops the offer and stays on step 1 when ?formule= names no offer", () => {
    const result = restore({ formule: "communautaire" }, "?formule=nope");
    expect(result.values.formule).toBe("");
    expect(result.step).toBe(1);
  });

  it("ignores an empty ?formule=", () => {
    const result = restore({ formule: "communautaire" }, "?formule=");
    expect(result.values.formule).toBe("communautaire");
    expect(result.step).toBe(1);
  });
});

describe("draft storage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("writes, reads and clears under the old key", () => {
    expect(DRAFT_KEY).toBe("msc-host-draft-v1");
    expect(readDraft()).toBeNull();
    writeDraft({ nom: "Sara", _step: 2 });
    expect(JSON.parse(localStorage.getItem("msc-host-draft-v1")!)).toEqual({
      nom: "Sara",
      _step: 2,
    });
    expect(readDraft()).toEqual({ nom: "Sara", _step: 2 });
    clearDraft();
    expect(localStorage.getItem("msc-host-draft-v1")).toBeNull();
  });

  it("reads null when the stored text is not a JSON object", () => {
    localStorage.setItem(DRAFT_KEY, "{oops");
    expect(readDraft()).toBeNull();
    localStorage.setItem(DRAFT_KEY, '"text"');
    expect(readDraft()).toBeNull();
  });

  it("never throws when the storage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
      removeItem: () => {
        throw new Error("denied");
      },
    });
    expect(readDraft()).toBeNull();
    expect(() => writeDraft({ a: 1 })).not.toThrow();
    expect(() => clearDraft()).not.toThrow();
  });
});

describe("validateAll", () => {
  const MIN = "2026-11-08";

  it("is valid for a full form", () => {
    expect(validateAll(FULL, "2026-11-01")).toBeNull();
  });

  it("finds the first invalid step, with its errors and first field", () => {
    const result = validateAll(values({ ...FULL, formule: "" }), "2026-11-01");
    expect(result).toEqual({
      step: 1,
      errors: { formule: "Choisissez une formule pour continuer." },
      first: "formule",
    });
  });

  it("catches a stale draft on step 4 whose date is empty", () => {
    const stale = values({ ...FULL, date: "", date_alt: "" });
    const result = validateAll(stale, MIN);
    expect(result?.step).toBe(2);
    expect(result?.first).toBe("date");
    expect(result?.errors.date).toBe("Indiquez une date à venir.");
  });

  it("catches a stale draft whose date is now in the past", () => {
    expect(validateAll(FULL, MIN)?.step).toBe(2);
  });

  it("goes in step order: step 3 before step 4", () => {
    const result = validateAll(
      values({ ...FULL, date: "2026-11-14", entreprise: "", nom: "" }),
      MIN,
    );
    expect(result?.step).toBe(3);
    expect(result?.first).toBe("entreprise");
  });

  it("reaches step 4 when steps 1 to 3 are valid", () => {
    const result = validateAll(
      values({ ...FULL, date: "2026-11-14", consent: false }),
      MIN,
    );
    expect(result).toEqual({
      step: 4,
      errors: {
        consent: "Votre accord est nécessaire pour envoyer la demande.",
      },
      first: "consent",
    });
  });
});

describe("restoreDraft, tampered values", () => {
  const MIN = "2026-11-08";
  const restore = (draft: Record<string, unknown>) =>
    restoreDraft({ draft, search: "", offerIds: OFFER_IDS, min: MIN });

  it.each(["2026-13-45", "2027-02-30", "9999-99-99", "2026-11-8", "<b>x</b>"])(
    "drops the date %j",
    (date) => {
      const result = restore({ date, date_alt: date });
      expect(result.values.date).toBe("");
      expect(result.values.date_alt).toBe("");
    },
  );

  it("keeps a real future date", () => {
    expect(restore({ date: "2026-12-31" }).values.date).toBe("2026-12-31");
  });

  it.each(["abc", "<script>", "12.5", "-3", "12345", "6 0"])(
    "drops the capacity %j",
    (capacite) => {
      expect(restore({ capacite }).values.capacite).toBe("");
    },
  );

  it.each(["", "5", "60", "1000"])("keeps the capacity %j", (capacite) => {
    expect(restore({ capacite }).values.capacite).toBe(capacite);
  });
});
