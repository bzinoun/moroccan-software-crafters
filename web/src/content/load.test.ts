import { describe, expect, it } from "vitest";
import {
  loadCompanies,
  loadEvents,
  loadHome,
  loadOffers,
  loadSite,
  loadSponsoring,
  parseCompanies,
  parseEvents,
  parseHome,
  parseSite,
} from "./load";

describe("loadSite", () => {
  it("reads the root content/site.json", () => {
    const site = loadSite();
    expect(site.name).toBe("Moroccan Software Crafters");
    expect(site.nav.map((l) => l.label)).toEqual([
      "Le meetup",
      "Éditions",
      "SoCraTes",
      "Actualités",
      "L'association",
    ]);
    expect(site.cta).toEqual({
      label: "Accueillir un meetup",
      href: "accueillir.html",
    });
  });
});

describe("loadHome", () => {
  it("reads the hero of the root content/home.json", () => {
    const home = loadHome();
    expect(home.hero.eyebrow).toBe(
      "Software Craftsmanship · Casablanca · depuis 2019",
    );
    expect(home.hero.title).toContain("<em>");
    expect(home.hero.primary.href).toBe("accueillir.html");
  });

  it("reads the hero collage and the post-it", () => {
    const { hero } = loadHome();
    expect(hero.note).toBe("");
    expect(hero.postit).toBe("Prochain hôte : votre entreprise ?");
    expect(hero.collage).toEqual([
      { photo: "2026-10-sg-gscm-5", caption: "SG GSCM · oct. 2026" },
      { photo: "2026-05-axa-1", caption: "AXA · mai 2026" },
      { photo: "2026-03-innovx-2", caption: "InnovX · mars 2026" },
    ]);
  });

  it("reads the stats band definition", () => {
    const { stats } = loadHome();
    expect(stats.map((s) => s.key)).toEqual([
      "events",
      "hosts",
      "avgRegistrations",
      "followers",
      "socrates",
    ]);
    expect(stats[2]?.label).toBe("inscrits par meetup (2025-26)");
  });

  it("reads the format section with its four steps", () => {
    const { format } = loadHome();
    expect(format.eyebrow).toBe("Le format");
    expect(format.steps).toHaveLength(4);
    expect(format.steps[0]).toEqual({
      time: "9 h 30",
      title: "Networking",
      text: "Café, présentations, et on fait connaissance avec l'équipe qui nous accueille.",
      photo: "2026-10-sg-gscm-7",
    });
    expect(format.more).toEqual({
      label: "Le déroulé détaillé, étape par étape",
      href: "meetup.html",
    });
  });

  it("reads topics, history, gallery, socrates, faq and cta", () => {
    const home = loadHome();
    expect(home.topics).toEqual({
      title: "Sujets discutés lors des dernières éditions",
      limit: 10,
    });
    expect(home.history.filters.map((f) => f.value)).toEqual([
      "all",
      "meetup",
      "socrates",
      "codesnack",
      "online",
    ]);
    expect(home.history.limit).toBe(6);
    expect(home.history.more).toBe("Voir les {n} événements");
    expect(home.gallery).toEqual({
      eyebrow: "Galerie",
      title: "Dans la salle.",
      limit: 8,
      more: "Voir toutes les photos",
    });
    expect(home.socrates.photo).toBe("2022-03-socrates-groupe");
    expect(home.socrates.sponsor.cta.href).toBe("socrates.html#sponsoring");
    expect(home.faq.items).toHaveLength(5);
    expect(home.faq.items[1]?.q).toBe("Pourquoi le samedi matin ?");
    expect(home.cta.secondary.href).toBe(
      "https://www.linkedin.com/company/moroccansoftwarecrafters/",
    );
  });
});

describe("loadEvents", () => {
  it("reads the 21 events of content/events.json, newest first", () => {
    const events = loadEvents();
    expect(events).toHaveLength(21);
    expect(events[0]?.id).toBe("2026-10-sg-gscm");
    expect(events[20]?.id).toBe("2019-03-codesnack-1");
  });

  it("keeps every field of a full meetup entry", () => {
    const [first] = loadEvents();
    expect(first).toEqual({
      id: "2026-10-sg-gscm",
      date: "2026-10-24",
      type: "meetup",
      title: "Meetup @ Société Générale GSCM",
      host: "Société Générale GSCM",
      city: "Casablanca",
      topics: [
        "AI factory",
        "Responsabilité humaine",
        "Sécurité du vibe coding",
        "Outils IA",
        "Coût des tokens",
      ],
      summary:
        "Qui est responsable quand l'IA écrit le code ? L'IA multiplie ce que la codebase est déjà : tests, documentation et architecture d'abord.",
      registrations: 110,
      photos: [
        "2026-10-sg-gscm-5",
        "2026-10-sg-gscm-3",
        "2026-10-sg-gscm-2",
        "2026-10-sg-gscm-7",
        "2026-10-sg-gscm-8",
        "2026-10-sg-gscm-4",
        "2026-10-sg-gscm-6",
        "2026-10-sg-gscm-1",
      ],
      poster: "2026-10-sg-gscm-affiche",
      links: {
        luma: "https://luma.com/6eiyisjw",
        linkedin:
          "https://www.linkedin.com/feed/update/urn:li:activity:7517872453725888512/",
      },
    });
  });

  it("accepts the optional fields being absent", () => {
    const online = loadEvents().find((e) => e.id === "2021-04-online");
    expect(online?.date).toBe("2021-04");
    expect(online?.type).toBe("online");
    expect(online?.host).toBeUndefined();
    expect(online?.photos).toBeUndefined();
    expect(online?.links).toBeUndefined();
  });

  it("reads the SoCraTes fields: venue, participants and sponsors", () => {
    const socrates = loadEvents().find((e) => e.id === "2022-03-socrates");
    expect(socrates?.venue).toBe("Palais Ronsard");
    expect(socrates?.city).toBe("Marrakech");
    expect(socrates?.participants).toBe(30);
    expect(socrates?.sponsors).toEqual([
      "Maltem Africa",
      "Keiken",
      "AXA Assurance Maroc",
      "inwi",
      "Gemography",
      "Nimbleways",
      "McKinsey & Company",
    ]);
    expect(socrates?.links).toEqual({ site: "https://socrates-ma.github.io/" });
  });
});

