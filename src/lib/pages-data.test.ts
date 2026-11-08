import { describe, expect, it } from "vitest";
import {
  loadArticles,
  loadCompanies,
  loadEvents,
  loadMeetup,
  loadSite,
  loadSocrates,
  loadSponsoring,
} from "@/content/load";
import {
  articleBySlug,
  articleCards,
  articleSlugs,
  articleView,
  associationFacts,
  hostsWall,
  levelForPackage,
  meetupPhoto,
  meetupSteps,
  meetupTopicBoard,
  sortedArticles,
  socratesEditionCards,
  socratesFamily,
  socratesLaws,
  sponsorLevels,
  sponsorPackages,
  sponsorsWall,
} from "./pages-data";

const events = loadEvents();
const companies = loadCompanies();
const site = loadSite();

describe("meetupPhoto", () => {
  it("builds the photo url, or null for an empty name", () => {
    expect(meetupPhoto("2026-10-sg-gscm-2")).toBe(
      "/assets/img/meetups/2026-10-sg-gscm-2.jpg",
    );
    expect(meetupPhoto("")).toBeNull();
    expect(meetupPhoto(undefined)).toBeNull();
  });
});

describe("meetupSteps", () => {
  it("gives the five steps with a photo url and the tips", () => {
    const steps = meetupSteps(loadMeetup());
    expect(steps.map((s) => s.id)).toEqual([
      "accueil",
      "lightning",
      "bubble",
      "tables",
      "retro",
    ]);
    expect(steps[0]).toMatchObject({
      time: "9 h 30 → 10 h 15",
      kicker: "On commence par le café",
      title: "Accueil et networking",
    });
    expect(steps[0]?.photoSrc).toMatch(/^\/assets\/img\/meetups\/.+\.jpg$/);
    expect(steps[0]?.tips).toHaveLength(2);
  });

  it("gives an empty tips list when a step has none", () => {
    const m = loadMeetup();
    const first = m.steps.items[0];
    if (!first) throw new Error("no step");
    const noTips = { ...first };
    delete noTips.tips;
    const steps = meetupSteps({
      ...m,
      steps: { ...m.steps, items: [noTips] },
    });
    expect(steps[0]?.tips).toEqual([]);
  });
});

