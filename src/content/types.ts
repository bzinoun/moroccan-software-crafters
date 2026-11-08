// Shape of the root content/*.json files that this step reads.
// The JSON files at the repo root stay the single source of truth.

export type NavLink = {
  label: string;
  /** Href in the legacy `.html` form kept in content/*.json, for example "meetup.html" or "index.html#historique"; `toRoute()` maps it. */
  href: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type Site = {
  name: string;
  shortName: string;
  tagline: string;
  mission: string;
  description: string;
  baseUrl: string;
  since: number;
  linkedinFollowers: number;
  links: { linkedin: string; socrates: string; github: string };
  contact: { email: string };
  form: { endpoint: string; extraFields: Record<string, string> };
  nav: NavLink[];
  cta: Cta;
  footer: { links: NavLink[]; legal: string };
};

/** Keys of the figures that `stats()` computes from the events and the site. */
export type StatKey =
  | "events"
  | "meetups"
  | "hosts"
  | "avgRegistrations"
  | "followers"
  | "socrates"
  | "since";

export type CollagePhoto = {
  /** Photo name without folder and extension, for example "2026-05-axa-1". */
  photo: string;
  caption: string;
};

export type StatDefinition = {
  /** The figure is computed from the events and the site when `value` is absent. */
  key?: StatKey;
  /** A fixed value that overrides the computed figure. */
  value?: string | number;
  label: string;
};

export type FormatStep = {
  time: string;
  title: string;
  text: string;
  photo?: string;
};

export type HistoryFilter = {
  /** "all" or an event type. */
  value: string;
  label: string;
};

export type Home = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    /** May contain one `<em>` around the emphasized word. */
    title: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    /** When not empty, replaces the "Dernière édition" sentence. */
    note: string;
    collage: CollagePhoto[];
    postit: string;
  };
  stats: StatDefinition[];
  format: {
    eyebrow: string;
    title: string;
    lead: string;
    steps: FormatStep[];
    more: Cta;
  };
  topics: { title: string; limit: number };
  history: {
    eyebrow: string;
    title: string;
    lead: string;
    filters: HistoryFilter[];
    limit: number;
    /** Contains the `{n}` placeholder for the number of events. */
    more: string;
  };
  gallery: { eyebrow: string; title: string; limit: number; more: string };
  socrates: {
    eyebrow: string;
    title: string;
    lead: string;
    photo: string;
    cta: Cta;
    sponsor: { eyebrow: string; title: string; text: string; cta: Cta };
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  cta: {
    title: string;
    text: string;
    primary: Cta;
    secondary: Cta;
  };
};

