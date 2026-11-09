import { describe, expect, it } from "vitest";
import type { Event, SocratesFile } from "@/content/types";
import { editionLabel, resolveSocrates } from "./socrates";

const ev = (e: Partial<Event> & Pick<Event, "id" | "date">): Event => ({
  type: "socrates",
  title: `Edition ${e.id}`,
  city: "Bouznika",
  ...e,
});

// Newest first, as in content/events.json. The meetup must not count.
const events: Event[] = [
  ev({
    id: "e3",
    date: "2024-09-12",
    endDate: "2024-09-15",
    venue: "Lieu trois",
    participants: 50,
    sponsors: ["A", "B", "C"],
  }),
  ev({
    id: "m1",
    date: "2023-11-04",
    type: "meetup",
    sponsors: ["Z"],
    participants: 99,
  }),
  ev({
    id: "e2",
    date: "2023-03-30",
    endDate: "2023-04-02",
    participants: 45,
    sponsors: ["A", "B"],
  }),
  ev({
    id: "e1",
    date: "2022-03-25",
    endDate: "2022-03-27",
    city: "Marrakech",
    venue: "Palais un",
    participants: 30,
    sponsors: ["A", "D"],
  }),
];

const file = (items: SocratesFile["editions"]["items"]): SocratesFile =>
  ({
    meta: { title: "t", description: "d" },
    hero: {
      facts: [
        { key: "editions", label: "éditions depuis 2022" },
        { value: "30 → 50", label: "participants" },
        { key: "partners", label: "entreprises partenaires" },
      ],
    },
    editions: { eyebrow: "e", title: "t", items },
  }) as SocratesFile;

describe("editionLabel", () => {
  it.each([
    [1, "1re édition"],
    [2, "2e édition"],
    [4, "4e édition"],
    [7, "7e édition"],
  ])("labels the edition number %i as %s", (rank, label) => {
    expect(editionLabel(rank)).toBe(label);
  });
});

describe("resolveSocrates", () => {
  it("takes city, venue, dates, participants and partners from the event", () => {
    const resolved = resolveSocrates(
      file([{ event: "e1", photo: "p1", text: "Texte un" }]),
      events,
    );
    expect(resolved.editions.items).toEqual([
      {
        year: "2022",
        edition: "1re édition",
        city: "Marrakech",
        venue: "Palais un",
        dates: "25 → 27 mars",
        participants: 30,
        partners: 2,
        photo: "p1",
        text: "Texte un",
      },
    ]);
  });

  it("writes both months of a range that crosses a month", () => {
    const [edition] = resolveSocrates(
      file([{ event: "e2", text: "t" }]),
      events,
    ).editions.items;
    expect(edition?.dates).toBe("30 mars → 2 avril");
    expect(edition?.venue).toBeUndefined();
    expect(edition?.photo).toBeUndefined();
  });

  it("numbers an edition by its place among all the SoCraTes events", () => {
    const [edition] = resolveSocrates(
      file([{ event: "e3", text: "t" }]),
      events,
    ).editions.items;
    expect(edition?.edition).toBe("3e édition");
  });

  it("lists the editions by year, whatever the order of the file", () => {
    const items = resolveSocrates(
      file([
        { event: "e3", text: "t" },
        { event: "e1", text: "t" },
        { event: "e2", text: "t" },
      ]),
      events,
    ).editions.items;
    expect(items.map((e) => e.year)).toEqual(["2022", "2023", "2024"]);
  });

  it("names the edition that links to no event", () => {
    expect(() =>
      resolveSocrates(file([{ event: "nope", text: "t" }]), events),
    ).toThrow(/nope/);
  });

  it("refuses an edition that links to an event that is not a SoCraTes", () => {
    expect(() =>
      resolveSocrates(file([{ event: "m1", text: "t" }]), events),
    ).toThrow(/m1/);
  });

  it("refuses an edition whose event has no participant count", () => {
    const bare = [ev({ id: "e9", date: "2027-09-01" })];
    expect(() =>
      resolveSocrates(file([{ event: "e9", text: "t" }]), bare),
    ).toThrow(/e9.*participants/);
  });

  it("counts the SoCraTes events and their distinct partners in the hero facts", () => {
    const { facts } = resolveSocrates(file([]), events).hero;
    expect(facts).toEqual([
      { value: "3", label: "éditions depuis 2022" },
      { value: "30 → 50", label: "participants" },
      // A, B, C and D: a company that sponsors twice counts once.
      { value: "4", label: "entreprises partenaires" },
    ]);
  });
});