describe("loadCompanies", () => {
  it("reads the 16 companies, the intro texts and the stickers", () => {
    const companies = loadCompanies();
    expect(companies.eyebrow).toBe("Ils nous font confiance");
    expect(companies.items).toHaveLength(16);
    expect(companies.items[0]).toEqual({
      id: "sg-gscm",
      name: "Société Générale GSCM",
      display: "SG Global Solution Centre Morocco",
      logo: "sg-gscm.png",
      linkedin: "",
    });
    expect(companies.sticker.host).toEqual({
      title: "Votre logo ici ?",
      text: "Recevez 40 crafters un samedi matin. On s'occupe du reste.",
      label: "Accueillir un meetup",
      href: "accueillir.html",
    });
    expect(companies.sticker.sponsor.href).toBe("#sponsor-funnel");
  });
});

describe("event and company links", () => {
  it("matches every event host and sponsor to a company name exactly", () => {
    const names = new Set(loadCompanies().items.map((c) => c.name));
    const unknown = loadEvents().flatMap((e) =>
      [...(e.host ? [e.host] : []), ...(e.sponsors ?? [])]
        .filter((name) => !names.has(name))
        .map((name) => `"${name}" (event ${e.id})`),
    );
    expect(unknown, `unknown company names: ${unknown.join(", ")}`).toEqual([]);
  });
});

describe("loadOffers", () => {
  it("reads the three offers with their optional flags", () => {
    const offers = loadOffers();
    expect(offers.items.map((o) => o.id)).toEqual([
      "communautaire",
      "partenaire",
      "prive",
    ]);
    expect(offers.items[0]?.price).toBe("Gratuit");
    expect(offers.items[0]?.highlight).toBeUndefined();
    expect(offers.items[1]).toMatchObject({
      price: "À partir de 12 000 MAD",
      highlight: true,
      badge: "Nouveau",
    });
    expect(offers.items[2]?.youProvide).toEqual([
      "Vos équipes (15 à 80 personnes)",
      "Une demi-journée en semaine ou le samedi",
    ]);
    expect(offers.note).toBe(
      "Tarifs indicatifs hors taxes, ajustés selon le nombre de participants et la logistique.",
    );
  });
});

describe("loadSponsoring", () => {
  it("reads the trust ids and the packages", () => {
    const sponsoring = loadSponsoring();
    expect(sponsoring.trust.ids).toEqual([
      "mckinsey",
      "maltem",
      "inwi",
      "keiken",
      "gemography",
    ]);
    expect(sponsoring.packages.map((p) => p.price)).toEqual([
      "15 000 MAD",
      "35 000 MAD",
      "70 000 MAD",
    ]);
    expect(sponsoring.packages[2]?.limit).toBe("Un seul par édition");
    expect(sponsoring.nextEdition.capacity).toBe(60);
    expect(sponsoring.faq).toHaveLength(4);
  });
});

describe("parseSite", () => {
  it("throws an error that names the file and the issue path on a broken shape", () => {
    expect(() => parseSite({ name: 1 }, "site.json")).toThrow(
      /site\.json.*name/,
    );
  });
});

describe("parseEvents", () => {
  it("throws an error that names the file, the entry index and the field", () => {
    const broken = [
      { id: "a", date: "2026-10-24", type: "meetup", title: "A", city: "X" },
      { id: "b", date: "24/10/2026", type: "meetup", title: "B", city: "X" },
    ];
    expect(() => parseEvents(broken, "content/events.json")).toThrow(
      /content\/events\.json.*1\.date/,
    );
  });

  it("accepts unknown extra keys instead of rejecting the entry", () => {
    const withExtra = [
      {
        id: "a",
        date: "2026-10",
        type: "meetup",
        title: "A",
        city: "X",
        extra: 1,
      },
    ];
    expect(parseEvents(withExtra, "e.json")).toHaveLength(1);
  });

  it("rejects an unknown event type", () => {
    const broken = [
      { id: "a", date: "2026-10", type: "party", title: "A", city: "X" },
    ];
    expect(() => parseEvents(broken, "events.json")).toThrow(/0\.type/);
  });
});

describe("parseHome", () => {
  it("throws an error that names the file and the path of the broken field", () => {
    const home = loadHome();
    const broken = {
      ...home,
      hero: { ...home.hero, collage: [{ caption: "Sans photo" }] },
    };
    expect(() => parseHome(broken, "content/home.json")).toThrow(
      /content\/home\.json.*hero\.collage\.0\.photo/,
    );
  });
});

describe("parseCompanies", () => {
  it("throws an error that names the file and the path of the broken field", () => {
    const companies = loadCompanies();
    const broken = {
      ...companies,
      items: [{ id: "sg-gscm", name: "Société Générale GSCM" }],
    };
    expect(() => parseCompanies(broken, "content/companies.json")).toThrow(
      /content\/companies\.json.*items\.0\.display/,
    );
  });
});
