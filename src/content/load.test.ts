import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  loadArticles,
  loadAssociation,
  loadCompanies,
  loadEvents,
  loadHome,
  loadMeetup,
  loadOffers,
  loadSite,
  loadSocrates,
  loadSponsoring,
  parseArticles,
  parseAssociation,
  parseCompanies,
  parseEvents,
  parseHome,
  parseMeetup,
  parseSite,
  parseSocrates,
  parseSponsoring,
} from "./load";

const imgDir = path.resolve(__dirname, "../../public/assets/img");

/** Every string stored under a `photo` or `cover` key, or in a `photos` list. */
function photoIds(node: unknown): string[] {
  if (Array.isArray(node)) return node.flatMap(photoIds);
  if (typeof node !== "object" || node === null) return [];
  return Object.entries(node).flatMap(([key, value]) => {
    if (key === "photos" && Array.isArray(value)) return value as string[];
    if ((key === "photo" || key === "cover") && typeof value === "string") {
      return value === "" ? [] : [value];
    }
    return photoIds(value);
  });
}

/** Every `href` value of the content, and the target of every Markdown link in a string. */
function linkTargets(node: unknown, key = ""): string[] {
  if (typeof node === "string") {
    if (key === "href") return [node];
    return [...node.matchAll(/\]\(([^)\s]*)\)/g)].map((m) => m[1] as string);
  }
  if (Array.isArray(node)) return node.flatMap((n) => linkTargets(n));
  if (typeof node !== "object" || node === null) return [];
  return Object.entries(node).flatMap(([k, v]) => linkTargets(v, k));
}

