import { afterEach, describe, expect, it } from "vitest";
import { loadCompanies, loadEvents, loadSite } from "@/content/load";
import type { Event } from "@/content/types";
import {
  companyStats,
  fmtDate,
  logoUrl,
  logoWallTiles,
  meetupPhotoUrl,
  monogram,
  photoItems,
  place,
  roleLabel,
  stats,
  TYPE_LABEL,
} from "./derive";

const events = loadEvents();
const companies = loadCompanies().items;
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
});

describe("place", () => {
  it("joins the venue and the city", () => {
    expect(place(byId("2026-05-axa"))).toBe("Avenue Hassan II, Casablanca");
    expect(place(byId("2022-03-socrates"))).toBe("Palais Ronsard, Marrakech");
  });

  it("returns the city alone when there is no venue", () => {
    expect(place(byId("2026-10-sg-gscm"))).toBe("Casablanca");
    expect(place(byId("2021-04-online"))).toBe("En ligne");
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

describe("photoItems", () => {
  it("returns one item per photo with the URL and the title and date caption", () => {
    const items = photoItems(byId("2026-10-sg-gscm"));
    expect(items).toHaveLength(8);
    expect(items[0]).toEqual({
      photo: "2026-10-sg-gscm-5",
      src: "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
      caption: "Meetup @ Société Générale GSCM · 24 oct. 2026",
      eventId: "2026-10-sg-gscm",
    });
    expect(items[1]?.photo).toBe("2026-10-sg-gscm-3");
  });

  it("returns an empty list for an event without photos", () => {
    expect(photoItems(byId("2025-09-socrates"))).toEqual([]);
  });
});

describe("stats", () => {
  it("computes the figures of the live home page", () => {
    expect(stats(loadSite(), events)).toEqual({
      events: 21,
      meetups: 14,
      hosts: 12,
      avgRegistrations: "~105",
      followers: "3 666",
      socrates: 4,
      since: 2019,
    });
  });

  it("averages the registrations of the five newest meetups that have some", () => {
    // 110, 51, 119, 89, 157 -> 526 / 5 = 105.2; the older meetups have none.
    const list = [110, 51, 119, 89, 157, 1000].map(
      (registrations, i): Event => ({
        id: `m${i}`,
        date: "2026-01-01",
        type: "meetup",
        title: "M",
        city: "Casablanca",
        registrations,
      }),
    );
    expect(stats(loadSite(), list).avgRegistrations).toBe("~105");
  });

  it("returns an empty average when no meetup has registrations", () => {
    const list: Event[] = [
      { id: "a", date: "2019-03", type: "codesnack", title: "A", city: "X" },
    ];
    expect(stats(loadSite(), list)).toMatchObject({
      events: 1,
      meetups: 0,
      hosts: 0,
      avgRegistrations: "",
      socrates: 0,
    });
  });

  it("counts a host once and ignores events that are not meetups", () => {
    expect(stats(loadSite(), events).hosts).toBe(12);
  });
});

describe("companyStats", () => {
  const st = companyStats(companies, events);

  it("counts the hosted events, the sponsored editions and the years", () => {
    expect(st["maltem"]).toEqual({
      hosted: 2,
      sponsored: 4,
      years: ["2022", "2023", "2024", "2025"],
      roles: ["host", "sponsor"],
    });
    expect(st["sg-gscm"]).toEqual({
      hosted: 2,
      sponsored: 1,
      years: ["2023", "2026"],
      roles: ["host", "sponsor"],
    });
  });

  it("counts any event type as hosted, a Code Snack included", () => {
    expect(st["bdsi"]).toEqual({
      hosted: 2,
      sponsored: 0,
      years: ["2019"],
      roles: ["host"],
    });
  });

  it("gives only the sponsor role to a company that never hosted", () => {
    expect(st["keiken"]).toEqual({
      hosted: 0,
      sponsored: 4,
      years: ["2022", "2023", "2024", "2025"],
      roles: ["sponsor"],
    });
    expect(st["zenika"]?.years).toEqual(["2023"]);
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
    const tiles = logoWallTiles(companies, events);
    expect(tiles.map((t) => t.id)).toEqual([
      "maltem",
      "mckinsey",
      "inwi",
      "keiken",
      "gemography",
      "sg-gscm",
      "nimbleways",
      "axa",
      "innovx",
      "bdsi",
      "jobzyn",
      "oracle",
      "renault",
      "labelvie",
      "zenika",
      "done",
    ]);
  });

  it("builds a tile with the display name, the role label, the logo and the link", () => {
    const [first] = logoWallTiles(companies, events);
    expect(first).toEqual({
      id: "maltem",
      name: "Maltem Africa",
      label: "Hôte de 2 meetups · Partenaire de 4 éditions SoCraTes",
      href: "https://www.linkedin.com/company/maltem-africa/",
      logoSrc: "/assets/img/logos/maltem.png",
      monogram: "MA",
      hosted: 2,
      sponsored: 4,
    });
  });

  it("uses a null link when the company has no LinkedIn page", () => {
    const tiles = logoWallTiles(companies, events);
    const sg = tiles.find((t) => t.id === "sg-gscm");
    expect(sg?.href).toBeNull();
    expect(sg?.name).toBe("SG Global Solution Centre Morocco");
    expect(sg?.monogram).toBe("SG");
  });

  it("uses a null logo when the company has none", () => {
    const noLogo = [{ ...companies[0]!, logo: "" }];
    expect(logoWallTiles(noLogo, events)[0]?.logoSrc).toBeNull();
  });

  it("keeps file order when sort is off and applies a filter", () => {
    const hostsOnly = logoWallTiles(companies, events, {
      sort: false,
      filter: (_c, s) => s.hosted > 0 && s.sponsored === 0,
    });
    expect(hostsOnly.map((t) => t.id)).toEqual([
      "jobzyn",
      "oracle",
      "renault",
      "labelvie",
      "bdsi",
    ]);
  });

  it("uses a custom label when given", () => {
    const tiles = logoWallTiles(companies, events, {
      label: (c) => `Label ${c.id}`,
    });
    expect(tiles[0]?.label).toBe("Label maltem");
  });
});
