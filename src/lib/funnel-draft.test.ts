import { afterEach, describe, expect, it } from "vitest";
import {
  DRAFT_KEY,
  clearDraft,
  readDraft,
  restoreDraft,
  toDraft,
  writeDraft,
} from "./funnel-draft";
import { EMPTY_VALUES } from "./funnel-fields";
import { FULL, OFFER_IDS, values } from "./funnel-test-utils";
import { deniedStorage, inMemoryStorage } from "@/test/in-memory-storage";

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

// Saturday 7 November 2026, as the clock of the draft storage tests.
const NOW = new Date(2026, 10, 7, 10, 0);

describe("draft storage", () => {
  it("writes, reads and clears under its storage key", () => {
    const storage = inMemoryStorage();
    expect(DRAFT_KEY).toBe("msc-host-draft-v1");
    expect(readDraft(NOW, storage)).toBeNull();
    writeDraft({ nom: "Sara", _step: 2 }, NOW, storage);
    expect(JSON.parse(storage.getItem("msc-host-draft-v1")!)).toEqual({
      nom: "Sara",
      _step: 2,
      _savedAt: NOW.getTime(),
    });
    expect(readDraft(NOW, storage)).toMatchObject({ nom: "Sara", _step: 2 });
    clearDraft(storage);
    expect(storage.getItem("msc-host-draft-v1")).toBeNull();
  });

  describe("with the browser storage by default", () => {
    afterEach(() => localStorage.clear());

    it("keeps the draft in localStorage", () => {
      writeDraft({ nom: "Sara" }, NOW);
      expect(JSON.parse(localStorage.getItem(DRAFT_KEY)!)).toMatchObject({
        nom: "Sara",
      });
      expect(readDraft(NOW)).toMatchObject({ nom: "Sara" });
      clearDraft();
      expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    });
  });

  describe("expiry", () => {
    const DAY = 24 * 60 * 60 * 1000;
    const storeAt = (savedAt: unknown) => {
      const storage = inMemoryStorage({
        [DRAFT_KEY]: JSON.stringify({ nom: "Sara", _savedAt: savedAt }),
      });
      return storage;
    };

    it("keeps a draft saved 29 days ago", () => {
      const storage = storeAt(NOW.getTime() - 29 * DAY);
      expect(readDraft(NOW, storage)).toMatchObject({ nom: "Sara" });
      expect(storage.getItem(DRAFT_KEY)).not.toBeNull();
    });

    it("ignores and deletes a draft saved 31 days ago", () => {
      const storage = storeAt(NOW.getTime() - 31 * DAY);
      expect(readDraft(NOW, storage)).toBeNull();
      expect(storage.getItem(DRAFT_KEY)).toBeNull();
    });

    it("ignores and deletes a draft stamped in the future", () => {
      const storage = storeAt(NOW.getTime() + 10 * DAY);
      expect(readDraft(NOW, storage)).toBeNull();
      expect(storage.getItem(DRAFT_KEY)).toBeNull();
    });

    it.each([undefined, null, "yesterday", Number.NaN])(
      "ignores and deletes a draft whose timestamp is %j",
      (savedAt) => {
        const storage = storeAt(savedAt);
        expect(readDraft(NOW, storage)).toBeNull();
        expect(storage.getItem(DRAFT_KEY)).toBeNull();
      },
    );

    it("counts 30 days from the moment of the last write", () => {
      const storage = inMemoryStorage();
      writeDraft({ nom: "Sara" }, NOW, storage);
      expect(
        readDraft(new Date(NOW.getTime() + 29 * DAY), storage),
      ).not.toBeNull();
      writeDraft({ nom: "Sara" }, new Date(NOW.getTime() + 20 * DAY), storage);
      expect(
        readDraft(new Date(NOW.getTime() + 45 * DAY), storage),
      ).not.toBeNull();
      expect(readDraft(new Date(NOW.getTime() + 51 * DAY), storage)).toBeNull();
    });
  });

  it("reads null when the stored text is not a JSON object", () => {
    const storage = inMemoryStorage({ [DRAFT_KEY]: "{oops" });
    expect(readDraft(NOW, storage)).toBeNull();
    storage.setItem(DRAFT_KEY, '"text"');
    expect(readDraft(NOW, storage)).toBeNull();
  });

  it("never throws when the storage is unavailable", () => {
    const storage = deniedStorage();
    expect(readDraft(NOW, storage)).toBeNull();
    expect(() => writeDraft({ a: 1 }, NOW, storage)).not.toThrow();
    expect(() => clearDraft(storage)).not.toThrow();
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
