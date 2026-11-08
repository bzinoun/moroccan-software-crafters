// Derivations that former `assets/js/pages.js` (`git show 1353207:assets/js/pages.js`) of the former site does inline for the
// meetup, SoCraTes, association and news pages, as pure functions. The page
// calls the loaders of `@/content/load`, passes the result here, and hands
// plain props to the components. Text is returned as the old site built it:
// apply `frenchSpacing()` at render.
//
// Only `articleSlugs` and `articleBySlug` read the content, through
// `loadArticles()` (node:fs): call them from server code only.

import { loadArticles } from "@/content/load";
import type {
  Article,
  Articles,
  Companies,
  Event,
  Fact,
  Meetup,
  Site,
  Socrates,
  Sponsoring,
  Sticker,
} from "@/content/types";
import {
  fmtDate,
  logoWallTiles,
  meetupPhotoUrl,
  photoItems,
  stats,
  type LogoTile,
  type PhotoItem,
} from "./derive";
import { assetUrl, pageRoute } from "./routes";
import type { TopicTone } from "./home-data";

/** Url of a meetup photo from its name, or null when the name is empty. */
export function meetupPhoto(name: string | undefined): string | null {
  return name ? meetupPhotoUrl(name) : null;
}

// ---------- Meetup ----------

export type MeetupStepItem = {
  id: string;
  time: string;
  kicker: string;
  title: string;
  text: string;
  tips: string[];
  photoSrc: string;
};

export function meetupSteps(m: Meetup): MeetupStepItem[] {
  return m.steps.items.map((s) => ({
    id: s.id,
    time: s.time,
    kicker: s.kicker,
    title: s.title,
    text: s.text,
    tips: s.tips ?? [],
    photoSrc: meetupPhotoUrl(s.photo),
  }));
}

export type TopicBoardNote = {
  topic: string;
  year: string;
  /** The host of the event, or its city. */
  from: string;
  tone: TopicTone;
};

const BOARD_TONES: TopicTone[] = ["default", "pink", "green", "blue", "orange"];

/**
 * The topic wall of the meetup page: every topic of every event once (equal in
 * lower case), newest event first; the first spelling and its event win. No limit.
 */
export function meetupTopicBoard(events: Event[]): TopicBoardNote[] {
  const seen = new Set<string>();
  const notes: Omit<TopicBoardNote, "tone">[] = [];
  for (const e of events) {
    for (const topic of e.topics ?? []) {
      const key = topic.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      notes.push({
        topic,
        year: e.date.slice(0, 4),
        from: e.host || e.city,
      });
    }
  }
  return notes.map((n, i) => ({
    ...n,
    tone: BOARD_TONES[i % BOARD_TONES.length] ?? "default",
  }));
}

// ---------- Association ----------

/** The four hero figures of the association page. */
export function associationFacts(site: Site, events: Event[]): Fact[] {
  const st = stats(site, events);
  return [
    { value: String(st.events), label: `événements depuis ${st.since}` },
    { value: String(st.hosts), label: "entreprises hôtes" },
    { value: String(st.socrates), label: "éditions de SoCraTes Maroc" },
    { value: st.followers, label: "abonnés LinkedIn" },
  ];
}

export type LogoWall = { tiles: LogoTile[]; sticker: Sticker };

/** Wall of the association page: every company, most active first, host sticker. */
export function hostsWall(companies: Companies, events: Event[]): LogoWall {
  return {
    tiles: logoWallTiles(companies.items, events),
    sticker: companies.sticker.host,
  };
}

/** Wall of the SoCraTes page: sponsors only, labelled with their years, sponsor sticker. */
export function sponsorsWall(companies: Companies, events: Event[]): LogoWall {
  return {
    tiles: logoWallTiles(companies.items, events, {
      filter: (_c, st) => st.sponsored > 0,
      label: (_c, st) => st.years.join(" · "),
    }),
    sticker: companies.sticker.sponsor,
  };
}

// ---------- SoCraTes ----------

export type EditionCard = {
  year: string;
  edition: string;
  /** "2022 · Marrakech". */
  title: string;
  /** "Palais Ronsard · 25 → 27 mars": venue and dates, empty parts left out. */
  where: string;
  participants: number;
  partners: number;
  /** Cover photo url, or null: the cover shows the year. */
  photoSrc: string | null;
  text: string;
};

export function socratesEditionCards(s: Socrates): EditionCard[] {
  return s.editions.items.map((e) => ({
    year: e.year,
    edition: e.edition,
    title: `${e.year} · ${e.city}`,
    where: [e.venue, e.dates].filter(Boolean).join(" · "),
    participants: e.participants,
    partners: e.partners,
    photoSrc: meetupPhoto(e.photo),
    text: e.text,
  }));
}

export type LawItem = { title: string; text: string; main: boolean };

/** The laws of open space; the last one is the main law. */
export function socratesLaws(s: Socrates): LawItem[] {
  const laws = s.openspace.laws;
  return laws.map((l, i) => ({ ...l, main: i === laws.length - 1 }));
}

