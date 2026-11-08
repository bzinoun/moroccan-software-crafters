import { describe, expect, it } from "vitest";
import type {
  Company,
  Event,
  Home,
  Offer,
  Site,
  Sponsoring,
} from "@/content/types";
import {
  eventLinks,
  eventsByYear,
  featuredEvents,
  featuredMeta,
  filterEvents,
  formatSteps,
  galleryItems,
  heroCollage,
  heroNote,
  offerHref,
  offerPrice,
  socratesEditions,
  socratesPhoto,
  statItems,
  timelineMoreLabel,
  timelineWhere,
  topicsFromEvents,
  trustLogos,
} from "./home-data";

// Every test works on this small fixture, with expected values worked out by
// hand. Nothing here reads content/*.json.
const ev = (over: Partial<Event> & Pick<Event, "id" | "type">): Event => ({
  date: "2026-01-01",
  title: "T",
  city: "Casablanca",
  ...over,
});

// Newest first, as content/events.json is.
const events: Event[] = [
  ev({
    id: "meetup-2026-10",
    type: "meetup",
    date: "2026-10-24",
    title: "Meetup One",
    host: "Host One",
    registrations: 110,
    topics: ["AI", "Cloud"],
    photos: ["a1", "a2", "a3"],
    links: {
      linkedin: "https://example.org/li",
      luma: "https://example.org/lu",
    },
  }),
  ev({
    id: "meetup-2026-05",
    type: "meetup",
    date: "2026-05-09",
    host: "Host Two",
    venue: "Rue X",
    registrations: 51,
    topics: ["Data", "ai"],
    photos: ["b1"],
  }),
  ev({
    id: "socrates-2025",
    type: "socrates",
    date: "2025-09-04",
    city: "Bouznika",
    venue: "Hotel Mer",
    participants: 50,
    sponsors: ["Host One", "Host Two", "Host Three"],
    photos: ["s1"],
    links: { site: "https://example.org/socrates" },
  }),
  ev({
    id: "meetup-2025-07",
    type: "meetup",
    date: "2025-07-19",
    host: "Host Three",
    topics: ["Tests"],
  }),
  ev({
    id: "socrates-2024",
    type: "socrates",
    date: "2024-03-09",
    city: "Bouznika",
    participants: 45,
  }),
  ev({
    id: "socrates-2022",
    type: "socrates",
    date: "2022-03-11",
    city: "Marrakech",
    participants: 30,
  }),
  ev({ id: "online-2021", type: "online", date: "2021-04" }),
  ev({ id: "snack-2019-04", type: "codesnack", date: "2019-04-13" }),
  ev({ id: "snack-2019-03", type: "codesnack", date: "2019-03-16" }),
];

const byId = (id: string): Event => {
  const found = events.find((e) => e.id === id);
  if (!found) throw new Error(`no event ${id}`);
  return found;
};

// The functions read only a few fields of the home, the site and the sponsoring
// content: the fixtures set those fields and the cast fills in the rest.
const homeWith = (part: {
  hero?: Partial<Home["hero"]>;
  stats?: Home["stats"];
  format?: { steps: Home["format"]["steps"] };
  socrates?: { photo: string };
}): Home => part as Home;

describe("heroNote", () => {
  const home = homeWith({ hero: { note: "" } });

  it("describes the latest meetup when the home note is empty", () => {
    expect(heroNote(home, events)).toBe(
      "Dernière édition : 24 octobre 2026 chez Host One, 110 inscrits.",
    );
  });

  it("leaves out the registrations when the latest meetup has none", () => {
    const list = [
      ev({ id: "a", type: "meetup", date: "2024-06-29", host: "Host Two" }),
    ];
    expect(heroNote(home, list)).toBe(
      "Dernière édition : 29 juin 2024 chez Host Two.",
    );
  });

  it("leaves out the host when the latest meetup has none", () => {
    const list = [ev({ id: "a", type: "meetup", date: "2024-06-29" })];
    expect(heroNote(home, list)).toBe("Dernière édition : 29 juin 2024.");
  });

  it("skips events that are not meetups to find the latest one", () => {
    const list = [
      ev({ id: "s", type: "socrates", date: "2025-09-04" }),
      ev({
        id: "m",
        type: "meetup",
        date: "2025-07-19",
        host: "Host Three",
        registrations: 89,
      }),
    ];
    expect(heroNote(home, list)).toBe(
      "Dernière édition : 19 juillet 2025 chez Host Three, 89 inscrits.",
    );
  });

  it("uses the note of the home content when it is set", () => {
    const custom = homeWith({ hero: { note: "Rendez-vous en 2027." } });
    expect(heroNote(custom, events)).toBe("Rendez-vous en 2027.");
  });

  it("returns an empty text when there is no meetup and no note", () => {
    expect(heroNote(home, [])).toBe("");
  });
});

