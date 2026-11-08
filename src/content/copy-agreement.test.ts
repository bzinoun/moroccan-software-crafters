import { describe, expect, it } from "vitest";
import {
  loadAssociation,
  loadCompanies,
  loadEvents,
  loadMeetup,
  loadSite,
  loadSponsoring,
} from "./load";
import socratesFile from "../../content/socrates.json";
import { stats } from "@/lib/derive";

/** Every string of a content tree, in document order. */
function strings(node: unknown): string[] {
  if (typeof node === "string") return [node];
  if (Array.isArray(node)) return node.flatMap(strings);
  if (typeof node !== "object" || node === null) return [];
  return Object.values(node).flatMap(strings);
}

const NUMBER_WORDS: Record<number, string> = {
  7: "sept",
  8: "huit",
  12: "douze",
  13: "treize",
};

describe("hand-written copy agrees with the data", () => {
  it("names the partner count of SoCraTes 2022 as events.json lists it", () => {
    const event = loadEvents().find((e) => e.id === "2022-03-socrates");
    const word = NUMBER_WORDS[event?.sponsors?.length ?? 0];
    const line = strings(loadAssociation()).find((s) =>
      s.startsWith("Première édition à Marrakech"),
    );
    expect(word).toBeDefined();
    expect(line).toContain(`${word} partenaires`);
  });

  it("names the host company count as the page hero derives it", () => {
    const hosts = stats(loadSite(), loadEvents()).hosts;
    const line = strings(loadAssociation()).find((s) =>
      s.includes("ouvre ses portes"),
    );
    expect(line).toMatch(
      new RegExp(`\\b${NUMBER_WORDS[hosts]} l'ont fait depuis 2019`, "i"),
    );
  });

  it("counts four days for SoCraTes in the sponsor sticker", () => {
    const sticker = loadCompanies().sticker.sponsor.text;
    expect(sticker).not.toMatch(/trois jours/);
    expect(sticker).toMatch(/quatre jours/);
  });

  it("gives an edition card no photo that belongs to another edition", () => {
    const events = loadEvents();
    for (const item of socratesFile.editions.items) {
      const photo = (item as { photo?: string }).photo;
      if (!photo) continue;
      const owners = events.filter((e) => e.photos?.includes(photo));
      expect(owners.map((e) => e.id)).toEqual([item.event]);
    }
  });

  it("states the meetup length as the 9 h 30 to 14 h schedule gives it", () => {
    const meetup = loadMeetup();
    for (const text of [meetup.meta.description, meetup.hero.title]) {
      expect(text).not.toMatch(/quatre heures(?! et demie)/);
    }
  });

  it("writes the sponsor form success message without an exclamation mark", () => {
    expect(loadSponsoring().form.success).not.toContain("!");
  });
});
