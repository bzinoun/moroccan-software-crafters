import { describe, expect, it } from "vitest";
import {
  CONSENT_ERROR,
  isValidEmail,
  normalizePhone,
  validPhone,
  validateContact,
  withoutError,
} from "./validation";

describe("isValidEmail", () => {
  it.each(["sara@acme.ma", "a.b+tag@sub.example.com", "x@y.co"])(
    "accepts %s",
    (input) => {
      expect(isValidEmail(input)).toBe(true);
    },
  );

  it.each(["", "sara", "sara@acme", "sara@acme.m", "sa ra@acme.ma", "@a.ma"])(
    "rejects %j",
    (input) => {
      expect(isValidEmail(input)).toBe(false);
    },
  );

  it("does not trim: the caller trims", () => {
    expect(isValidEmail(" sara@acme.ma")).toBe(false);
  });
});

describe("phone", () => {
  it("removes spaces, dots, dashes and brackets", () => {
    expect(normalizePhone("06.12-34 56(78)")).toBe("0612345678");
  });

  it.each(["06 12 34 56 78", "07 12345678", "05.12.34.56.78"])(
    "accepts the Moroccan number %s",
    (input) => {
      expect(validPhone(input)).toBe(true);
    },
  );

  it.each(["+212 6 12 34 56 78", "00212612345678"])(
    "accepts the international number %s",
    (input) => {
      expect(validPhone(input)).toBe(true);
    },
  );

  it.each(["", "0612", "04 12 34 56 78", "+21261", "abc"])(
    "rejects %j",
    (input) => {
      expect(validPhone(input)).toBe(false);
    },
  );
});

describe("withoutError", () => {
  it("drops the entry of the edited field and keeps the others", () => {
    const errors = { nom: "A", email: "B" };
    expect(withoutError(errors, "nom")).toEqual({ email: "B" });
    expect(errors).toEqual({ nom: "A", email: "B" });
  });

  it("gives back the same object when the field has no error", () => {
    const errors = { nom: "A" };
    expect(withoutError(errors, "email")).toBe(errors);
  });
});

describe("validateContact", () => {
  const VALID = {
    entreprise: "Acme",
    nom: "Sara Alaoui",
    email: "sara@acme.ma",
    telephone: "06 12 34 56 78",
  };

  it("accepts a full contact", () => {
    expect(validateContact(VALID)).toEqual({});
  });

  it("asks for each empty field, with the French messages of the forms", () => {
    expect(
      validateContact({ entreprise: "", nom: "", email: "", telephone: "" }),
    ).toEqual({
      entreprise: "Indiquez le nom de l'entreprise.",
      nom: "Indiquez votre nom.",
      email: "Adresse e-mail invalide.",
      telephone: "Indiquez votre numéro.",
    });
  });

  it("treats a value of spaces as empty", () => {
    expect(validateContact({ ...VALID, entreprise: "   ", nom: " " })).toEqual({
      entreprise: "Indiquez le nom de l'entreprise.",
      nom: "Indiquez votre nom.",
    });
  });

  it("trims the e-mail before it checks it", () => {
    expect(validateContact({ ...VALID, email: " sara@acme.ma " })).toEqual({});
  });

  it("gives the invalid-number message with an example for a wrong phone", () => {
    expect(validateContact({ ...VALID, telephone: "12345" })).toEqual({
      telephone: "Numéro invalide (ex. +212 6 12 34 56 78 ou 06 12 34 56 78).",
    });
  });

  it("checks only the fields it is asked for", () => {
    const empty = { entreprise: "", nom: "", email: "", telephone: "" };
    expect(validateContact(empty, ["nom"])).toEqual({
      nom: "Indiquez votre nom.",
    });
  });
});

describe("CONSENT_ERROR", () => {
  it("is the one consent message of both forms", () => {
    expect(CONSENT_ERROR).toBe(
      "Votre accord est nécessaire pour envoyer la demande.",
    );
  });
});