export type FamilyItem = {
  id: string;
  name: string;
  country: string;
  logoSrc: string;
};

export function socratesFamily(s: Socrates): FamilyItem[] {
  return s.family.items.map((f) => ({
    ...f,
    logoSrc: assetUrl(`/assets/img/socrates/${f.id}.png`),
  }));
}

export type PackageCard = {
  id: string;
  name: string;
  /** "Sur devis" when the price is empty. */
  price: string;
  highlight: boolean;
  badge: string | null;
  limit: string | null;
  tagline: string;
  includes: string[];
};

export function sponsorPackages(sp: Sponsoring): PackageCard[] {
  return sp.packages.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price || "Sur devis",
    highlight: Boolean(p.highlight),
    badge: p.badge || null,
    limit: p.limit || null,
    tagline: p.tagline,
    includes: p.includes,
  }));
}

export type SponsorLevel = { value: string; label: string };

/**
 * Options of the "niveau" radio group of the sponsor form: one per package
 * ("Pack · price"), then "En nature" and "À discuter". "À discuter" is checked
 * at first.
 */
export function sponsorLevels(sp: Sponsoring): {
  options: SponsorLevel[];
  defaultValue: string;
} {
  const options: SponsorLevel[] = [
    ...sp.packages.map((p) => ({
      value: p.name,
      label: `${p.name} · ${p.price}`,
    })),
    { value: "En nature", label: "En nature" },
    { value: "À discuter", label: "À discuter" },
  ];
  return { options, defaultValue: "À discuter" };
}

/** Level value to check when the visitor clicks "Choisir ce niveau" on a package. */
export function levelForPackage(
  sp: Sponsoring,
  packageId: string,
): string | undefined {
  return sp.packages.find((p) => p.id === packageId)?.name;
}

// ---------- News ----------

/** Articles by date, newest first. The input is not changed. */
export function sortedArticles(articles: Articles): Article[] {
  return articles.items.slice().sort((x, y) => y.date.localeCompare(x.date));
}

/** Route of an article, trailing slash included. */
export function articleHref(slug: string): string {
  return `${pageRoute("news")}${encodeURIComponent(slug)}/`;
}

export type ArticleCard = {
  slug: string;
  href: string;
  kind: string;
  title: string;
  excerpt: string;
  /** "27 octobre 2026". */
  dateLabel: string;
  coverSrc: string | null;
  tags: string[];
  /** The newest article is shown larger. */
  lead: boolean;
};

export function articleCards(articles: Articles): ArticleCard[] {
  return sortedArticles(articles).map((a, i) => ({
    slug: a.slug,
    href: articleHref(a.slug),
    kind: a.kind,
    title: a.title,
    excerpt: a.excerpt,
    dateLabel: fmtDate(a.date, { long: true }),
    coverSrc: meetupPhoto(a.cover),
    tags: a.tags ?? [],
    lead: i === 0,
  }));
}

/** Every article slug, for `generateStaticParams`. Server only. */
export function articleSlugs(articles: Articles = loadArticles()): string[] {
  return articles.items.map((a) => a.slug);
}

/** The article of a slug, or undefined. Server only. */
export function articleBySlug(
  slug: string,
  articles: Articles = loadArticles(),
): Article | undefined {
  return articles.items.find((a) => a.slug === slug);
}

export type ArticleView = {
  slug: string;
  kind: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  coverSrc: string | null;
  tags: string[];
  /** Mini Markdown: render it with `md()`. */
  body: string;
  /** "Title · Site name", for the page title. */
  documentTitle: string;
  /** Links of the related event: LinkedIn post, Luma page. */
  eventLinks: { label: string; href: string }[];
  /** Photos of the related event, ready for the lightbox. */
  photos: PhotoItem[];
  /** "Les 4 photos", or null without photos. */
  photosLabel: string | null;
};

function articleEventLinks(event: Event): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  if (event.links?.linkedin) {
    links.push({ label: "Le post LinkedIn", href: event.links.linkedin });
  }
  if (event.links?.luma) {
    links.push({ label: "La page Luma", href: event.links.luma });
  }
  return links;
}

/** The detail page of an article, with the links and photos of its event. */
export function articleView(
  article: Article,
  events: Event[],
  site: Pick<Site, "name">,
): ArticleView {
  const event = article.event
    ? events.find((e) => e.id === article.event)
    : undefined;
  const photos = event ? photoItems(event) : [];
  return {
    slug: article.slug,
    kind: article.kind,
    title: article.title,
    excerpt: article.excerpt,
    dateLabel: fmtDate(article.date, { long: true }),
    coverSrc: meetupPhoto(article.cover),
    tags: article.tags ?? [],
    body: article.body,
    documentTitle: `${article.title} · ${site.name}`,
    eventLinks: event ? articleEventLinks(event) : [],
    photos,
    photosLabel: photos.length ? `Les ${photos.length} photos` : null,
  };
}
