// Derivations that former `assets/js/home.js` (`git show 1353207:assets/js/home.js`) of the former site does inline, as pure
// functions. The page calls the loaders of `@/content/load`, passes the result
// here, and hands plain props to the section components.
// Text is returned as the old site built it: apply `frenchSpacing()` at render.

import type {
  Company,
  Event,
  Home,
  Offer,
  Site,
  Sponsoring,
} from "@/content/types";
import {
  fmtDate,
  logoUrl,
  meetupPhotoUrl,
  photoItems,
  place,
  stats,
  topicKey,
  type PhotoItem,
} from "./derive";
import { countLabel } from "./french";
import { pageRoute } from "./routes";
import { editionLabel, socratesEvents } from "./socrates";

/** Used when a content limit is missing or 0: topics on the home wall. */
export const DEFAULT_TOPICS_LIMIT = 10;
/** Used when a content limit is missing or 0: events of the home timeline. */
export const DEFAULT_HISTORY_LIMIT = 6;
/** Used when a content limit is missing or 0: photos of the home gallery. */
export const DEFAULT_GALLERY_LIMIT = 8;

/** Today as "YYYY-MM-DD", the build date of a static export. */
function isoToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Sentence under the hero buttons: the home note, or the latest meetup that
 * took place on or before `today` (the build date, "YYYY-MM-DD").
 */
export function heroNote(
  home: Home,
  events: Event[],
  today: string = isoToday(),
): string {
  if (home.hero.note) return home.hero.note;
  const latest = events.find((e) => e.type === "meetup" && e.date <= today);
  if (!latest) return "";
  const registrations = latest.registrations
    ? `, ${countLabel(latest.registrations, "inscrit")}`
    : "";
  const at = latest.host ? ` chez ${latest.host}` : "";
  return `Dernière édition : ${fmtDate(latest.date, { long: true })}${at}${registrations}.`;
}

type CollageItem = { src: string; caption: string };

/** Hero polaroids, in order: the first is `p1`, the second `p2`. */
export function heroCollage(home: Home): CollageItem[] {
  return home.hero.collage.map((c) => ({
    src: meetupPhotoUrl(c.photo),
    caption: c.caption,
  }));
}

export type StatItem = { value: string; label: string };

/**
 * Stats band: a fixed `value` wins, else the figure computed from `key`. A stat
 * with no value (an empty figure too) is left out.
 */
export function statItems(home: Home, site: Site, events: Event[]): StatItem[] {
  const computed = stats(site, events);
  return home.stats.flatMap((s) => {
    const value =
      s.value !== undefined ? s.value : s.key ? computed[s.key] : undefined;
    const text = value === undefined ? "" : String(value);
    return text === "" ? [] : [{ value: text, label: s.label }];
  });
}

export type FormatStepItem = {
  time: string;
  title: string;
  text: string;
  /** Photo URL, or null when the step has no photo. */
  photoSrc: string | null;
};

export function formatSteps(home: Home): FormatStepItem[] {
  return home.format.steps.map((s) => ({
    time: s.time,
    title: s.title,
    text: s.text,
    photoSrc: s.photo ? meetupPhotoUrl(s.photo) : null,
  }));
}

/** Sticky-note colors, cycled in this order. "default" is the yellow note. */
export type TopicTone = "default" | "pink" | "green" | "blue" | "orange";
const TOPIC_TONES: TopicTone[] = ["default", "pink", "green", "blue", "orange"];

export type TopicNote = { topic: string; year: string; tone: TopicTone };

/**
 * Unique topics, newest event first. Two topics are the same when they match
 * without case, accents and outer spaces; the first spelling and its year win.
 * A blank topic is dropped. A limit of 0 or none gives the default limit.
 */
export function topicsFromEvents(events: Event[], limit?: number): TopicNote[] {
  const seen = new Set<string>();
  const found: { topic: string; year: string }[] = [];
  for (const e of events) {
    for (const topic of e.topics ?? []) {
      const key = topicKey(topic);
      if (key === "" || seen.has(key)) continue;
      seen.add(key);
      found.push({ topic: topic.trim(), year: e.date.slice(0, 4) });
    }
  }
  return found.slice(0, limit || DEFAULT_TOPICS_LIMIT).map((t, i) => ({
    ...t,
    tone: TOPIC_TONES[i % TOPIC_TONES.length] ?? "default",
  }));
}

