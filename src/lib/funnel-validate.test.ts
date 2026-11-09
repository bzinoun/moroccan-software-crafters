import { describe, expect, it } from "vitest";
import { validateAll, validateStep } from "./funnel-validate";
import { FULL, values } from "./funnel-test-utils";

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
    const base = { participants: "20-40" } as const;
    expect(
      validateStep(2, values({ ...base, date: "2026-11-07" }), MIN).first,
    ).toBe("date");
    expect(
      validateStep(2, values({ ...base, date: "2026-11-08" }), MIN),
    ).toEqual({ errors: {}, first: null });
  });

  it("step 2 accepts an empty capacity and the limits 10 and 1000", () => {
    const base = { date: "2026-11-14", participants: "80+" } as const;
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

  it("step 2 rejects a capacity that is not one to four digits", () => {
    const base = { date: "2026-11-14", participants: "80+" } as const;
    for (const capacite of ["12.5", "10.0", "1e3", "-20", " 20", "00012"]) {
      expect(validateStep(2, values({ ...base, capacite }), MIN).first).toBe(
        "capacite",
      );
    }
  });

  it("step 2 checks the alternative day only when it is filled", () => {
    const base = {
      date: "2026-12-05",
      participants: "20-40",
    } as const;
    expect(validateStep(2, values({ ...base, date_alt: "" }), MIN).first).toBe(
      null,
    );
    expect(
      validateStep(2, values({ ...base, date_alt: "2026-11-08" }), MIN).first,
    ).toBe(null);
    for (const date_alt of ["2020-01-01", "2026-11-07", "2026-02-45"]) {
      expect(validateStep(2, values({ ...base, date_alt }), MIN)).toEqual({
        errors: { date_alt: "Indiquez une date à venir." },
        first: "date_alt",
      });
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