describe("heroCollage", () => {
  it("builds the photo URLs and keeps the captions in order", () => {
    const home = homeWith({
      hero: {
        collage: [
          { photo: "first", caption: "Premier" },
          { photo: "second", caption: "Second" },
        ],
      },
    });
    expect(heroCollage(home)).toEqual([
      { src: "/assets/img/meetups/first.jpg", caption: "Premier" },
      { src: "/assets/img/meetups/second.jpg", caption: "Second" },
    ]);
  });
});

describe("statItems", () => {
  const site = { since: 2019, linkedinFollowers: 3666 } as Site;

  it("pairs each stat definition with its computed value", () => {
    const home = homeWith({
      stats: [
        { key: "events", label: "A" },
        { key: "hosts", label: "B" },
        { key: "avgRegistrations", label: "C" },
        { key: "followers", label: "D" },
        { key: "socrates", label: "E" },
      ],
    });
    // 9 events; 3 hosts; (110 + 51) / 2 = 80.5 rounds to 81; 3 666; 3 editions.
    expect(statItems(home, site, events)).toEqual([
      { value: "9", label: "A" },
      { value: "3", label: "B" },
      { value: "~81", label: "C" },
      { value: "3\u202f666", label: "D" },
      { value: "3", label: "E" },
    ]);
  });

  it("lets a fixed value override the computed figure", () => {
    const home = homeWith({
      stats: [{ key: "events", value: "20+", label: "x" }],
    });
    expect(statItems(home, site, events)).toEqual([
      { value: "20+", label: "x" },
    ]);
  });

  it("gives an empty value to a stat without key and value", () => {
    const home = homeWith({ stats: [{ label: "x" }] });
    expect(statItems(home, site, events)).toEqual([{ value: "", label: "x" }]);
  });
});

describe("formatSteps", () => {
  it("adds the photo URL of a step that has a photo", () => {
    const home = homeWith({
      format: {
        steps: [{ time: "9 h", title: "Accueil", text: "Café", photo: "cafe" }],
      },
    });
    expect(formatSteps(home)).toEqual([
      {
        time: "9 h",
        title: "Accueil",
        text: "Café",
        photoSrc: "/assets/img/meetups/cafe.jpg",
      },
    ]);
  });

  it("gives a null photo URL to a step without a photo", () => {
    const home = homeWith({
      format: { steps: [{ time: "1", title: "t", text: "x" }] },
    });
    expect(formatSteps(home)[0]?.photoSrc).toBeNull();
  });
});

