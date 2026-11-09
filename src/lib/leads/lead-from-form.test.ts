import { describe, expect, it } from "vitest";
import { leadPayloadFromForm } from "./lead-from-form";

const OFFERS = [
  { id: "partenaire", name: "Meetup partenaire" },
  { id: "hote", name: "Hôte communautaire" },
];

function form(entries: [string, string][]): FormData {
  const data = new FormData();
  for (const [name, value] of entries) data.append(name, value);
  return data;
}

describe("leadPayloadFromForm", () => {
  it("rebuilds the host funnel payload the JavaScript path sends", () => {
    const payload = leadPayloadFromForm(
      form([
        ["_type", "host"],
        ["_source", "https://example.org/accueillir/"],
        ["formule", "partenaire"],
        ["date", "2026-12-05"],
        ["equipements", "Écran"],
        ["equipements", "Micro"],
        ["entreprise", " Acme "],
        ["nom", "Sara"],
        ["email", "sara@acme.ma"],
        ["telephone", "06 12 34 56 78"],
        ["consent", "on"],
      ]),
      { offers: OFFERS },
    );
    expect(payload).toMatchObject({
      type: "Hébergement meetup",
      source: "https://example.org/accueillir/",
      formule: "Meetup partenaire",
      date: "2026-12-05",
      equipements: "Écran, Micro",
      entreprise: " Acme ",
      nom: "Sara",
      email: "sara@acme.ma",
      telephone: "0612345678",
    });
  });

  it("maps the sponsor form to its type and keeps the level", () => {
    const payload = leadPayloadFromForm(
      form([
        ["_type", "sponsor"],
        ["niveau", "Partenaire"],
        ["entreprise", "Globex"],
      ]),
      { offers: OFFERS },
    );
    expect(payload).toMatchObject({
      type: "Sponsoring SoCraTes",
      niveau: "Partenaire",
      entreprise: "Globex",
    });
  });

  it("keeps an unknown offer id as it is and leaves out the control fields", () => {
    const payload = leadPayloadFromForm(
      form([
        ["_type", "host"],
        ["formule", "inconnue"],
        ["consent", "on"],
        ["website_hp", ""],
      ]),
      { offers: OFFERS },
    );
    expect(payload.formule).toBe("inconnue");
    expect(payload).not.toHaveProperty("_type");
    expect(payload).not.toHaveProperty("consent");
    expect(payload).not.toHaveProperty("website_hp");
  });

  it("gives an unknown form type that validation then refuses", () => {
    const payload = leadPayloadFromForm(form([["_type", "autre"]]), {
      offers: OFFERS,
    });
    expect(payload.type).toBe("");
  });
});