/** The first three meetups that have photos. */
export function featuredEvents(events: Event[]): Event[] {
  return events
    .filter((e) => e.type === "meetup" && e.photos && e.photos.length)
    .slice(0, 3);
}

/** "24 oct. 2026 · Casablanca · 110 inscrits" (registrations only when known). */
export function featuredMeta(e: Event): string {
  const registrations = e.registrations
    ? ` · ${countLabel(e.registrations, "inscrit")}`
    : "";
  return `${fmtDate(e.date)} · ${e.city}${registrations}`;
}

type EventLink = { label: string; href: string };

/** External links of an event: LinkedIn recap, Luma page, SoCraTes site. */
export function eventLinks(e: Event): EventLink[] {
  const l = e.links ?? {};
  const links: EventLink[] = [];
  if (l.linkedin) links.push({ label: "Récap LinkedIn", href: l.linkedin });
  if (l.luma) links.push({ label: "Page Luma", href: l.luma });
  if (l.site) links.push({ label: "Site SoCraTes", href: l.site });
  return links;
}

/** Second line of a timeline item: place, then registrations, participants, partners. */
export function timelineWhere(e: Event): string {
  const parts = [place(e)];
  if (e.registrations) parts.push(countLabel(e.registrations, "inscrit"));
  if (e.participants) parts.push(countLabel(e.participants, "participant"));
  if (e.sponsors?.length) {
    parts.push(countLabel(e.sponsors.length, "partenaire"));
  }
  return parts.filter(Boolean).join(" · ");
}

/** Filter chips: "all" keeps every event, any other value is an event type. */
export function filterEvents(events: Event[], filter: string): Event[] {
  return events.filter((e) => filter === "all" || e.type === filter);
}

export type YearGroup = { year: string; items: Event[] };

/**
 * Timeline groups: filter first, then keep the first `limit` events (all when
 * no limit), then group by year (one group per year) in order of first appearance.
 */
export function eventsByYear(
  events: Event[],
  filter: string,
  limit?: number,
): YearGroup[] {
  const all = filterEvents(events, filter);
  const list = limit === undefined ? all : all.slice(0, limit);
  const byYear = new Map<string, Event[]>();
  for (const e of list) {
    const year = e.date.slice(0, 4);
    const items = byYear.get(year);
    if (items) items.push(e);
    else byYear.set(year, [e]);
  }
  return [...byYear].map(([year, items]) => ({ year, items }));
}

/** "Voir les {n} événements" with the number filled in. */
export function timelineMoreLabel(template: string, total: number): string {
  return template.replace("{n}", String(total));
}

/** Every photo of every event; the lightbox walks all of them. */
export function galleryItems(events: Event[]): PhotoItem[] {
  return events.flatMap(photoItems);
}

export type SocratesEdition = {
  id: string;
  /** "2022 · Marrakech". */
  title: string;
  /** "1re édition · 30 crafters". */
  detail: string;
};

/** SoCraTes editions, oldest first by date, numbered from the first. */
export function socratesEditions(events: Event[]): SocratesEdition[] {
  return socratesEvents(events).map((e, i) => ({
    id: e.id,
    title: `${e.date.slice(0, 4)} · ${e.city}`,
    detail: `${editionLabel(i + 1)}${e.participants ? ` · ${countLabel(e.participants, "crafter")}` : ""}`,
  }));
}

export function socratesPhoto(home: Home): string {
  return meetupPhotoUrl(home.socrates.photo);
}

export type TrustLogo = {
  id: string;
  name: string;
  logoSrc: string | null;
  /** First two letters in capitals, shown when there is no logo. */
  monogram: string;
};

/** Logos of the companies listed in `sponsoring.trust.ids`, in that order. */
export function trustLogos(
  sponsoring: Sponsoring,
  companies: Company[],
): TrustLogo[] {
  const byId = new Map(companies.map((c) => [c.id, c]));
  return sponsoring.trust.ids.flatMap((id) => {
    const c = byId.get(id);
    if (!c) return [];
    const name = c.display || c.name;
    return [
      {
        id: c.id,
        name,
        logoSrc: c.logo ? logoUrl(c.logo) : null,
        monogram: name.slice(0, 2).toUpperCase(),
      },
    ];
  });
}

export function offerPrice(o: Pick<Offer, "price">): string {
  return o.price || "Sur devis";
}

/** Route of the host funnel with the chosen offer, trailing slash included. */
export function offerHref(o: Pick<Offer, "id">): string {
  return `${pageRoute("host")}?formule=${encodeURIComponent(o.id)}`;
}