describe("topicsFromEvents", () => {
  const manyTopics = [
    ev({
      id: "big",
      type: "meetup",
      topics: Array.from({ length: 12 }, (_, i) => `T${i + 1}`),
    }),
  ];

  it("lists the newest topics first, once each, with the year and a tone", () => {
    // "ai" of the second meetup repeats "AI" of the first, so it is dropped.
    expect(topicsFromEvents(events, 10)).toEqual([
      { topic: "AI", year: "2026", tone: "default" },
      { topic: "Cloud", year: "2026", tone: "pink" },
      { topic: "Data", year: "2026", tone: "green" },
      { topic: "Tests", year: "2025", tone: "blue" },
    ]);
  });

  it("keeps only the first topics when the limit is smaller", () => {
    expect(topicsFromEvents(events, 2).map((t) => t.topic)).toEqual([
      "AI",
      "Cloud",
    ]);
  });

  it("cycles the five tones in order", () => {
    const tones = topicsFromEvents(manyTopics, 12).map((t) => t.tone);
    expect(tones).toEqual([
      "default",
      "pink",
      "green",
      "blue",
      "orange",
      "default",
      "pink",
      "green",
      "blue",
      "orange",
      "default",
      "pink",
    ]);
  });

  it("treats topics that differ only by case as one, and keeps the first spelling", () => {
    const list = [
      ev({
        id: "a",
        type: "meetup",
        date: "2026-05-01",
        topics: ["Tests", "Cloud"],
      }),
      ev({
        id: "b",
        type: "meetup",
        date: "2024-05-01",
        topics: ["tests", "SQL"],
      }),
    ];
    expect(topicsFromEvents(list, 10).map((t) => [t.topic, t.year])).toEqual([
      ["Tests", "2026"],
      ["Cloud", "2026"],
      ["SQL", "2024"],
    ]);
  });

  it("falls back to 10 topics when the limit is 0", () => {
    expect(topicsFromEvents(manyTopics, 0)).toHaveLength(10);
  });

  it("uses 10 topics when the limit is not given", () => {
    expect(topicsFromEvents(manyTopics)).toHaveLength(10);
  });

  it("returns no topic for events without topics", () => {
    expect(topicsFromEvents([ev({ id: "a", type: "meetup" })])).toEqual([]);
  });
});

describe("featuredEvents", () => {
  it("returns the meetups that have photos, in order", () => {
    expect(featuredEvents(events).map((e) => e.id)).toEqual([
      "meetup-2026-10",
      "meetup-2026-05",
    ]);
  });

  it("keeps only the first three meetups that have photos", () => {
    const list = ["a", "b", "c", "d"].map((id) =>
      ev({ id, type: "meetup", photos: [`${id}1`] }),
    );
    expect(featuredEvents(list).map((e) => e.id)).toEqual(["a", "b", "c"]);
  });

  it("skips a SoCraTes edition that has photos and a meetup with an empty photo list", () => {
    const list = [
      ev({ id: "s", type: "socrates", photos: ["s1"] }),
      ev({ id: "empty", type: "meetup", photos: [] }),
      ev({ id: "ok", type: "meetup", photos: ["o1"] }),
    ];
    expect(featuredEvents(list).map((e) => e.id)).toEqual(["ok"]);
  });
});

describe("featuredMeta", () => {
  it("joins the date, the city and the registrations", () => {
    expect(featuredMeta(byId("meetup-2026-10"))).toBe(
      "24 oct. 2026 · Casablanca · 110 inscrits",
    );
  });

  it("leaves out the registrations when there are none", () => {
    expect(featuredMeta(byId("meetup-2025-07"))).toBe(
      "19 juil. 2025 · Casablanca",
    );
  });
});

describe("eventLinks", () => {
  it("lists the LinkedIn recap then the Luma page", () => {
    expect(eventLinks(byId("meetup-2026-10"))).toEqual([
      { label: "Récap LinkedIn", href: "https://example.org/li" },
      { label: "Page Luma", href: "https://example.org/lu" },
    ]);
  });

  it("lists the SoCraTes site", () => {
    expect(eventLinks(byId("socrates-2025"))).toEqual([
      { label: "Site SoCraTes", href: "https://example.org/socrates" },
    ]);
  });

  it("keeps the order LinkedIn, Luma, site when an event has all three", () => {
    const all = ev({
      id: "x",
      type: "meetup",
      links: { site: "https://s", luma: "https://l", linkedin: "https://i" },
    });
    expect(eventLinks(all).map((l) => l.href)).toEqual([
      "https://i",
      "https://l",
      "https://s",
    ]);
  });

  it("returns an empty list for an event without links", () => {
    expect(eventLinks(byId("meetup-2025-07"))).toEqual([]);
  });
});

