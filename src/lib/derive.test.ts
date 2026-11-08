import { afterEach, describe, expect, it, vi } from "vitest";
import type { Company, Event } from "@/content/types";
import {
  absoluteImageUrl,
  absoluteMeetupPhoto,
  companyStats,
  fmtDate,
  fmtDayRange,
  logoUrl,
  logoWallTiles,
  meetupPhotoUrl,
  monogram,
  photoItems,
  place,
  roleLabel,
  stats,
  topicKey,
  TYPE_LABEL,
} from "./derive";

// Fixture, newest first. Hosts and sponsors match the company names below.
const event = (e: Partial<Event> & Pick<Event, "id" | "date">): Event => ({
  type: "meetup",
  title: `Event ${e.id}`,
  city: "Casablanca",
  ...e,
});

const events: Event[] = [
  event({
    id: "m3",
    date: "2026-10-24",
    title: "Meetup A",
    host: "Alpha Systems",
    registrations: 100,
    photos: ["p-a1", "p-a2"],
  }),
  event({
    id: "m2",
    date: "2026-05-10",
    host: "Beta",
    city: "Rabat",
    registrations: 50,
  }),
  event({ id: "m1", date: "2025-03-08", host: "Alpha Systems" }),
  event({
    id: "s2",
    date: "2024-03-10",
    type: "socrates",
    venue: "Hotel Mer",
    city: "Bouznika",
    sponsors: ["Alpha Systems", "Delta"],
  }),
  event({
    id: "s1",
    date: "2022-03-11",
    type: "socrates",
    city: "Marrakech",
    sponsors: ["Delta"],
  }),
  event({ id: "o1", date: "2021-04", type: "online", city: "En ligne" }),
  event({
    id: "c2",
    date: "2019-06-22",
    type: "codesnack",
    host: "Gamma Labs",
  }),
  event({
    id: "c1",
    date: "2019-03-16",
    type: "codesnack",
    host: "Gamma Labs",
  }),
];

const company = (
  c: Partial<Company> & Pick<Company, "id" | "name">,
): Company => ({
  display: "",
  logo: "",
  linkedin: "",
  ...c,
});

const companies: Company[] = [
  company({
    id: "alpha",
    name: "Alpha Systems",
    display: "Alpha Systems Morocco",
    logo: "alpha.png",
    linkedin: "https://www.linkedin.com/company/alpha/",
  }),
  company({ id: "beta", name: "Beta" }),
  company({ id: "gamma", name: "Gamma Labs", logo: "gamma.svg" }),
  company({ id: "delta", name: "Delta", logo: "delta.png" }),
  company({ id: "epsilon", name: "Epsilon" }),
];

const byId = (id: string): Event => {
  const found = events.find((e) => e.id === id);
  if (!found) throw new Error(`no event ${id}`);
  return found;
};

describe("fmtDate", () => {
  it("formats a short date with the day and an abbreviated French month", () => {
    expect(fmtDate("2026-10-24")).toBe("24 oct. 2026");
    expect(fmtDate("2019-03-16")).toBe("16 mars 2019");
  });

  it("formats a long date with the full French month", () => {
    expect(fmtDate("2026-10-24", { long: true })).toBe("24 octobre 2026");
    expect(fmtDate("2019-03-16", { long: true })).toBe("16 mars 2019");
  });

  it("leaves out the day when asked to", () => {
    expect(fmtDate("2026-10-24", { day: false })).toBe("oct. 2026");
    expect(fmtDate("2026-10-24", { day: false, long: true })).toBe(
      "octobre 2026",
    );
  });

  it("formats a month-only date without a day", () => {
    expect(fmtDate("2021-04")).toBe("avr. 2021");
    expect(fmtDate("2021-04", { day: false })).toBe("avr. 2021");
  });

  it("fails loudly on a month outside 1 to 12 instead of printing undefined", () => {
    expect(() => fmtDate("2026-13-01")).toThrow(/2026-13-01/);
    expect(() => fmtDate("2026-00-01")).toThrow(/2026-00-01/);
  });

  it("fails loudly on a date without a month", () => {
    expect(() => fmtDate("2026")).toThrow(/2026/);
  });
});

describe("fmtDayRange", () => {
  it.each([
    ["2022-03-25", "2022-03-27", "25 → 27 mars"],
    ["2023-03-30", "2023-04-02", "30 mars → 2 avril"],
    ["2022-03-25", undefined, "25 mars"],
    ["2022-03-25", "2022-03-25", "25 mars"],
    ["2021-04", undefined, "avril"],
  ])("writes %s to %s as %s", (start, end, label) => {
    expect(fmtDayRange(start, end)).toBe(label);
  });

  it("fails on a month outside 1 to 12", () => {
    expect(() => fmtDayRange("2022-13-01")).toThrow(/2022-13-01/);
  });
});