export const EVENT_TYPES = [
  "meetup",
  "socrates",
  "codesnack",
  "online",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export type EventLinks = {
  linkedin?: string;
  luma?: string;
  site?: string;
};

export type Event = {
  id: string;
  /** "YYYY-MM-DD", or "YYYY-MM" when the day is unknown. */
  date: string;
  type: EventType;
  title: string;
  /** Name of the host company; matches `Company.name` exactly. */
  host?: string;
  venue?: string;
  city: string;
  topics?: string[];
  summary?: string;
  registrations?: number;
  /** SoCraTes only. */
  participants?: number;
  /** Company names; each matches `Company.name` exactly. */
  sponsors?: string[];
  /** Photo names without folder and extension. */
  photos?: string[];
  poster?: string;
  links?: EventLinks;
};

export type Company = {
  id: string;
  /** Matched against `Event.host` and `Event.sponsors`. */
  name: string;
  display: string;
  /** File name in assets/img/logos; empty when the company has no logo. */
  logo: string;
  /** Empty when the company has no page. */
  linkedin: string;
};

export type Sticker = {
  title: string;
  text: string;
  label: string;
  href: string;
};

export type Companies = {
  eyebrow: string;
  title: string;
  lead: string;
  sticker: { host: Sticker; sponsor: Sticker };
  items: Company[];
};

export type Offer = {
  id: string;
  name: string;
  /** Absent or empty means "Sur devis". */
  price?: string;
  highlight?: boolean;
  badge?: string;
  tagline: string;
  youProvide: string[];
  weProvide: string[];
};

export type Offers = {
  eyebrow: string;
  title: string;
  lead: string;
  note: string;
  items: Offer[];
};

export type SponsorPackage = {
  id: string;
  name: string;
  price: string;
  highlight?: boolean;
  badge?: string;
  limit?: string;
  tagline: string;
  includes: string[];
};

export type Sponsoring = {
  nextEdition: {
    label: string;
    year: string;
    dates: string;
    venue: string;
    city: string;
    capacity: number;
    status: string;
  };
  eyebrow: string;
  title: string;
  lead: string;
  arguments: { title: string; text: string }[];
  /** `ids` are `Company.id` values. */
  trust: { title: string; ids: string[] };
  packages: SponsorPackage[];
  inKind: { title: string; text: string };
  note: string;
  faq: { q: string; a: string }[];
  form: { title: string; lead: string; success: string };
};

/** A titled text block; `href` and `label` make it a link ("En savoir plus" when no label). */
export type Card = {
  title: string;
  text: string;
  /** Href in the legacy `.html` form ("meetup.html#proposer") or an absolute URL. */
  href?: string;
  label?: string;
};

export type PageMeta = { title: string; description: string };

/** A figure with its caption, for the hero fact lists. */
export type Fact = { value: string; label: string };

export type MeetupStep = {
  /** Anchor id of the step row. */
  id: string;
  time: string;
  title: string;
  kicker: string;
  /** Photo name without folder and extension. */
  photo: string;
  text: string;
  tips?: string[];
};

export type Meetup = {
  meta: PageMeta;
  hero: {
    eyebrow: string;
    /** May contain one `<em>` around the emphasized word. */
    title: string;
    lead: string;
    photo: string;
    facts: Fact[];
  };
  who: { eyebrow: string; title: string; text: string; items: Card[] };
  steps: { eyebrow: string; title: string; items: MeetupStep[] };
  marketplace: {
    eyebrow: string;
    title: string;
    photo: string;
    steps: { title: string; text: string }[];
  };
  propose: { eyebrow: string; title: string; items: Card[] };
  rules: { eyebrow: string; title: string; items: Card[] };
  topicsWall: { eyebrow: string; title: string };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  cta: { title: string; text: string; primary: Cta; secondary: Cta };
};

export type Association = {
  meta: PageMeta;
  hero: {
    eyebrow: string;
    /** May contain one `<em>` around the emphasized word. */
    title: string;
    lead: string;
    photo: string;
  };
  mission: { eyebrow: string; title: string; items: Card[] };
  principles: { eyebrow: string; title: string; items: Card[] };
  timeline: {
    eyebrow: string;
    title: string;
    items: { year: string; title: string; text: string }[];
  };
  contribute: { eyebrow: string; title: string; items: Card[] };
  contact: { eyebrow?: string; title: string; text: string };
};

export type SocratesEdition = {
  year: string;
  /** "1re édition". */
  edition: string;
  city: string;
  /** Empty or absent when the venue is unknown. */
  venue?: string;
  dates: string;
  participants: number;
  partners: number;
  /** Photo name; empty or absent: the cover shows the year. */
  photo?: string;
  text: string;
};

export type Socrates = {
  meta: PageMeta;
  hero: {
    eyebrow: string;
    status: string;
    /** May contain one `<em>` around the emphasized words. */
    title: string;
    lead: string;
    /** Photo name; empty or absent: no background photo. */
    photo?: string;
    primary: Cta;
    secondary: Cta;
    facts: Fact[];
  };
  about: { eyebrow: string; title: string; lead: string; pillars: Card[] };
  openspace: {
    eyebrow: string;
    title: string;
    lead: string;
    /** The last law is the main one. */
    laws: { title: string; text: string }[];
    formats: { title: string; items: Card[] };
  };
  schedule: {
    eyebrow: string;
    title: string;
    days: { day: string; title: string; text: string }[];
    note: string;
  };
  editions: { eyebrow: string; title: string; items: SocratesEdition[] };
  family: {
    eyebrow: string;
    title: string;
    text: string;
    /** `id` is the file name of the logo in assets/img/socrates (.png). */
    items: { id: string; name: string; country: string }[];
  };
  values: { eyebrow: string; title: string; items: Card[] };
  sponsorsWall: { eyebrow: string; title: string };
};

export type Article = {
  /** Unique; the route is /actualites/<slug>/. */
  slug: string;
  /** "YYYY-MM-DD" or "YYYY-MM". */
  date: string;
  /** "Récap", "Annonce"... */
  kind: string;
  title: string;
  /** Photo name without folder and extension. */
  cover?: string;
  excerpt: string;
  tags?: string[];
  /** Mini Markdown, see `md`. */
  body: string;
  /** `Event.id` of the related event. */
  event?: string;
};

export type Articles = {
  meta: PageMeta;
  eyebrow: string;
  title: string;
  lead: string;
  items: Article[];
};

/** Page ids; `PageFrame` sets the current one as `data-page` on its wrapper. */
export type PageId =
  "home" | "meetup" | "socrates" | "news" | "association" | "host";
