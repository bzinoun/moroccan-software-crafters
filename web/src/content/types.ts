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

export type Home = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    /** May contain one `<em>` around the emphasized word. */
    title: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    note: string;
  };
};

/** Page ids used by the root site in `<body data-page>`. */
export type PageId = "home" | "meetup" | "socrates" | "news" | "association" | "host";
