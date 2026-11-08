import { describe, expect, it } from "vitest";
import type {
  Article,
  Articles,
  Companies,
  Company,
  Event,
  Meetup,
  Site,
  Socrates,
  Sponsoring,
} from "@/content/types";
import {
  articleCards,
  articleMeta,
  DEFAULT_SOCIAL_PHOTO,
  articleHref,
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

// Every test works on a small fixture, with expected values worked out by hand,
// except "the real articles" at the end, which reads the content on purpose.
// The functions read only a few fields of each content object: the fixtures set
// those fields and a cast fills in the rest.

const ev = (over: Partial<Event> & Pick<Event, "id">): Event => ({
  date: "2026-01-01",
  type: "meetup",
  title: `Title of ${over.id}`,
  city: "Casablanca",
  ...over,
});

const events: Event[] = [
  ev({
    id: "m2",
    date: "2026-10-24",
    host: "Alpha SA",
    topics: ["Cloud", "Data"],
    photos: ["m2-1", "m2-2"],
    links: {
      linkedin: "https://example.org/li",
      luma: "https://example.org/lu",
    },
  }),
  ev({
    id: "s2",
    date: "2025-09-04",
    type: "socrates",
    city: "Bouznika",
    sponsors: ["Alpha SA", "Beta SA"],
    topics: ["cloud", "Tests"],
  }),
  ev({
    id: "m1",
    date: "2025-03-08",
    host: "Beta SA",
    topics: ["Tests", "SQL"],
  }),
  ev({
    id: "s1",
    date: "2024-03-09",
    type: "socrates",
    city: "Marrakech",
    sponsors: ["Beta SA"],
  }),
  ev({ id: "o1", date: "2021-04", type: "online", city: "En ligne" }),
];

const company = (
  c: Partial<Company> & Pick<Company, "id" | "name">,
): Company => ({
  display: "",
  logo: "",
  linkedin: "",
  ...c,
});

const sticker = (title: string) => ({
  title,
  text: "t",
  label: "l",
  href: "h",
});

const companies = {
  sticker: {
    host: sticker("Host sticker"),
    sponsor: sticker("Sponsor sticker"),
  },
  items: [
    company({ id: "alpha", name: "Alpha SA" }),
    company({ id: "beta", name: "Beta SA" }),
    company({ id: "gamma", name: "Gamma SA" }),
  ],
} as Companies;

describe("meetupPhoto", () => {
  it("builds the photo url, or null for an empty name", () => {
    expect(meetupPhoto("some-photo")).toBe(
      "/assets/img/meetups/some-photo.jpg",
    );
    expect(meetupPhoto("")).toBeNull();
    expect(meetupPhoto(undefined)).toBeNull();
  });
});

describe("meetupSteps", () => {
  const meetupWith = (items: Meetup["steps"]["items"]): Meetup =>
    ({ steps: { items } }) as Meetup;

  const step = {
    id: "welcome",
    time: "9 h 30 → 10 h 15",
    kicker: "Coffee first",
    title: "Welcome",
    text: "Meet the team",
    photo: "welcome-photo",
  };

  it("gives each step with a photo url and its tips", () => {
    const steps = meetupSteps(
      meetupWith([
        { ...step, tips: ["Come early", "Bring a question"] },
        {
          ...step,
          id: "talks",
          title: "Talks",
          photo: "talks-photo",
          tips: ["One"],
        },
      ]),
    );
    expect(steps).toEqual([
      {
        id: "welcome",
        time: "9 h 30 → 10 h 15",
        kicker: "Coffee first",
        title: "Welcome",
        text: "Meet the team",
        tips: ["Come early", "Bring a question"],
        photoSrc: "/assets/img/meetups/welcome-photo.jpg",
      },
      {
        id: "talks",
        time: "9 h 30 → 10 h 15",
        kicker: "Coffee first",
        title: "Talks",
        text: "Meet the team",
        tips: ["One"],
        photoSrc: "/assets/img/meetups/talks-photo.jpg",
      },
    ]);
  });

  it("gives an empty tips list when a step has none", () => {
    expect(meetupSteps(meetupWith([step]))[0]?.tips).toEqual([]);
  });
});

describe("meetupTopicBoard", () => {
  const board = meetupTopicBoard(events);

  it("lists each topic once, ignoring case, newest event first", () => {
    // "cloud" and the second "Tests" repeat earlier topics.
    expect(board.map((n) => n.topic)).toEqual([
      "Cloud",
      "Data",
      "Tests",
      "SQL",
    ]);
  });

  it("gives each note its year, its host or city, and a tone in rotation", () => {
    expect(board).toEqual([
      { topic: "Cloud", year: "2026", from: "Alpha SA", tone: "default" },
      { topic: "Data", year: "2026", from: "Alpha SA", tone: "pink" },
      { topic: "Tests", year: "2025", from: "Bouznika", tone: "green" },
      { topic: "SQL", year: "2025", from: "Beta SA", tone: "blue" },
    ]);
  });

  it("restarts the tone rotation after five notes", () => {
    const many = [
      ev({
        id: "big",
        topics: Array.from({ length: 6 }, (_, i) => `T${i + 1}`),
      }),
    ];
    const tones = meetupTopicBoard(many).map((n) => n.tone);
    expect(tones).toEqual([
      "default",
      "pink",
      "green",
      "blue",
      "orange",
      "default",
    ]);
  });

  it("ignores accents and outer spaces, and drops a blank topic", () => {
    const list = [
      ev({ id: "a", topics: [" Éthique ", " "] }),
      ev({ id: "b", topics: ["ethique", ""] }),
    ];
    expect(meetupTopicBoard(list).map((n) => n.topic)).toEqual(["Éthique"]);
  });

  it("falls back to the city when the event has no host", () => {
    const online = [
      ev({
        id: "x",
        date: "2021-04",
        type: "online",
        city: "En ligne",
        topics: ["Sujet"],
      }),
    ];
    expect(meetupTopicBoard(online)).toEqual([
      { topic: "Sujet", year: "2021", from: "En ligne", tone: "default" },
    ]);
  });
});

describe("associationFacts", () => {
  it("computes the four figures from the events and the site", () => {
    const site = { since: 2019, linkedinFollowers: 1500 } as Site;
    // 5 events, 2 hosts (Alpha SA, Beta SA), 2 SoCraTes editions.
    expect(associationFacts(site, events)).toEqual([
      { value: "5", label: "événements depuis 2019" },
      { value: "2", label: "entreprises hôtes" },
      { value: "2", label: "éditions de SoCraTes Maroc" },
      { value: "1\u202f500", label: "abonnés LinkedIn" },
    ]);
  });
});

describe("hostsWall", () => {
  const wall = hostsWall(companies, events);

  it("lists every company, most active first, file order on a tie", () => {
    // alpha: 1 hosted + 1 sponsored; beta: 1 + 2; gamma: 0.
    expect(wall.tiles.map((t) => t.id)).toEqual(["beta", "alpha", "gamma"]);
  });

  it("labels a tile with its roles", () => {
    expect(wall.tiles[0]).toMatchObject({
      id: "beta",
      hosted: 1,
      sponsored: 2,
      label: "Hôte d'un meetup · Partenaire de 2 éditions SoCraTes",
    });
  });

  it("gives the host sticker", () => {
    expect(wall.sticker).toBe(companies.sticker.host);
  });
});

describe("sponsorsWall", () => {
  const wall = sponsorsWall(companies, events);

  it("keeps the companies that sponsored, most active first", () => {
    expect(wall.tiles.map((t) => t.id)).toEqual(["beta", "alpha"]);
  });

  it("labels each tile with the years of its activity", () => {
    // beta: sponsor 2025 and 2024, host 2025. alpha: host 2026, sponsor 2025.
    expect(wall.tiles.map((t) => t.label)).toEqual([
      "2024 · 2025",
      "2025 · 2026",
    ]);
  });

  it("gives the sponsor sticker", () => {
    expect(wall.sticker).toBe(companies.sticker.sponsor);
  });
});

describe("socratesEditionCards", () => {
  const socratesWith = (
    items: Partial<Socrates["editions"]["items"][number]>[],
  ) => ({ editions: { items } }) as Socrates;

  const edition = {
    year: "2022",
    edition: "1re édition",
    city: "Marrakech",
    venue: "Palais X",
    dates: "25 → 27 mars",
    participants: 30,
    partners: 7,
    photo: "edition-photo",
    text: "Texte",
  };

  it("builds a card with its title, place, counts and photo url", () => {
    expect(socratesEditionCards(socratesWith([edition]))).toEqual([
      {
        year: "2022",
        edition: "1re édition",
        title: "2022 · Marrakech",
        where: "Palais X · 25 → 27 mars",
        participants: 30,
        partners: 7,
        photoSrc: "/assets/img/meetups/edition-photo.jpg",
        text: "Texte",
      },
    ]);
  });

  it("keeps the order of the editions", () => {
    const cards = socratesEditionCards(
      socratesWith([edition, { ...edition, year: "2023" }]),
    );
    expect(cards.map((c) => c.year)).toEqual(["2022", "2023"]);
  });

  it("leaves out an empty venue", () => {
    const [card] = socratesEditionCards(
      socratesWith([{ ...edition, venue: "" }]),
    );
    expect(card?.where).toBe("25 → 27 mars");
  });

  it("gives a null photo url when the photo is empty", () => {
    const [card] = socratesEditionCards(
      socratesWith([{ ...edition, photo: "" }]),
    );
    expect(card?.photoSrc).toBeNull();
  });
});

describe("socratesLaws", () => {
  it("marks only the last law as the main one", () => {
    const s = {
      openspace: {
        laws: [
          { title: "A", text: "a" },
          { title: "B", text: "b" },
          { title: "C", text: "c" },
        ],
      },
    } as Socrates;
    expect(socratesLaws(s)).toEqual([
      { title: "A", text: "a", main: false },
      { title: "B", text: "b", main: false },
      { title: "C", text: "c", main: true },
    ]);
  });
});

describe("socratesFamily", () => {
  it("gives each member with its logo url", () => {
    const s = {
      family: {
        items: [
          { id: "socrates-xx", name: "SoCraTes XX", country: "Pays" },
          { id: "other", name: "Other", country: "Autre" },
        ],
      },
    } as Socrates;
    expect(socratesFamily(s)).toEqual([
      {
        id: "socrates-xx",
        name: "SoCraTes XX",
        country: "Pays",
        logoSrc: "/assets/img/socrates/socrates-xx.png",
      },
      {
        id: "other",
        name: "Other",
        country: "Autre",
        logoSrc: "/assets/img/socrates/other.png",
      },
    ]);
  });
});

const sponsoring = {
  packages: [
    {
      id: "small",
      name: "Small",
      price: "1 000 MAD",
      tagline: "For a start",
      includes: ["Logo"],
    },
    {
      id: "big",
      name: "Big",
      price: "5 000 MAD",
      highlight: true,
      badge: "Popular",
      limit: "Only one",
      tagline: "For more",
      includes: ["Logo", "Talk"],
    },
  ],
} as Sponsoring;

describe("sponsorPackages", () => {
  it("gives a plain package with defaults for the optional fields", () => {
    expect(sponsorPackages(sponsoring)[0]).toEqual({
      id: "small",
      name: "Small",
      price: "1 000 MAD",
      highlight: false,
      badge: null,
      limit: null,
      tagline: "For a start",
      includes: ["Logo"],
    });
  });

  it("keeps the highlight, the badge and the limit of a package that has them", () => {
    expect(sponsorPackages(sponsoring)[1]).toMatchObject({
      highlight: true,
      badge: "Popular",
      limit: "Only one",
    });
  });

  it("shows 'Sur devis' for an empty price", () => {
    const sp = {
      packages: [{ ...sponsoring.packages[0]!, price: "" }],
    } as Sponsoring;
    expect(sponsorPackages(sp)[0]?.price).toBe("Sur devis");
  });
});

describe("sponsorLevels", () => {
  it("lists the packages, then 'En nature' and 'À discuter' (the default)", () => {
    expect(sponsorLevels(sponsoring)).toEqual({
      options: [
        { value: "Small", label: "Small · 1 000 MAD" },
        { value: "Big", label: "Big · 5 000 MAD" },
        { value: "En nature", label: "En nature" },
        { value: "À discuter", label: "À discuter" },
      ],
      defaultValue: "À discuter",
    });
  });
});

describe("levelForPackage", () => {
  it("gives the level value of a package id", () => {
    expect(levelForPackage(sponsoring, "big")).toBe("Big");
  });

  it("returns undefined for an unknown package id", () => {
    expect(levelForPackage(sponsoring, "inconnu")).toBeUndefined();
  });
});

describe("articles", () => {
  const article = (
    over: Partial<Article> & Pick<Article, "slug" | "date">,
  ): Article => ({
    kind: "Récap",
    title: `Title of ${over.slug}`,
    excerpt: "Excerpt",
    body: "Body",
    ...over,
  });

  // File order is not date order on purpose.
  const articles: Articles = {
    items: [
      article({ slug: "old", date: "2026-03-28" }),
      article({
        slug: "recap",
        date: "2026-10-24",
        kind: "Récap",
        cover: "m2-1",
        tags: ["IA", "Cloud"],
        event: "m2",
        body: "Texte du récap",
      }),
      article({ slug: "news", date: "2026-10-27", kind: "Annonce" }),
    ],
  } as Articles;
  const site = { name: "Le site" };

  describe("sortedArticles", () => {
    it("sorts by date, newest first", () => {
      expect(sortedArticles(articles).map((a) => a.slug)).toEqual([
        "news",
        "recap",
        "old",
      ]);
    });

    it("does not change the input order", () => {
      sortedArticles(articles);
      expect(articles.items.map((a) => a.slug)).toEqual([
        "old",
        "recap",
        "news",
      ]);
    });

    it("puts a date with a day before the same month without a day", () => {
      const mixed = {
        items: [
          article({ slug: "a", date: "2026-05" }),
          article({ slug: "b", date: "2026-05-02" }),
        ],
      } as Articles;
      expect(sortedArticles(mixed).map((a) => a.slug)).toEqual(["b", "a"]);
    });
  });

  describe("articleHref", () => {
    it("builds the route with a trailing slash", () => {
      expect(articleHref("my-article")).toBe("/actualites/my-article/");
    });

    it("encodes a slug that has special characters", () => {
      expect(articleHref("a b")).toBe("/actualites/a%20b/");
    });
  });

  describe("articleCards", () => {
    const cards = articleCards(articles);

    it("lists the articles newest first and marks only the first as the lead", () => {
      expect(cards.map((c) => [c.slug, c.lead])).toEqual([
        ["news", true],
        ["recap", false],
        ["old", false],
      ]);
    });

    it("builds a card with its link, long date, cover and tags", () => {
      expect(cards[1]).toEqual({
        slug: "recap",
        href: "/actualites/recap/",
        kind: "Récap",
        title: "Title of recap",
        excerpt: "Excerpt",
        dateLabel: "24 octobre 2026",
        coverSrc: "/assets/img/meetups/m2-1.jpg",
        tags: ["IA", "Cloud"],
        lead: false,
      });
    });

    it("gives a null cover and no tags to an article without them", () => {
      expect(cards[0]).toMatchObject({ coverSrc: null, tags: [] });
    });
  });

  describe("articleMeta", () => {
    const siteMeta = { name: "Le site", baseUrl: "https://example.org/base" };

    it("gives the page title, description, URL and cover image", () => {
      expect(articleMeta(articles.items[1]!, siteMeta)).toEqual({
        documentTitle: "Title of recap · Le site",
        description: "Excerpt",
        url: "https://example.org/base/actualites/recap/",
        image: "https://example.org/base/assets/img/meetups/m2-1.jpg",
      });
    });

    it("shares the default image when the article has no cover", () => {
      const { image } = articleMeta(articles.items[2]!, siteMeta);
      expect(image).toBe(
        `https://example.org/base/assets/img/meetups/${DEFAULT_SOCIAL_PHOTO}.jpg`,
      );
    });
  });

  describe("articleView", () => {
    it("builds the detail of a recap with the links and photos of its event", () => {
      const view = articleView(articles.items[1]!, events, site);
      expect(view).toEqual({
        slug: "recap",
        kind: "Récap",
        title: "Title of recap",
        excerpt: "Excerpt",
        dateLabel: "24 octobre 2026",
        coverSrc: "/assets/img/meetups/m2-1.jpg",
        tags: ["IA", "Cloud"],
        body: "Texte du récap",
        documentTitle: "Title of recap · Le site",
        eventLinks: [
          { label: "Le post LinkedIn", href: "https://example.org/li" },
          { label: "La page Luma", href: "https://example.org/lu" },
        ],
        photos: [
          {
            photo: "m2-1",
            src: "/assets/img/meetups/m2-1.jpg",
            caption: "Title of m2 · 24 oct. 2026",
            eventId: "m2",
          },
          {
            photo: "m2-2",
            src: "/assets/img/meetups/m2-2.jpg",
            caption: "Title of m2 · 24 oct. 2026",
            eventId: "m2",
          },
        ],
        photosLabel: "Les 2 photos",
      });
    });

    it("writes one photo without the plural article", () => {
      const one = [ev({ id: "m2", photos: ["only"] })];
      expect(articleView(articles.items[1]!, one, site).photosLabel).toBe(
        "1 photo",
      );
    });

    it("has no links, no photos and no label without a related event", () => {
      const view = articleView(articles.items[2]!, events, site);
      expect(view.eventLinks).toEqual([]);
      expect(view.photos).toEqual([]);
      expect(view.photosLabel).toBeNull();
    });

    it("has no links and no photos when the event id matches no event", () => {
      const lost = article({ slug: "lost", date: "2026-01-01", event: "nope" });
      const view = articleView(lost, events, site);
      expect(view.eventLinks).toEqual([]);
      expect(view.photosLabel).toBeNull();
    });

    it("lists only the links that the event has", () => {
      const noLuma = [
        ev({ id: "m2", links: { linkedin: "https://example.org/li" } }),
      ];
      const view = articleView(articles.items[1]!, noLuma, site);
      expect(view.eventLinks).toEqual([
        { label: "Le post LinkedIn", href: "https://example.org/li" },
      ]);
    });
  });
});
