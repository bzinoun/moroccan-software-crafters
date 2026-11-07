import { describe, expect, it } from "vitest";
import {
  loadCompanies,
  loadEvents,
  loadHome,
  loadOffers,
  loadSite,
  loadSponsoring,
} from "@/content/load";
import type { Event } from "@/content/types";
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

const home = loadHome();
const site = loadSite();
const events = loadEvents();
const byId = (id: string): Event => {
  const found = events.find((e) => e.id === id);
  if (!found) throw new Error(`no event ${id}`);
  return found;
};
const ev = (over: Partial<Event> & Pick<Event, "id" | "type">): Event => ({
  date: "2026-01-01",
  title: "T",
  city: "Casablanca",
  ...over,
});

describe("heroNote", () => {
  it("describes the latest meetup when the home note is empty", () => {
    expect(heroNote(home, events)).toBe(
      "Dernière édition : 24 octobre 2026 chez Société Générale GSCM, 110 inscrits.",
    );
  });

  it("leaves out the registrations when the latest meetup has none", () => {
    const list = [
      ev({
        id: "a",
        type: "meetup",
        date: "2024-06-29",
        host: "Renault Digital Maroc",
      }),
    ];
    expect(heroNote(home, list)).toBe(
      "Dernière édition : 29 juin 2024 chez Renault Digital Maroc.",
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
        host: "Jobzyn",
        registrations: 89,
      }),
    ];
    expect(heroNote(home, list)).toBe(
      "Dernière édition : 19 juillet 2025 chez Jobzyn, 89 inscrits.",
    );
  });

  it("uses the note of the home content when it is set", () => {
    const custom = {
      ...home,
      hero: { ...home.hero, note: "Rendez-vous en 2027." },
    };
    expect(heroNote(custom, events)).toBe("Rendez-vous en 2027.");
  });

  it("returns an empty text when there is no meetup and no note", () => {
    expect(heroNote(home, [])).toBe("");
  });
});

describe("heroCollage", () => {
  it("builds the photo URLs and keeps the captions in order", () => {
    expect(heroCollage(home)).toEqual([
      {
        src: "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
        caption: "SG GSCM · oct. 2026",
      },
      {
        src: "/assets/img/meetups/2026-05-axa-1.jpg",
        caption: "AXA · mai 2026",
      },
      {
        src: "/assets/img/meetups/2026-03-innovx-2.jpg",
        caption: "InnovX · mars 2026",
      },
    ]);
  });
});

describe("statItems", () => {
  it("pairs each stat definition with its computed value", () => {
    expect(statItems(home, site, events)).toEqual([
      { value: "21", label: "événements depuis 2019" },
      { value: "12", label: "entreprises hôtes" },
      { value: "~105", label: "inscrits par meetup (2025-26)" },
      { value: "3 666", label: "abonnés LinkedIn" },
      { value: "4", label: "éditions de SoCraTes Maroc" },
    ]);
  });

  it("lets a fixed value override the computed figure", () => {
    const custom = {
      ...home,
      stats: [{ key: "events" as const, value: "20+", label: "x" }],
    };
    expect(statItems(custom, site, events)).toEqual([
      { value: "20+", label: "x" },
    ]);
  });

  it("gives an empty value to a stat without key and value", () => {
    const custom = { ...home, stats: [{ label: "x" }] };
    expect(statItems(custom, site, events)).toEqual([
      { value: "", label: "x" },
    ]);
  });
});

describe("formatSteps", () => {
  it("adds the photo URL of each step, or null without a photo", () => {
    const steps = formatSteps(home);
    expect(steps).toHaveLength(4);
    expect(steps[0]).toEqual({
      time: "9 h 30",
      title: "Networking",
      text: "Café, présentations, et on fait connaissance avec l'équipe qui nous accueille.",
      photoSrc: "/assets/img/meetups/2026-10-sg-gscm-7.jpg",
    });
    const noPhoto = {
      ...home,
      format: { ...home.format, steps: [{ time: "1", title: "t", text: "x" }] },
    };
    expect(formatSteps(noPhoto)[0]?.photoSrc).toBeNull();
  });
});