describe("timelineWhere", () => {
  it("shows the place and the registrations of a meetup", () => {
    expect(timelineWhere(byId("meetup-2026-10"))).toBe(
      "Casablanca · 110 inscrits",
    );
    expect(timelineWhere(byId("meetup-2026-05"))).toBe(
      "Rue X, Casablanca · 51 inscrits",
    );
  });

  it("shows the participants and the sponsor count of a SoCraTes edition", () => {
    expect(timelineWhere(byId("socrates-2025"))).toBe(
      "Hotel Mer, Bouznika · 50 participants · 3 partenaires",
    );
  });

  it("shows the place alone when there is nothing more", () => {
    expect(timelineWhere(byId("meetup-2025-07"))).toBe("Casablanca");
  });
});

describe("filterEvents", () => {
  const ids = (list: Event[]) => list.map((e) => e.id);

  it("keeps everything for the all filter", () => {
    expect(filterEvents(events, "all")).toEqual(events);
  });

  it("keeps the events of one type, in order", () => {
    expect(ids(filterEvents(events, "meetup"))).toEqual([
      "meetup-2026-10",
      "meetup-2026-05",
      "meetup-2025-07",
    ]);
    expect(ids(filterEvents(events, "socrates"))).toEqual([
      "socrates-2025",
      "socrates-2024",
      "socrates-2022",
    ]);
    expect(ids(filterEvents(events, "codesnack"))).toEqual([
      "snack-2019-04",
      "snack-2019-03",
    ]);
    expect(ids(filterEvents(events, "online"))).toEqual(["online-2021"]);
  });

  it("returns nothing for a filter that matches no type", () => {
    expect(filterEvents(events, "party")).toEqual([]);
  });
});

describe("eventsByYear", () => {
  const shape = (groups: ReturnType<typeof eventsByYear>) =>
    groups.map((g) => [g.year, g.items.map((e) => e.id)]);

  it("groups the first events by year, newest year first, within the limit", () => {
    expect(shape(eventsByYear(events, "all", 4))).toEqual([
      ["2026", ["meetup-2026-10", "meetup-2026-05"]],
      ["2025", ["socrates-2025", "meetup-2025-07"]],
    ]);
  });

  it("applies the filter before the limit", () => {
    expect(shape(eventsByYear(events, "socrates", 2))).toEqual([
      ["2025", ["socrates-2025"]],
      ["2024", ["socrates-2024"]],
    ]);
    expect(shape(eventsByYear(events, "codesnack"))).toEqual([
      ["2019", ["snack-2019-04", "snack-2019-03"]],
    ]);
  });

  it("returns every event when no limit is given", () => {
    const groups = eventsByYear(events, "all");
    expect(groups.map((g) => [g.year, g.items.length])).toEqual([
      ["2026", 2],
      ["2025", 2],
      ["2024", 1],
      ["2022", 1],
      ["2021", 1],
      ["2019", 2],
    ]);
  });

  it("gathers a repeated year into one group when the input is unsorted", () => {
    const unsorted = [
      byId("socrates-2025"),
      byId("meetup-2026-10"),
      byId("meetup-2025-07"),
    ];
    const groups = eventsByYear(unsorted, "all");
    expect(shape(groups)).toEqual([
      ["2025", ["socrates-2025", "meetup-2025-07"]],
      ["2026", ["meetup-2026-10"]],
    ]);
  });

  it("returns no group for an empty list", () => {
    expect(eventsByYear([], "all")).toEqual([]);
  });
});

describe("timelineMoreLabel", () => {
  it("puts the number of events in the {n} placeholder", () => {
    expect(timelineMoreLabel("Voir les {n} événements", 21)).toBe(
      "Voir les 21 événements",
    );
    expect(timelineMoreLabel("Voir les {n} événements", 14)).toBe(
      "Voir les 14 événements",
    );
  });

  it("leaves a template without placeholder as it is", () => {
    expect(timelineMoreLabel("Tout voir", 3)).toBe("Tout voir");
  });
});

