// Pure derivations ported from the former `assets/js/cms.js` (`git show 1353207:assets/js/cms.js`) of the former site, with the
// same semantics. Input is the typed content from `@/content/load`; output is
// plain data for the components. Nothing here reads files.

import type { Company, Event, EventType, Site } from "@/content/types";
import { assetUrl } from "./routes";

const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

const MONTHS_LONG = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export const TYPE_LABEL: Record<EventType, string> = {
  meetup: "Meetup",
  socrates: "SoCraTes",
  codesnack: "Code Snack",
  online: "En ligne",
};

type FmtDateOptions = {
  /** Full month name ("octobre") instead of the abbreviation ("oct."). */
  long?: boolean;
  /** Set to false to leave out the day. A date without a day never shows one. */
  day?: boolean;
};

/** "2026-10-24" gives "24 oct. 2026"; "2021-04" gives "avr. 2021". */
export function fmtDate(iso: string, opts: FmtDateOptions = {}): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = (opts.long ? MONTHS_LONG : MONTHS)[(m ?? 0) - 1];
  // Content is validated, so a bad month is a data bug: fail instead of printing "undefined".
  if (month === undefined) throw new Error(`fmtDate: no month in "${iso}"`);
  const day = opts.day !== false && d ? `${d} ` : "";
  return `${day}${month} ${y}`;
}

/**
 * Days of an event without the year: "25 → 27 mars", "30 mars → 2 avril", "25 mars".
 * A date without a day gives the month alone.
 */
export function fmtDayRange(start: string, end?: string): string {
  const parse = (iso: string) => {
    const [, m, d] = iso.split("-").map(Number);
    const month = MONTHS_LONG[(m ?? 0) - 1];
    if (month === undefined)
      throw new Error(`fmtDayRange: no month in "${iso}"`);
    return { day: d, month };
  };
  const from = parse(start);
  const first = from.day ? `${from.day} ${from.month}` : from.month;
  if (end === undefined || end === start) return first;
  const to = parse(end);
  const last = `${to.day} ${to.month}`;
  return to.month === from.month
    ? `${from.day} → ${last}`
    : `${first} → ${last}`;
}

/** URL of an event photo from its name, base path included. */
export function meetupPhotoUrl(name: string): string {
  return assetUrl(`/assets/img/meetups/${name}.jpg`);
}

/**
 * Absolute URL of a public image, for the share metadata. `baseUrl` is
 * `site.baseUrl`, which already carries the base path: do not use `assetUrl`.
 */
export function absoluteImageUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

/** Absolute URL of an event photo from its name. */
export function absoluteMeetupPhoto(baseUrl: string, name: string): string {
  return absoluteImageUrl(baseUrl, `/assets/img/meetups/${name}.jpg`);
}

/** URL of a company logo from its file name, base path included. */
export function logoUrl(file: string): string {
  return assetUrl(`/assets/img/logos/${file}`);
}

/**
 * Key that two spellings of one topic share: no accents, lower case, no outer
 * spaces. A blank topic gives "".
 */
export function topicKey(topic: string): string {
  return topic.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase();
}

/** "Venue, City", or the city alone. */
export function place(e: Pick<Event, "venue" | "city">): string {
  return [e.venue, e.city].filter(Boolean).join(", ");
}

export type PhotoItem = {
  /** Photo name without folder and extension. */
  photo: string;
  /** Ready for an img element: base path included. */
  src: string;
  /** "Title · 24 oct. 2026". */
  caption: string;
  /** Id of the event the photo belongs to. */
  eventId: string;
};

/** The photos of one event, in the shape the lightbox and the gallery need. */
export function photoItems(e: Event): PhotoItem[] {
  return (e.photos ?? []).map((photo) => ({
    photo,
    src: meetupPhotoUrl(photo),
    caption: `${e.title} · ${fmtDate(e.date)}`,
    eventId: e.id,
  }));
}

export type Stats = {
  events: number;
  meetups: number;
  hosts: number;
  /** "~105", or "" when no recent meetup has registrations. */
  avgRegistrations: string;
  /** French thousands separator, for example "3 666". */
  followers: string;
  socrates: number;
  since: number;
};