describe("the content files, as the site reads them", () => {
  it("gives the site a name, a navigation and a call to action", () => {
    const site = loadSite();
    expect(site.name).not.toBe("");
    expect(site.nav.length).toBeGreaterThan(0);
    expect(site.cta.label).not.toBe("");
    expect(site.cta.href).not.toBe("");
  });

  it("has events with unique ids, newest first", () => {
    const events = loadEvents();
    expect(events.length).toBeGreaterThan(0);
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    const dates = events.map((e) => e.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("has companies with unique ids and unique names", () => {
    const { items } = loadCompanies();
    expect(items.length).toBeGreaterThan(0);
    expect(new Set(items.map((c) => c.id)).size).toBe(items.length);
    expect(new Set(items.map((c) => c.name)).size).toBe(items.length);
  });

  it("matches every event host and sponsor to a company name exactly", () => {
    const names = new Set(loadCompanies().items.map((c) => c.name));
    const unknown = loadEvents().flatMap((e) =>
      [...(e.host ? [e.host] : []), ...(e.sponsors ?? [])]
        .filter((name) => !names.has(name))
        .map((name) => `"${name}" (event ${e.id})`),
    );
    expect(unknown, `unknown company names: ${unknown.join(", ")}`).toEqual([]);
  });

  it("matches every trusted sponsor id to a company id", () => {
    const ids = new Set(loadCompanies().items.map((c) => c.id));
    const unknown = loadSponsoring().trust.ids.filter((id) => !ids.has(id));
    expect(unknown).toEqual([]);
  });

  it("has articles with unique slugs, newest first, and real event links", () => {
    const { items } = loadArticles();
    expect(items.length).toBeGreaterThan(0);
    const slugs = items.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const dates = items.map((a) => a.date);
    expect(dates).toEqual([...dates].sort().reverse());
    const eventIds = new Set(loadEvents().map((e) => e.id));
    const unknown = items
      .filter((a) => a.event && !eventIds.has(a.event))
      .map((a) => a.slug);
    expect(unknown).toEqual([]);
  });

  it("links to routes and absolute URLs, never to an .html file", () => {
    const targets = [
      loadSite(),
      loadHome(),
      loadCompanies(),
      loadMeetup(),
      loadAssociation(),
      loadSocrates(),
      loadSponsoring(),
      loadArticles(),
    ].flatMap((content) => linkTargets(content));
    expect(targets.length).toBeGreaterThan(0);
    expect(targets.filter((href) => /\.html([#?]|$)/.test(href))).toEqual([]);
  });

  it("writes every Markdown link of an article as a site route or an https URL", () => {
    const targets = loadArticles().items.flatMap((a) => linkTargets(a.body));
    expect(targets.length).toBeGreaterThan(0);
    expect(
      targets.filter(
        (href) => !/^\/(?!\/)/.test(href) && !href.startsWith("https://"),
      ),
    ).toEqual([]);
  });

  it("has an image file for every photo and cover", () => {
    const ids = [
      loadHome(),
      loadEvents(),
      loadMeetup(),
      loadAssociation(),
      loadSocrates(),
      loadArticles(),
    ].flatMap(photoIds);
    expect(ids.length).toBeGreaterThan(0);
    const missing = ids.filter(
      (id) => !existsSync(path.join(imgDir, "meetups", `${id}.jpg`)),
    );
    expect(missing).toEqual([]);
  });

  it("has a logo file for every company that names one", () => {
    const missing = loadCompanies()
      .items.filter(
        (c) => c.logo !== "" && !existsSync(path.join(imgDir, "logos", c.logo)),
      )
      .map((c) => c.id);
    expect(missing).toEqual([]);
  });

  it("has a logo file for every SoCraTes family member", () => {
    const missing = loadSocrates()
      .family.items.filter(
        (m) => !existsSync(path.join(imgDir, "socrates", `${m.id}.png`)),
      )
      .map((m) => m.id);
    expect(missing).toEqual([]);
  });

  it("has offers and sponsoring packages with unique ids", () => {
    const offerIds = loadOffers().items.map((o) => o.id);
    const packageIds = loadSponsoring().packages.map((p) => p.id);
    expect(offerIds.length).toBeGreaterThan(0);
    expect(packageIds.length).toBeGreaterThan(0);
    expect(new Set(offerIds).size).toBe(offerIds.length);
    expect(new Set(packageIds).size).toBe(packageIds.length);
  });

  it("has a stats band, a format, a faq and filters on the home page", () => {
    const home = loadHome();
    expect(home.stats.length).toBeGreaterThan(0);
    expect(home.format.steps.length).toBeGreaterThan(0);
    expect(home.faq.items.length).toBeGreaterThan(0);
    expect(home.history.filters.map((f) => f.value)).toContain("all");
    expect(home.history.limit).toBeGreaterThan(0);
  });

  it("has meetup steps with unique ids and no blank tip", () => {
    const { steps } = loadMeetup();
    const ids = steps.items.map((s) => s.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    const tips = steps.items.flatMap((s) => s.tips ?? []);
    expect(tips.filter((tip) => tip.trim() === "")).toEqual([]);
  });

  it("has an association timeline in chronological order", () => {
    const years = loadAssociation().timeline.items.map((t) => t.year);
    expect(years.length).toBeGreaterThan(0);
    expect(years).toEqual([...years].sort());
  });

  it("links every SoCraTes edition card to an event of type socrates", () => {
    // loadSocrates() throws on a link to an unknown event.
    const years = new Set(
      loadEvents()
        .filter((e) => e.type === "socrates")
        .map((e) => e.date.slice(0, 4)),
    );
    const cards = loadSocrates().editions.items.map((e) => e.year);
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.filter((year) => !years.has(year))).toEqual([]);
  });

  it("has SoCraTes editions in chronological order and a schedule", () => {
    const s = loadSocrates();
    const years = s.editions.items.map((e) => e.year);
    expect(years.length).toBeGreaterThan(0);
    expect(years).toEqual([...years].sort());
    expect(s.schedule.days.length).toBeGreaterThan(0);
  });
});

describe("the parsers", () => {
  const minimalEvent = {
    id: "a",
    date: "2026-10-24",
    type: "meetup",
    title: "A",
    city: "X",
  };

  const minimalArticle = {
    slug: "premier",
    date: "2026-10-24",
    kind: "Récap",
    title: "Premier",
    excerpt: "Résumé",
    body: "Texte",
  };

  it("accepts an event that leaves out every optional field", () => {
    const [event] = parseEvents([minimalEvent], "events.json");
    expect(event?.host).toBeUndefined();
    expect(event?.photos).toBeUndefined();
    expect(event?.links).toBeUndefined();
  });

  it("accepts a year and month date without a day", () => {
    const [event] = parseEvents(
      [{ ...minimalEvent, date: "2021-04" }],
      "events.json",
    );
    expect(event?.date).toBe("2021-04");
  });

  it("accepts unknown extra keys instead of rejecting the entry", () => {
    expect(parseEvents([{ ...minimalEvent, extra: 1 }], "e.json")).toHaveLength(
      1,
    );
  });

  it("rejects an unknown event type", () => {
    expect(() =>
      parseEvents([{ ...minimalEvent, type: "party" }], "events.json"),
    ).toThrow(/0\.type/);
  });

  it("names the file, the entry index and the field of a broken event", () => {
    const broken = [minimalEvent, { ...minimalEvent, date: "24/10/2026" }];
    expect(() => parseEvents(broken, "content/events.json")).toThrow(
      /content\/events\.json.*1\.date/,
    );
  });

  it("names the file and the issue path of a broken site", () => {
    expect(() => parseSite({ name: 1 }, "site.json")).toThrow(
      /site\.json.*name/,
    );
  });

  it("names the file and the path of a broken home field", () => {
    const broken = { hero: { collage: [{ caption: "Sans photo" }] } };
    expect(() => parseHome(broken, "content/home.json")).toThrow(
      /content\/home\.json.*hero\.collage\.0\.photo/,
    );
  });

  it("names the file and the path of a broken company", () => {
    const broken = { items: [{ id: "a", name: "A" }] };
    expect(() => parseCompanies(broken, "content/companies.json")).toThrow(
      /content\/companies\.json.*items\.0\.display/,
    );
  });

  it("names the file and the path of a broken meetup step", () => {
    const broken = { steps: { items: [{ id: "accueil", time: "9 h" }] } };
    expect(() => parseMeetup(broken, "content/meetup.json")).toThrow(
      /content\/meetup\.json.*steps\.items\.0\.title/,
    );
  });

  it("names the file and the path of a broken timeline entry", () => {
    const broken = { timeline: { items: [{ year: 2019 }] } };
    expect(() => parseAssociation(broken, "content/association.json")).toThrow(
      /content\/association\.json.*timeline\.items\.0\.year/,
    );
  });

  it("names the file and the path of a broken edition", () => {
    const broken = { editions: { items: [{ text: 1 }] } };
    expect(() => parseSocrates(broken, "content/socrates.json")).toThrow(
      /content\/socrates\.json.*editions\.items\.0\.event/,
    );
  });

  it("rejects an empty edition photo", () => {
    const broken = {
      editions: { items: [{ event: "a", text: "t", photo: "" }] },
    };
    expect(() => parseSocrates(broken, "content/socrates.json")).toThrow(
      /editions\.items\.0\.photo/,
    );
  });

  it("accepts an end date and rejects one before the start date", () => {
    const [ok] = parseEvents(
      [{ ...minimalEvent, endDate: "2026-10-26" }],
      "events.json",
    );
    expect(ok?.endDate).toBe("2026-10-26");
    expect(() =>
      parseEvents([{ ...minimalEvent, endDate: "2026-10-01" }], "events.json"),
    ).toThrow(/0\.endDate/);
    expect(() =>
      parseEvents([{ ...minimalEvent, endDate: "2026-10" }], "events.json"),
    ).toThrow(/0\.endDate/);
  });

  it("names the file and the path of a broken article date", () => {
    const broken = { items: [{ ...minimalArticle, date: "27/10/2026" }] };
    expect(() => parseArticles(broken, "content/articles.json")).toThrow(
      /content\/articles\.json.*items\.0\.date/,
    );
  });

  it("rejects an article kind outside Annonce and Récap", () => {
    const broken = { items: [{ ...minimalArticle, kind: "Billet" }] };
    expect(() => parseArticles(broken, "content/articles.json")).toThrow(
      /content\/articles\.json.*items\.0\.kind/,
    );
  });

  it.each([
    ["Accentué"],
    ["Majuscule"],
    ["deux--tirets"],
    ["-debut"],
    ["fin-"],
    ["a b"],
    [""],
  ])("rejects the article slug %j", (slug) => {
    const broken = { items: [{ ...minimalArticle, slug }] };
    expect(() => parseArticles(broken, "content/articles.json")).toThrow(
      /items\.0\.slug/,
    );
  });

  it("rejects a news page without any article", () => {
    expect(() => parseArticles({ items: [] }, "content/articles.json")).toThrow(
      /content\/articles\.json.*items/,
    );
  });

  it("rejects an empty photo of the SoCraTes teaser on the home page", () => {
    const broken = { socrates: { photo: "" } };
    expect(() => parseHome(broken, "content/home.json")).toThrow(
      /content\/home\.json.*socrates\.photo/,
    );
  });

  it("rejects two articles with the same slug", () => {
    const broken = { items: [minimalArticle, minimalArticle] };
    expect(() => parseArticles(broken, "content/articles.json")).toThrow(
      /content\/articles\.json.*items\.1\.slug.*premier/,
    );
  });

  it("names the file and the path of a broken sponsoring trust block", () => {
    const broken = { trust: { title: "x" } };
    expect(() => parseSponsoring(broken, "content/sponsoring.json")).toThrow(
      /content\/sponsoring\.json.*trust\.ids/,
    );
  });
});