describe("meetupTopicBoard", () => {
  const board = meetupTopicBoard(events);

  it("lists each topic once, ignoring case, from every event", () => {
    expect(board).toHaveLength(47);
    const keys = board.map((n) => n.topic.toLowerCase());
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("starts with the newest event: topic, year, host, tone", () => {
    expect(board[0]).toEqual({
      topic: "AI factory",
      year: "2026",
      from: "Société Générale GSCM",
      tone: "default",
    });
    expect(board[1]?.tone).toBe("pink");
    expect(board[2]?.tone).toBe("green");
    expect(board[3]?.tone).toBe("blue");
    expect(board[4]?.tone).toBe("orange");
    expect(board[5]?.tone).toBe("default");
  });

  it("falls back to the city when the event has no host", () => {
    const board2 = meetupTopicBoard([
      {
        id: "x",
        date: "2021-04",
        type: "online",
        title: "X",
        city: "En ligne",
        topics: ["Sujet"],
      },
    ]);
    expect(board2).toEqual([
      { topic: "Sujet", year: "2021", from: "En ligne", tone: "default" },
    ]);
  });
});

describe("associationFacts", () => {
  it("computes the four figures from the events and the site", () => {
    expect(associationFacts(site, events)).toEqual([
      { value: "21", label: "événements depuis 2019" },
      { value: "12", label: "entreprises hôtes" },
      { value: "4", label: "éditions de SoCraTes Maroc" },
      { value: (3666).toLocaleString("fr-FR"), label: "abonnés LinkedIn" },
    ]);
  });
});

describe("hostsWall", () => {
  it("lists the 16 companies, most active first, with the host sticker", () => {
    const wall = hostsWall(companies, events);
    expect(wall.tiles).toHaveLength(16);
    expect(wall.tiles[0]).toMatchObject({
      id: "maltem",
      hosted: 2,
      sponsored: 4,
      label: "Hôte de 2 meetups · Partenaire de 4 éditions SoCraTes",
    });
    expect(wall.sticker.title).toBe("Votre logo ici\u202f?");
    expect(wall.sticker.href).toBe("accueillir.html");
  });
});

describe("sponsorsWall", () => {
  const wall = sponsorsWall(companies, events);

  it("keeps the 11 sponsors, most active first, file order on a tie", () => {
    expect(wall.tiles).toHaveLength(11);
    expect(wall.tiles.slice(0, 9).map((t) => t.id)).toEqual([
      "maltem",
      "mckinsey",
      "inwi",
      "keiken",
      "gemography",
      "sg-gscm",
      "nimbleways",
      "axa",
      "innovx",
    ]);
  });

  it("labels each tile with the years", () => {
    expect(wall.tiles[0]?.label).toBe("2022 · 2023 · 2024 · 2025");
    expect(wall.tiles[5]?.label).toBe("2023 · 2026");
  });

  it("gives the sponsor sticker", () => {
    expect(wall.sticker.href).toBe("#sponsor-funnel");
  });
});

describe("socratesEditionCards", () => {
  const cards = socratesEditionCards(loadSocrates());

  it("builds the four cards", () => {
    expect(cards.map((c) => c.title)).toEqual([
      "2022 · Marrakech",
      "2023 · Bouznika",
      "2024 · Bouznika",
      "2025 · Bouznika",
    ]);
    expect(cards[0]).toMatchObject({
      year: "2022",
      edition: "1re édition",
      where: "Palais Ronsard · 25 → 27 mars",
      participants: 30,
    });
    expect(cards[0]?.photoSrc).toMatch(/^\/assets\/img\/meetups\/.+\.jpg$/);
  });

  it("leaves out an empty venue and keeps a photo only when named", () => {
    expect(cards[1]?.where).toBe("10 → 12 mars");
    const s = loadSocrates();
    const noPhoto = socratesEditionCards({
      ...s,
      editions: {
        ...s.editions,
        items: [{ ...s.editions.items[0]!, photo: "" }],
      },
    });
    expect(noPhoto[0]?.photoSrc).toBeNull();
  });
});

describe("socratesLaws", () => {
  it("marks only the last law as the main one", () => {
    const laws = socratesLaws(loadSocrates());
    expect(laws).toHaveLength(4);
    expect(laws.map((l) => l.main)).toEqual([false, false, false, true]);
    expect(laws[3]?.title).toBe("La loi des deux pieds.");
  });
});

describe("socratesFamily", () => {
  it("gives the nine members with their logo url", () => {
    const family = socratesFamily(loadSocrates());
    expect(family).toHaveLength(9);
    expect(family[0]).toEqual({
      id: "socrates-de",
      name: "SoCraTes",
      country: "Allemagne",
      logoSrc: "/assets/img/socrates/socrates-de.png",
    });
  });
});

describe("sponsorPackages", () => {
  it("gives the three packages with a price", () => {
    const packages = sponsorPackages(loadSponsoring());
    expect(packages.map((p) => p.price)).toEqual([
      "15 000 MAD",
      "35 000 MAD",
      "70 000 MAD",
    ]);
    expect(packages[1]?.highlight).toBe(true);
    expect(packages[0]?.highlight).toBe(false);
    expect(packages[2]?.limit).toBe("Un seul par édition");
    expect(packages[0]?.limit).toBeNull();
    expect(packages[0]?.badge).toBeNull();
  });

  it("shows 'Sur devis' for an empty price", () => {
    const sp = loadSponsoring();
    const first = sp.packages[0]!;
    const packages = sponsorPackages({
      ...sp,
      packages: [{ ...first, price: "" }],
    });
    expect(packages[0]?.price).toBe("Sur devis");
  });
});

describe("sponsorLevels", () => {
  it("lists the packages, then 'En nature' and 'À discuter' (the default)", () => {
    const { options, defaultValue } = sponsorLevels(loadSponsoring());
    expect(options).toHaveLength(5);
    expect(options[0]).toEqual({
      value: loadSponsoring().packages[0]?.name,
      label: `${loadSponsoring().packages[0]?.name} · 15 000 MAD`,
    });
    expect(options.slice(3)).toEqual([
      { value: "En nature", label: "En nature" },
      { value: "À discuter", label: "À discuter" },
    ]);
    expect(defaultValue).toBe("À discuter");
  });
});

describe("levelForPackage", () => {
  it("gives the level value of a package id", () => {
    const sp = loadSponsoring();
    expect(levelForPackage(sp, sp.packages[2]!.id)).toBe(sp.packages[2]!.name);
    expect(levelForPackage(sp, "inconnu")).toBeUndefined();
  });
});

describe("articles list", () => {
  const articles = loadArticles();

  it("sorts by date, newest first", () => {
    expect(sortedArticles(articles).map((a) => a.date)).toEqual([
      "2026-10-27",
      "2026-10-24",
      "2026-05-23",
      "2026-03-28",
    ]);
  });

  it("does not change the input order", () => {
    const reversed = { ...articles, items: [...articles.items].reverse() };
    sortedArticles(reversed);
    expect(reversed.items[0]?.date).toBe("2026-03-28");
  });

  it("builds the cards: the first is the lead card", () => {
    const cards = articleCards(articles);
    expect(cards).toHaveLength(4);
    expect(cards[0]).toMatchObject({
      slug: "appel-partenaires-socrates-5e-edition",
      href: "/actualites/appel-partenaires-socrates-5e-edition/",
      kind: "Annonce",
      dateLabel: "27 octobre 2026",
      coverSrc: "/assets/img/meetups/2022-03-socrates-open-space.jpg",
      tags: ["SoCraTes", "Partenariat"],
      lead: true,
    });
    expect(cards.map((c) => c.lead)).toEqual([true, false, false, false]);
    expect(cards[3]?.dateLabel).toBe("28 mars 2026");
  });
});

describe("articleSlugs and articleBySlug", () => {
  it("lists the four slugs", () => {
    expect(articleSlugs().sort()).toEqual([
      "appel-partenaires-socrates-5e-edition",
      "axa-craftsmanship-a-l-ere-de-l-ia",
      "innovx-l-impact-reel-de-l-ia",
      "sg-gscm-qui-est-responsable-quand-l-ia-ecrit-le-code",
    ]);
  });

  it("finds an article by slug, or returns undefined", () => {
    expect(articleBySlug("innovx-l-impact-reel-de-l-ia")?.date).toBe(
      "2026-03-28",
    );
    expect(articleBySlug("nope")).toBeUndefined();
  });
});

describe("articleView", () => {
  it("builds the detail of a recap with the event links and photos", () => {
    const article = articleBySlug("axa-craftsmanship-a-l-ere-de-l-ia")!;
    const view = articleView(article, events, site);
    expect(view).toMatchObject({
      kind: "Récap",
      dateLabel: "23 mai 2026",
      documentTitle: `${article.title} · Moroccan Software Crafters`,
      coverSrc: "/assets/img/meetups/2026-05-axa-1.jpg",
      tags: ["IA", "Cloud", "Sécurité"],
      photosLabel: "Les 4 photos",
    });
    expect(view.eventLinks).toEqual([
      {
        label: "Le post LinkedIn",
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7464586067107528704/",
      },
      { label: "La page Luma", href: "https://luma.com/jjn7tuih" },
    ]);
    expect(view.photos).toHaveLength(4);
    expect(view.photos[0]?.src).toBe("/assets/img/meetups/2026-05-axa-1.jpg");
  });

  it("has no links and no photos without a related event", () => {
    const view = articleView(
      articleBySlug("appel-partenaires-socrates-5e-edition")!,
      events,
      site,
    );
    expect(view.eventLinks).toEqual([]);
    expect(view.photos).toEqual([]);
    expect(view.photosLabel).toBeNull();
  });
});
