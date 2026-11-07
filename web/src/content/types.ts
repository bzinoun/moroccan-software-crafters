// Shape of the root content/*.json files that this step reads.
// The JSON files at the repo root stay the single source of truth.

export type NavLink = {
  label: string;
  /** Root-site href, for example "meetup.html" or "index.html#historique". */
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

/** Page ids used by the root site in `<body data-page>`. */
export type PageId =
  "home" | "meetup" | "socrates" | "news" | "association" | "host";