describe("topicKey", () => {
  it("gives one key to spellings that differ by case, accents and outer spaces", () => {
    expect(topicKey("  Éthique ")).toBe(topicKey("ethique"));
    expect(topicKey("TDD")).toBe(topicKey("tdd"));
  });

  it("keeps different topics apart and inner spaces", () => {
    expect(topicKey("clean code")).not.toBe(topicKey("cleancode"));
  });

  it("gives an empty key to a blank topic", () => {
    expect(topicKey("   ")).toBe("");
    expect(topicKey("")).toBe("");
  });
});

describe("place", () => {
  it("joins the venue and the city", () => {
    expect(place(byId("s2"))).toBe("Hotel Mer, Bouznika");
  });

  it("returns the city alone when there is no venue", () => {
    expect(place(byId("m3"))).toBe("Casablanca");
    expect(place(byId("o1"))).toBe("En ligne");
  });
});

describe("meetupPhotoUrl and logoUrl", () => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH;
  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = original;
  });

  it("builds the photo and logo URLs from the asset folders", () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    expect(meetupPhotoUrl("2026-05-axa-1")).toBe(
      "/assets/img/meetups/2026-05-axa-1.jpg",
    );
    expect(logoUrl("axa.png")).toBe("/assets/img/logos/axa.png");
  });

  it("adds the base path of the deployment", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/moroccan-software-crafters";
    expect(meetupPhotoUrl("2026-05-axa-1")).toBe(
      "/moroccan-software-crafters/assets/img/meetups/2026-05-axa-1.jpg",
    );
    expect(logoUrl("bdsi.svg")).toBe(
      "/moroccan-software-crafters/assets/img/logos/bdsi.svg",
    );
  });
});

describe("absoluteImageUrl and absoluteMeetupPhoto", () => {
  afterEach(() => vi.unstubAllEnvs());

  // `baseUrl` of the site already carries the GitHub Pages base path.
  const baseUrl = "https://example.org/base";

  it("joins the base URL and the path of a public image", () => {
    expect(absoluteImageUrl(baseUrl, "/assets/img/a.jpg")).toBe(
      "https://example.org/base/assets/img/a.jpg",
    );
  });

  it("does not double the slash when the base URL ends with one", () => {
    expect(absoluteImageUrl(`${baseUrl}/`, "/assets/img/a.jpg")).toBe(
      "https://example.org/base/assets/img/a.jpg",
    );
  });

  it("builds the absolute URL of a meetup photo from its name", () => {
    expect(absoluteMeetupPhoto(baseUrl, "2026-05-axa-1")).toBe(
      "https://example.org/base/assets/img/meetups/2026-05-axa-1.jpg",
    );
  });

  it("does not add the base path of the build a second time", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/other");
    expect(absoluteMeetupPhoto(baseUrl, "x")).toBe(
      "https://example.org/base/assets/img/meetups/x.jpg",
    );
  });
});

describe("photoItems", () => {
  it("returns one item per photo with the URL and the title and date caption", () => {
    expect(photoItems(byId("m3"))).toEqual([
      {
        photo: "p-a1",
        src: "/assets/img/meetups/p-a1.jpg",
        caption: "Meetup A · 24 oct. 2026",
        eventId: "m3",
      },
      {
        photo: "p-a2",
        src: "/assets/img/meetups/p-a2.jpg",
        caption: "Meetup A · 24 oct. 2026",
        eventId: "m3",
      },
    ]);
  });

  it("returns an empty list for an event without photos", () => {
    expect(photoItems(byId("s1"))).toEqual([]);
  });
});

describe("stats", () => {
  const site = { since: 2019, linkedinFollowers: 3666 };

  it("counts the events, the meetups, the hosts and the SoCraTes editions", () => {
    expect(stats(site, events)).toEqual({
      events: 8,
      meetups: 3,
      hosts: 2,
      avgRegistrations: "~75",
      followers: "3\u202f666",
      socrates: 2,
      since: 2019,
    });
  });

  it("averages the registrations of the five newest meetups that have some", () => {
    // 110, 51, 119, 89, 157 -> 526 / 5 = 105.2; the sixth meetup is ignored.
    const list = [110, 51, 119, 89, 157, 1000].map((registrations, i) =>
      event({ id: `m${i}`, date: "2026-01-01", registrations }),
    );
    expect(stats(site, list).avgRegistrations).toBe("~105");
  });

  it("skips a meetup without registrations when it averages", () => {
    const list = [
      event({ id: "a", date: "2026-03-01", registrations: 60 }),
      event({ id: "b", date: "2026-02-01" }),
      event({ id: "c", date: "2026-01-01", registrations: 40 }),
    ];
    expect(stats(site, list).avgRegistrations).toBe("~50");
  });

  it("returns an empty average when no meetup has registrations", () => {
    const list = [event({ id: "a", date: "2019-03", type: "codesnack" })];
    expect(stats(site, list)).toMatchObject({
      events: 1,
      meetups: 0,
      hosts: 0,
      avgRegistrations: "",
      socrates: 0,
    });
  });

  it("counts a host once and ignores the hosts of events that are not meetups", () => {
    // Alpha hosts two meetups and Gamma Labs hosts only Code Snacks.
    expect(stats(site, events).hosts).toBe(2);
  });

  it("separates the thousands of the followers with a narrow no-break space", () => {
    expect(
      stats({ since: 2019, linkedinFollowers: 1234567 }, []).followers,
    ).toBe("1\u202f234\u202f567");
  });
});