/** Figures computed from the events, so nobody maintains them by hand. */
export function stats(
  site: Pick<Site, "since" | "linkedinFollowers">,
  events: Event[],
): Stats {
  const meetups = events.filter((e) => e.type === "meetup");
  const withReg = meetups.filter((e) => e.registrations).slice(0, 5);
  const avg = withReg.length
    ? Math.round(
        withReg.reduce((sum, e) => sum + (e.registrations ?? 0), 0) /
          withReg.length,
      )
    : 0;
  return {
    events: events.length,
    meetups: meetups.length,
    hosts: new Set(meetups.map((e) => e.host).filter(Boolean)).size,
    avgRegistrations: avg ? `~${avg}` : "",
    followers: (site.linkedinFollowers || 0).toLocaleString("fr-FR"),
    socrates: events.filter((e) => e.type === "socrates").length,
    since: site.since,
  };
}

type CompanyStats = {
  /** Events whose `host` is the company name, any type. */
  hosted: number;
  /** Events whose `sponsors` include the company name. */
  sponsored: number;
  /** Sorted distinct years of both kinds. */
  years: string[];
  roles: ("host" | "sponsor")[];
};

/**
 * Per company id: hosted events, sponsored editions, years. Events link to
 * companies by exact `name` match with `host` and `sponsors[]`.
 */
export function companyStats(
  companies: Company[],
  events: Event[],
): Record<string, CompanyStats> {
  const out: Record<string, CompanyStats> = {};
  for (const c of companies) {
    const hosted = events.filter((e) => e.host === c.name);
    const sponsored = events.filter((e) => (e.sponsors ?? []).includes(c.name));
    const years = [
      ...new Set([...hosted, ...sponsored].map((e) => e.date.slice(0, 4))),
    ].sort();
    const roles: CompanyStats["roles"] = [];
    if (hosted.length) roles.push("host");
    if (sponsored.length) roles.push("sponsor");
    out[c.id] = {
      hosted: hosted.length,
      sponsored: sponsored.length,
      years,
      roles,
    };
  }
  return out;
}

/** "Hôte de 2 meetups · Partenaire de 4 éditions SoCraTes". */
export function roleLabel(
  s: Pick<CompanyStats, "hosted" | "sponsored">,
): string {
  const parts: string[] = [];
  if (s.hosted) {
    parts.push(
      s.hosted > 1 ? `Hôte de ${s.hosted} meetups` : "Hôte d'un meetup",
    );
  }
  if (s.sponsored) {
    parts.push(
      s.sponsored > 1
        ? `Partenaire de ${s.sponsored} éditions SoCraTes`
        : "Partenaire SoCraTes",
    );
  }
  return parts.join(" · ");
}

/** Capitals of the first two words, or the first two letters of a single word. */
export function monogram(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .trim()
    .split(/\s+/);
  const [first = "", second] = words;
  return (
    second !== undefined ? first.charAt(0) + second.charAt(0) : name.slice(0, 2)
  ).toUpperCase();
}

export type LogoTile = {
  id: string;
  /** The display name of the company, or its name. */
  name: string;
  label: string;
  /** LinkedIn page, or null: the tile is then not a link. */
  href: string | null;
  /** Logo URL, or null: the tile shows the monogram. */
  logoSrc: string | null;
  monogram: string;
  hosted: number;
  sponsored: number;
};

type LogoWallOptions = {
  filter?: (company: Company, stats: CompanyStats) => boolean;
  /** Default true: most hosted plus sponsored first, file order on a tie. */
  sort?: boolean;
  label?: (company: Company, stats: CompanyStats) => string;
};

/** Data of the logo wall (`renderLogoWall` of the former site), without the sticker. */
export function logoWallTiles(
  companies: Company[],
  events: Event[],
  opts: LogoWallOptions = {},
): LogoTile[] {
  const st = companyStats(companies, events);
  const statsOf = (c: Company): CompanyStats =>
    st[c.id] ?? { hosted: 0, sponsored: 0, years: [], roles: [] };
  let list = companies.filter(
    (c) => !opts.filter || opts.filter(c, statsOf(c)),
  );
  if (opts.sort !== false) {
    list = list
      .slice()
      .sort(
        (a, b) =>
          statsOf(b).hosted +
          statsOf(b).sponsored -
          (statsOf(a).hosted + statsOf(a).sponsored),
      );
  }
  return list.map((c) => {
    const s = statsOf(c);
    const name = c.display || c.name;
    return {
      id: c.id,
      name,
      label: opts.label ? opts.label(c, s) : roleLabel(s),
      href: c.linkedin || null,
      logoSrc: c.logo ? logoUrl(c.logo) : null,
      monogram: monogram(name),
      hosted: s.hosted,
      sponsored: s.sponsored,
    };
  });
}