describe("galleryItems", () => {
  it("lists every photo of every event, in the order of the events", () => {
    const items = galleryItems(events);
    expect(items.map((i) => [i.eventId, i.photo])).toEqual([
      ["meetup-2026-10", "a1"],
      ["meetup-2026-10", "a2"],
      ["meetup-2026-10", "a3"],
      ["meetup-2026-05", "b1"],
      ["socrates-2025", "s1"],
    ]);
  });

  it("gives each photo its URL and the title and date of its event", () => {
    expect(galleryItems(events)[0]).toEqual({
      photo: "a1",
      src: "/assets/img/meetups/a1.jpg",
      caption: "Meetup One · 24 oct. 2026",
      eventId: "meetup-2026-10",
    });
  });
});

describe("socratesEditions", () => {
  it("lists the editions oldest first with the ordinal and the crafters", () => {
    expect(socratesEditions(events)).toEqual([
      {
        id: "socrates-2022",
        title: "2022 · Marrakech",
        detail: "1re édition · 30 crafters",
      },
      {
        id: "socrates-2024",
        title: "2024 · Bouznika",
        detail: "2e édition · 45 crafters",
      },
      {
        id: "socrates-2025",
        title: "2025 · Bouznika",
        detail: "3e édition · 50 crafters",
      },
    ]);
  });

  it("does not reorder the list it receives", () => {
    const before = events.map((e) => e.id);
    socratesEditions(events);
    expect(events.map((e) => e.id)).toEqual(before);
  });

  it("leaves out the crafters when the edition has no participant count", () => {
    const list = [ev({ id: "s", type: "socrates", date: "2026-03-01" })];
    expect(socratesEditions(list)[0]?.detail).toBe("1re édition");
  });

  it("falls back to a numeric ordinal after the sixth edition", () => {
    const list = Array.from({ length: 7 }, (_, i) =>
      ev({ id: `s${i}`, type: "socrates", date: `20${30 - i}-01-01` }),
    );
    expect(socratesEditions(list)[6]?.detail).toBe("7e édition");
  });
});

describe("socratesPhoto", () => {
  it("builds the URL of the photo named in the home content", () => {
    const home = homeWith({ socrates: { photo: "group-photo" } });
    expect(socratesPhoto(home)).toBe("/assets/img/meetups/group-photo.jpg");
  });
});

describe("trustLogos", () => {
  const companies: Company[] = [
    {
      id: "alpha",
      name: "Alpha SA",
      display: "Alpha Group",
      logo: "alpha.png",
      linkedin: "",
    },
    { id: "beta", name: "beta corp", display: "", logo: "", linkedin: "" },
  ];
  const sponsoringWith = (ids: string[]): Sponsoring =>
    ({ trust: { title: "t", ids } }) as Sponsoring;

  it("resolves the trust ids to companies, in the order of the ids", () => {
    expect(trustLogos(sponsoringWith(["beta", "alpha"]), companies)).toEqual([
      { id: "beta", name: "beta corp", logoSrc: null, monogram: "BE" },
      {
        id: "alpha",
        name: "Alpha Group",
        logoSrc: "/assets/img/logos/alpha.png",
        monogram: "AL",
      },
    ]);
  });

  it("skips an id that matches no company", () => {
    expect(
      trustLogos(sponsoringWith(["nope", "alpha"]), companies).map((l) => l.id),
    ).toEqual(["alpha"]);
  });
});

describe("offerPrice and offerHref", () => {
  it("returns the price of an offer", () => {
    expect(offerPrice({ price: "Gratuit" })).toBe("Gratuit");
    expect(offerPrice({ price: "À partir de 5 000 MAD" })).toBe(
      "À partir de 5 000 MAD",
    );
  });

  it("returns Sur devis when the offer has no price", () => {
    expect(offerPrice({ price: undefined })).toBe("Sur devis");
    expect(offerPrice({ price: "" })).toBe("Sur devis");
  });

  it("links to the host funnel with the offer id", () => {
    expect(offerHref({ id: "partner" })).toBe("/accueillir/?formule=partner");
  });

  it("encodes an offer id that has special characters", () => {
    const offer: Pick<Offer, "id"> = { id: "a b&c" };
    expect(offerHref(offer)).toBe("/accueillir/?formule=a%20b%26c");
  });
});
