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

describe("loadSponsoring (every field socrates.html reads)", () => {
  it("reads the arguments, the in-kind block, the note and the form texts", () => {
    const sp = loadSponsoring();
    expect(sp.arguments).toHaveLength(4);
    expect(sp.packages).toHaveLength(3);
    expect(sp.packages[1]).toMatchObject({ highlight: true });
    expect(sp.packages[0]?.highlight).toBeUndefined();
    expect(sp.packages[0]?.badge).toBeUndefined();
    expect(sp.inKind.title).toBe("Partenariat en nature");
    expect(sp.note.length).toBeGreaterThan(0);
    expect(sp.form.title).toBe("Parlons de la prochaine édition");
    expect(sp.form.success).toBe(
      "Merci ! Nous vous envoyons le dossier de partenariat sous 48 heures.",
    );
    expect(sp.trust.title).toBe(
      "Cinq entreprises ont soutenu chacune des quatre éditions depuis 2022.",
    );
  });
});

describe("loadMeetup", () => {
  it("reads the hero, the facts and the meta", () => {
    const m = loadMeetup();
    expect(m.meta.title).toBe(
      "Le meetup, expliqué · Moroccan Software Crafters",
    );
    expect(m.hero.photo).toBe("2026-10-sg-gscm-2");
    expect(m.hero.title).toContain("<em>zéro</em>");
    expect(m.hero.facts).toHaveLength(4);
    expect(m.hero.facts[0]).toEqual({
      value: "9 h 30 → 14 h",
      label: "un samedi, toutes les 6 à 8 semaines",
    });
  });

  it("reads the five steps with their tips", () => {
    const { steps } = loadMeetup();
    expect(steps.items.map((s) => s.id)).toEqual([
      "accueil",
      "lightning",
      "bubble",
      "tables",
      "retro",
    ]);
    expect(steps.items[0]).toMatchObject({
      time: "9 h 30 → 10 h 15",
      title: "Accueil et networking",
      kicker: "On commence par le café",
    });
    expect(steps.items[0]?.tips).toEqual([
      "Arrivez à l'heure : l'accès au bâtiment ferme souvent 30 minutes après le début.",
      "Venez avec une question que vous vous posez en ce moment : elle finira sur un post-it.",
    ]);
  });

  it("reads the marketplace, the cards, the faq and the call to action", () => {
    const m = loadMeetup();
    expect(m.marketplace.photo).toBe("2026-05-axa-3");
    expect(m.marketplace.steps).toHaveLength(4);
    expect(m.marketplace.steps[0]?.title).toBe("Un post-it par idée");
    expect(m.who.items).toHaveLength(4);
    expect(m.who.items[0]?.href).toBeUndefined();
    expect(m.propose.items).toHaveLength(4);
    expect(m.rules.items).toHaveLength(5);
    expect(m.topicsWall.title).toBe("Le mur des sujets, depuis 2019.");
    expect(m.faq.items).toHaveLength(4);
    expect(m.faq.items[0]?.q).toBe(
      "Je ne connais personne, est-ce que je vais rester dans mon coin ?",
    );
    expect(m.cta.primary).toEqual({
      label: "Suivre l'association",
      href: "https://www.linkedin.com/company/moroccansoftwarecrafters/",
    });
    expect(m.cta.secondary.href).toBe("accueillir.html");
  });
});

describe("loadAssociation", () => {
  it("reads the hero and the card sections with their links", () => {
    const a = loadAssociation();
    expect(a.hero.photo).toBe("2026-03-innovx-1");
    expect(a.hero.title).toBe("Une communauté, <em>pas</em> une marque.");
    expect(a.mission.items.map((i) => i.href)).toEqual([
      "meetup.html",
      "socrates.html",
      "index.html#historique",
    ]);
    expect(a.principles.items).toHaveLength(6);
    expect(a.principles.items[0]?.title).toBe("Ouvert à tous");
    expect(a.principles.items[0]?.href).toBeUndefined();
    expect(a.contribute.items.map((i) => i.href)).toEqual([
      "accueillir.html",
      "socrates.html#sponsoring",
      "meetup.html#proposer",
      "https://www.linkedin.com/company/moroccansoftwarecrafters/",
    ]);
  });

  it("reads the timeline and the contact block", () => {
    const a = loadAssociation();
    expect(a.timeline.items.map((t) => t.year)).toEqual([
      "2019",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026",
    ]);
    expect(a.contact.title).toBe("Nous écrire");
  });
});