describe("topicsFromEvents", () => {
  it("lists the newest topics first, once each, with the year and a tone", () => {
    expect(topicsFromEvents(events, 10)).toEqual([
      { topic: "AI factory", year: "2026", tone: "default" },
      { topic: "Responsabilité humaine", year: "2026", tone: "pink" },
      { topic: "Sécurité du vibe coding", year: "2026", tone: "green" },
      { topic: "Outils IA", year: "2026", tone: "blue" },
      { topic: "Coût des tokens", year: "2026", tone: "orange" },
      { topic: "Craftsmanship à l'ère de l'IA", year: "2026", tone: "default" },
      { topic: "Cloud", year: "2026", tone: "pink" },
      { topic: "Data", year: "2026", tone: "green" },
      { topic: "Sécurité", year: "2026", tone: "blue" },
      { topic: "Modèle maison vs sur étagère", year: "2026", tone: "orange" },
    ]);
  });

  it("goes past the first event when the limit is larger", () => {
    const topics = topicsFromEvents(events, 12);
    expect(topics.slice(10)).toEqual([
      { topic: "Impact réel de l'IA", year: "2026", tone: "default" },
      { topic: "Management", year: "2026", tone: "pink" },
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
    expect(topicsFromEvents(events, 0)).toHaveLength(10);
  });

  it("uses 10 topics when the limit is not given", () => {
    expect(topicsFromEvents(events)).toHaveLength(10);
  });
});

describe("featuredEvents", () => {
  it("returns the first three meetups that have photos", () => {
    expect(featuredEvents(events).map((e) => e.id)).toEqual([
      "2026-10-sg-gscm",
      "2026-05-axa",
      "2026-03-innovx",
    ]);
  });

  it("skips a SoCraTes edition that has photos", () => {
    expect(byId("2022-03-socrates").photos).toHaveLength(2);
    expect(featuredEvents(events).some((e) => e.type === "socrates")).toBe(
      false,
    );
  });
});

describe("featuredMeta", () => {
  it("joins the date, the city and the registrations", () => {
    expect(featuredMeta(byId("2026-10-sg-gscm"))).toBe(
      "24 oct. 2026 · Casablanca · 110 inscrits",
    );
  });

  it("leaves out the registrations when there are none", () => {
    expect(featuredMeta(byId("2024-06-renault"))).toBe(
      "29 juin 2024 · Casablanca",
    );
  });
});

describe("eventLinks", () => {
  it("lists the LinkedIn recap, the Luma page and the SoCraTes site in that order", () => {
    expect(eventLinks(byId("2026-10-sg-gscm"))).toEqual([
      {
        label: "Récap LinkedIn",
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7517872453725888512/",
      },
      { label: "Page Luma", href: "https://luma.com/6eiyisjw" },
    ]);
    expect(eventLinks(byId("2025-09-socrates"))).toEqual([
      { label: "Site SoCraTes", href: "https://socrates-ma.github.io/" },
    ]);
  });

  it("returns an empty list for an event without links", () => {
    expect(eventLinks(byId("2024-06-renault"))).toEqual([]);
  });
});

describe("timelineWhere", () => {
  it("shows the place and the registrations of a meetup", () => {
    expect(timelineWhere(byId("2026-10-sg-gscm"))).toBe(
      "Casablanca · 110 inscrits",
    );
    expect(timelineWhere(byId("2026-05-axa"))).toBe(
      "Avenue Hassan II, Casablanca · 51 inscrits",
    );
  });

  it("shows the participants and the sponsor count of a SoCraTes edition", () => {
    expect(timelineWhere(byId("2022-03-socrates"))).toBe(
      "Palais Ronsard, Marrakech · 30 participants · 7 partenaires",
    );
  });

  it("shows the place alone when there is nothing more", () => {
    expect(timelineWhere(byId("2023-07-maltem"))).toBe("Casablanca");
  });
});

describe("filterEvents", () => {
  it("keeps everything for the all filter", () => {
    expect(filterEvents(events, "all")).toHaveLength(21);
  });

  it("keeps the events of one type", () => {
    expect(filterEvents(events, "meetup")).toHaveLength(14);
    expect(filterEvents(events, "socrates")).toHaveLength(4);
    expect(filterEvents(events, "codesnack")).toHaveLength(2);
    expect(filterEvents(events, "online")).toHaveLength(1);
  });
});

describe("eventsByYear", () => {
  const shape = (groups: ReturnType<typeof eventsByYear>) =>
    groups.map((g) => [g.year, g.items.map((e) => e.id)]);

  it("groups the first events by year, newest year first, within the limit", () => {
    expect(shape(eventsByYear(events, "all", 6))).toEqual([
      ["2026", ["2026-10-sg-gscm", "2026-05-axa", "2026-03-innovx"]],
      ["2025", ["2025-09-socrates", "2025-07-jobzyn", "2025-01-oracle"]],
    ]);
  });

  it("applies the filter before the limit", () => {
    expect(shape(eventsByYear(events, "socrates"))).toEqual([
      ["2025", ["2025-09-socrates"]],
      ["2024", ["2024-09-socrates"]],
      ["2023", ["2023-03-socrates"]],
      ["2022", ["2022-03-socrates"]],
    ]);
    expect(shape(eventsByYear(events, "codesnack"))).toEqual([
      ["2019", ["2019-04-codesnack-2", "2019-03-codesnack-1"]],
    ]);
  });

  it("returns every event when no limit is given", () => {
    const groups = eventsByYear(events, "all");
    expect(groups.map((g) => [g.year, g.items.length])).toEqual([
      ["2026", 3],
      ["2025", 3],
      ["2024", 3],
      ["2023", 5],
      ["2022", 3],
      ["2021", 1],
      ["2019", 3],
    ]);
  });

  it("gathers a repeated year into one group when the input is unsorted", () => {
    const unsorted = [
      byId("2025-09-socrates"),
      byId("2026-10-sg-gscm"),
      byId("2025-07-jobzyn"),
    ];
    const groups = eventsByYear(unsorted, "all");
    expect(shape(groups)).toEqual([
      ["2025", ["2025-09-socrates", "2025-07-jobzyn"]],
      ["2026", ["2026-10-sg-gscm"]],
    ]);
    expect(new Set(groups.map((g) => g.year)).size).toBe(groups.length);
  });
});

describe("timelineMoreLabel", () => {
  it("puts the number of events in the {n} placeholder", () => {
    expect(timelineMoreLabel(home.history.more, 21)).toBe(
      "Voir les 21 événements",
    );
    expect(timelineMoreLabel(home.history.more, 14)).toBe(
      "Voir les 14 événements",
    );
  });
});

describe("galleryItems", () => {
  it("lists every photo of every event, newest event first", () => {
    const items = galleryItems(events);
    expect(items).toHaveLength(17);
    expect(items[0]).toEqual({
      photo: "2026-10-sg-gscm-5",
      src: "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
      caption: "Meetup @ Société Générale GSCM · 24 oct. 2026",
      eventId: "2026-10-sg-gscm",
    });
    expect(items[8]?.photo).toBe("2026-05-axa-1");
    expect(items[15]).toMatchObject({
      photo: "2022-03-socrates-groupe",
      eventId: "2022-03-socrates",
    });
    expect(items[16]?.photo).toBe("2022-03-socrates-open-space");
  });
});

describe("socratesEditions", () => {
  it("lists the editions oldest first with the ordinal and the crafters", () => {
    expect(socratesEditions(events)).toEqual([
      {
        id: "2022-03-socrates",
        title: "2022 · Marrakech",
        detail: "1re édition · 30 crafters",
      },
      {
        id: "2023-03-socrates",
        title: "2023 · Bouznika",
        detail: "2e édition · 45 crafters",
      },
      {
        id: "2024-09-socrates",
        title: "2024 · Bouznika",
        detail: "3e édition · 50 crafters",
      },
      {
        id: "2025-09-socrates",
        title: "2025 · Bouznika",
        detail: "4e édition · 50 crafters",
      },
    ]);
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
    expect(socratesPhoto(home)).toBe(
      "/assets/img/meetups/2022-03-socrates-groupe.jpg",
    );
  });
});

describe("trustLogos", () => {
  it("resolves the trust ids to companies, in the order of the ids", () => {
    const logos = trustLogos(loadSponsoring(), loadCompanies().items);
    expect(logos).toEqual([
      {
        id: "mckinsey",
        name: "McKinsey & Company",
        logoSrc: "/assets/img/logos/mckinsey.png",
        monogram: "MC",
      },
      {
        id: "maltem",
        name: "Maltem Africa",
        logoSrc: "/assets/img/logos/maltem.png",
        monogram: "MA",
      },
      {
        id: "inwi",
        name: "inwi",
        logoSrc: "/assets/img/logos/inwi.png",
        monogram: "IN",
      },
      {
        id: "keiken",
        name: "Keiken digital solutions",
        logoSrc: "/assets/img/logos/keiken.png",
        monogram: "KE",
      },
      {
        id: "gemography",
        name: "Gemography",
        logoSrc: "/assets/img/logos/gemography.png",
        monogram: "GE",
      },
    ]);
  });

  it("skips an id that matches no company", () => {
    const sponsoring = {
      ...loadSponsoring(),
      trust: { title: "t", ids: ["nope", "axa"] },
    };
    expect(
      trustLogos(sponsoring, loadCompanies().items).map((l) => l.id),
    ).toEqual(["axa"]);
  });
});

describe("offerPrice and offerHref", () => {
  const offers = loadOffers().items;

  it("returns the price of an offer", () => {
    expect(offerPrice(offers[0]!)).toBe("Gratuit");
    expect(offerPrice(offers[1]!)).toBe("À partir de 12 000 MAD");
  });

  it("returns Sur devis when the offer has no price", () => {
    expect(offerPrice({ ...offers[0]!, price: undefined })).toBe("Sur devis");
    expect(offerPrice({ ...offers[0]!, price: "" })).toBe("Sur devis");
  });

  it("links to the host funnel with the offer id", () => {
    expect(offerHref(offers[1]!)).toBe("/accueillir/?formule=partenaire");
    expect(offerHref(offers[2]!)).toBe("/accueillir/?formule=prive");
  });
});