describe("companyStats", () => {
  const st = companyStats(companies, events);

  it("counts the hosted events, the sponsored editions and the sorted years", () => {
    expect(st["alpha"]).toEqual({
      hosted: 2,
      sponsored: 1,
      years: ["2024", "2025", "2026"],
      roles: ["host", "sponsor"],
    });
  });

  it("counts any event type as hosted, a Code Snack included", () => {
    expect(st["gamma"]).toEqual({
      hosted: 2,
      sponsored: 0,
      years: ["2019"],
      roles: ["host"],
    });
  });

  it("gives only the sponsor role to a company that never hosted", () => {
    expect(st["delta"]).toEqual({
      hosted: 0,
      sponsored: 2,
      years: ["2022", "2024"],
      roles: ["sponsor"],
    });
  });

  it("gives no year and no role to a company without events", () => {
    expect(st["epsilon"]).toEqual({
      hosted: 0,
      sponsored: 0,
      years: [],
      roles: [],
    });
  });

  it("matches a host on the exact company name", () => {
    const other = [
      event({ id: "x", date: "2026-01-01", host: "alpha systems" }),
    ];
    expect(companyStats(companies, other)["alpha"]?.hosted).toBe(0);
  });
});

describe("roleLabel", () => {
  it("labels a single hosted meetup and a single sponsorship", () => {
    expect(roleLabel({ hosted: 1, sponsored: 0 })).toBe("Hôte d'un meetup");
    expect(roleLabel({ hosted: 0, sponsored: 1 })).toBe("Partenaire SoCraTes");
  });

  it("labels several of each and joins them", () => {
    expect(roleLabel({ hosted: 2, sponsored: 4 })).toBe(
      "Hôte de 2 meetups · Partenaire de 4 éditions SoCraTes",
    );
  });

  it("returns an empty label for a company with no role", () => {
    expect(roleLabel({ hosted: 0, sponsored: 0 })).toBe("");
  });
});

describe("monogram", () => {
  it("takes the first letters of the first two words", () => {
    expect(monogram("McKinsey & Company")).toBe("MC");
    expect(monogram("Label'Vie")).toBe("LV");
    expect(monogram("SG Global Solution Centre Morocco")).toBe("SG");
  });

  it("takes the first two letters of a one-word name, in capitals", () => {
    expect(monogram("inwi")).toBe("IN");
    expect(monogram("Zenika")).toBe("ZE");
  });
});

describe("TYPE_LABEL", () => {
  it("names each event type in French", () => {
    expect(TYPE_LABEL).toEqual({
      meetup: "Meetup",
      socrates: "SoCraTes",
      codesnack: "Code Snack",
      online: "En ligne",
    });
  });
});

describe("logoWallTiles", () => {
  it("sorts the companies by hosted plus sponsored, keeping file order on a tie", () => {
    // alpha 3, gamma 2, delta 2, beta 1, epsilon 0.
    const tiles = logoWallTiles(companies, events);
    expect(tiles.map((t) => t.id)).toEqual([
      "alpha",
      "gamma",
      "delta",
      "beta",
      "epsilon",
    ]);
  });

  it("builds a tile with the display name, the role label, the logo and the link", () => {
    const [first] = logoWallTiles(companies, events);
    expect(first).toEqual({
      id: "alpha",
      name: "Alpha Systems Morocco",
      label: "Hôte de 2 meetups · Partenaire SoCraTes",
      href: "https://www.linkedin.com/company/alpha/",
      logoSrc: "/assets/img/logos/alpha.png",
      monogram: "AS",
      hosted: 2,
      sponsored: 1,
    });
  });

  it("falls back to the name, a null link and a null logo when the company has none", () => {
    const beta = logoWallTiles(companies, events).find((t) => t.id === "beta");
    expect(beta).toMatchObject({
      name: "Beta",
      href: null,
      logoSrc: null,
      monogram: "BE",
    });
  });

  it("keeps file order when sort is off and applies a filter", () => {
    const hostsOnly = logoWallTiles(companies, events, {
      sort: false,
      filter: (_c, s) => s.hosted > 0 && s.sponsored === 0,
    });
    expect(hostsOnly.map((t) => t.id)).toEqual(["beta", "gamma"]);
  });

  it("uses a custom label when given", () => {
    const tiles = logoWallTiles(companies, events, {
      label: (c) => `Label ${c.id}`,
    });
    expect(tiles[0]?.label).toBe("Label alpha");
  });
});