describe("loadSocrates", () => {
  it("reads the hero", () => {
    const { hero } = loadSocrates();
    expect(hero.status).toBe(
      "Prochaine édition\u202f: après le Ramadan 2027, Bouznika",
    );
    expect(hero.primary).toEqual({
      label: "Devenir partenaire",
      href: "#sponsoring",
    });
    expect(hero.secondary.href).toBe("https://socrates-ma.github.io/");
    expect(hero.facts[0]).toEqual({
      value: "4",
      label: "éditions depuis 2022",
    });
  });

  it("reads the sections and their counts", () => {
    const s = loadSocrates();
    expect(s.about.pillars).toHaveLength(3);
    expect(s.openspace.laws).toHaveLength(4);
    expect(s.openspace.laws[3]?.title).toBe("La loi des deux pieds.");
    expect(s.openspace.formats.title).toBe("Ce qu'on trouve sur la grille");
    expect(s.openspace.formats.items).toHaveLength(4);
    expect(s.schedule.days).toHaveLength(4);
    expect(s.schedule.days[0]).toMatchObject({
      day: "Jeudi",
      title: "Arrivée et World Café",
    });
    expect(s.values.items).toHaveLength(4);
    expect(s.sponsorsWall.title).toBe("Onze entreprises, quatre éditions.");
  });

  it("reads the editions, with an empty venue and photo allowed", () => {
    const { editions } = loadSocrates();
    expect(editions.items.map((e) => e.year)).toEqual([
      "2022",
      "2023",
      "2024",
      "2025",
    ]);
    expect(editions.items[1]).toMatchObject({
      edition: "2e édition",
      city: "Bouznika",
      venue: "",
      dates: "10 → 12 mars",
      participants: 45,
      partners: 10,
      photo: "2022-03-socrates-open-space",
    });
  });

  it("reads the international family", () => {
    const { family } = loadSocrates();
    expect(family.items).toHaveLength(9);
    expect(family.items[0]).toEqual({
      id: "socrates-de",
      name: "SoCraTes",
      country: "Allemagne",
    });
  });
});

describe("loadArticles", () => {
  it("reads the four articles, newest first in the file", () => {
    const articles = loadArticles();
    expect(articles.title).toBe("Récaps, annonces, appels.");
    expect(articles.items.map((a) => a.slug)).toEqual([
      "appel-partenaires-socrates-5e-edition",
      "sg-gscm-qui-est-responsable-quand-l-ia-ecrit-le-code",
      "axa-craftsmanship-a-l-ere-de-l-ia",
      "innovx-l-impact-reel-de-l-ia",
    ]);
  });

  it("keeps the event link optional", () => {
    const [first, second] = loadArticles().items;
    expect(first?.event).toBeUndefined();
    expect(second?.event).toBe("2026-10-sg-gscm");
    expect(second).toMatchObject({
      date: "2026-10-24",
      kind: "Récap",
      cover: "2026-10-sg-gscm-5",
      tags: ["IA", "Responsabilité", "Sécurité"],
    });
    expect(second?.body.startsWith("Ce samedi, les Moroccan")).toBe(true);
  });

  it("links every article event to a real event id", () => {
    const ids = new Set(loadEvents().map((e) => e.id));
    const unknown = loadArticles()
      .items.filter((a) => a.event && !ids.has(a.event))
      .map((a) => a.slug);
    expect(unknown).toEqual([]);
  });
});

describe("the new parsers name the file and the path of a broken field", () => {
  it("parseMeetup", () => {
    const m = loadMeetup();
    const broken = {
      ...m,
      steps: { ...m.steps, items: [{ id: "accueil", time: "9 h" }] },
    };
    expect(() => parseMeetup(broken, "content/meetup.json")).toThrow(
      /content\/meetup\.json.*steps\.items\.0\.title/,
    );
  });

  it("parseAssociation", () => {
    const a = loadAssociation();
    const broken = {
      ...a,
      timeline: { ...a.timeline, items: [{ year: 2019 }] },
    };
    expect(() => parseAssociation(broken, "content/association.json")).toThrow(
      /content\/association\.json.*timeline\.items\.0\.year/,
    );
  });

  it("parseSocrates", () => {
    const s = loadSocrates();
    const broken = {
      ...s,
      editions: {
        ...s.editions,
        items: [{ ...s.editions.items[0], participants: "30" }],
      },
    };
    expect(() => parseSocrates(broken, "content/socrates.json")).toThrow(
      /content\/socrates\.json.*editions\.items\.0\.participants/,
    );
  });

  it("parseArticles", () => {
    const a = loadArticles();
    const broken = {
      ...a,
      items: [{ ...a.items[0], date: "27/10/2026" }],
    };
    expect(() => parseArticles(broken, "content/articles.json")).toThrow(
      /content\/articles\.json.*items\.0\.date/,
    );
  });

  it("parseArticles rejects two articles with the same slug", () => {
    const a = loadArticles();
    const first = a.items[0];
    const broken = { ...a, items: [first, first] };
    expect(() => parseArticles(broken, "content/articles.json")).toThrow(
      /content\/articles\.json.*items\.1\.slug.*appel-partenaires-socrates-5e-edition/,
    );
  });

  it("parseSponsoring", () => {
    const sp = loadSponsoring();
    const broken = { ...sp, trust: { title: "x" } };
    expect(() => parseSponsoring(broken, "content/sponsoring.json")).toThrow(
      /content\/sponsoring\.json.*trust\.ids/,
    );
  });

  it("accepts unknown extra keys", () => {
    const m = loadMeetup();
    expect(parseMeetup({ ...m, extra: 1 }, "m.json").faq.items).toHaveLength(4);
  });
});
