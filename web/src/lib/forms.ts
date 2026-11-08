// Shared submit code for the lead forms (host funnel and SoCraTes sponsor form),
// ported from `sendLead` and `tracking` in `assets/js/cms.js`.
//
// Everything here is free of browser globals: the browser values (fetch,
// navigation, clock, location, referrer) come in through `SubmitDeps`, so tests
// inject fakes. `forms-browser.ts` wires the real globals.
//
// Chain, as in the old site: `form.endpoint` set, POST JSON; else
// `contact.email` set, open a prefilled mailto; else the LinkedIn page; else
// nothing is configured.

/** The part of `content/site.json` the forms read. Every field is optional. */
export type FormSite = {
  links?: { linkedin?: string };
  contact?: { email?: string };
  form?: { endpoint?: string; extraFields?: Record<string, string> };
};

export type FormValue = string | number | boolean | string[] | null | undefined;
export type FormValues = Record<string, FormValue>;

/** Name of the hidden anti-robot field in the old forms. */
export const HONEYPOT_FIELD = "website_hp";

export const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

export type Tracking = Partial<
  Record<(typeof TRACKING_KEYS)[number] | "referrer", string>
>;

/** `utm_*` from a query string (with or without the leading ?) plus the referrer. */
export function readTracking(search: string, referrer: string): Tracking {
  const params = new URLSearchParams(search);
  const tracking: Tracking = {};
  for (const key of TRACKING_KEYS) {
    const value = params.get(key);
    if (value) tracking[key] = value;
  }
  if (referrer) tracking.referrer = referrer;
  return tracking;
}

/** `key : value` lines; arrays joined with ", "; empty and null values skipped. */
export function defaultMailBody(data: FormValues): string {
  return Object.entries(data)
    .filter(([, value]) => value !== "" && value != null)
    .map(
      ([key, value]) =>
        `${key} : ${Array.isArray(value) ? value.join(", ") : String(value)}`,
    )
    .join("\n");
}

export function buildMailtoUrl(
  email: string,
  subject: string,
  body: string,
): string {
  // encodeURIComponent throws on a lone surrogate (a cut emoji): replace it first.
  const encode = (text: string) => encodeURIComponent(text.toWellFormed());
  return `mailto:${email}?subject=${encode(subject)}&body=${encode(body)}`;
}

type PayloadInput = {
  site: FormSite;
  data: FormValues;
  type: string;
  subject: string;
  /** Full page URL; the query string is dropped for the `source` field. */
  href: string;
  now: Date;
  tracking: Tracking;
};

/** JSON body sent to the endpoint. Key order matches the old `Object.assign` chain. */
export function buildPayload(input: PayloadInput): Record<string, unknown> {
  const { site, data, type, subject, href, now, tracking } = input;
  return {
    ...(site.form?.extraFields ?? {}),
    ...data,
    type,
    _subject: subject,
    subject,
    _replyto: data.email,
    source: href.split("?")[0],
    envoye_le: now.toISOString(),
    ...tracking,
  };
}

/** Where a visitor can reach the team when sending failed or is not configured. */
export type ContactFallback =
  | { kind: "mailto"; email: string; url: string }
  | { kind: "linkedin"; href: string }
  | null;

function contactFallback(
  site: FormSite,
  subject: string,
  body: string,
): ContactFallback {
  const email = site.contact?.email;
  if (email)
    return { kind: "mailto", email, url: buildMailtoUrl(email, subject, body) };
  const linkedin = site.links?.linkedin;
  if (linkedin) return { kind: "linkedin", href: linkedin };
  return null;
}

export type SubmitInput = {
  site: FormSite;
  data: FormValues;
  /** The `type` field, for example "Sponsoring SoCraTes". */
  type: string;
  subject: string;
  /** Mailto body. Falls back to `defaultMailBody(data)` when empty. */
  body?: string;
  /** Value of the hidden honeypot field. A non-empty value sends nothing. */
  honeypot?: string;
  /**
   * Old behavior (default false): a failed endpoint returns `mode: "error"` and
   * the page shows an alert. True: chain on to the mailto, then LinkedIn.
   */
  fallbackOnError?: boolean;
};

export type SubmitDeps = {
  fetch: typeof fetch;
  /** Opens a URL by navigation (`window.location.href = url`). */
  assignLocation: (url: string) => void;
  now: () => Date;
  /** Current page URL. */
  href: string;
  /** Current query string, for the utm capture. */
  search: string;
  referrer: string;
};

export type SubmitResult =
  /** The endpoint answered 2xx. */
  | { mode: "endpoint" }
  /** The prefilled e-mail was opened. */
  | { mode: "mailto"; url: string }
  /** Nothing to send with; show a link to the LinkedIn page. */
  | { mode: "linkedin"; href: string }
  /** No endpoint, no e-mail and no LinkedIn link in the config. */
  | { mode: "none" }
  /** Robot caught: report success to the visitor, transmit nothing. */
  | { mode: "honeypot" }
  /** The endpoint failed (non-2xx or network error). Keep the answers, show an alert. */
  | { mode: "error"; error: Error; fallback: ContactFallback };

export async function submitForm(
  input: SubmitInput,
  deps: SubmitDeps,
): Promise<SubmitResult> {
  const {
    site,
    data,
    type,
    subject,
    honeypot,
    fallbackOnError = false,
  } = input;
  if (honeypot) return { mode: "honeypot" };

  const body = input.body || defaultMailBody(data);
  const endpoint = site.form?.endpoint ?? "";

  if (endpoint) {
    try {
      const payload = buildPayload({
        site,
        data,
        type,
        subject,
        href: deps.href,
        now: deps.now(),
        tracking: readTracking(deps.search, deps.referrer),
      });
      const response = await deps.fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { mode: "endpoint" };
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      const fallback = contactFallback(site, subject, body);
      if (!fallbackOnError) return { mode: "error", error, fallback };
      return openFallback(fallback, deps);
    }
  }

  return openFallback(contactFallback(site, subject, body), deps);
}

function openFallback(
  fallback: ContactFallback,
  deps: SubmitDeps,
): SubmitResult {
  if (fallback?.kind === "mailto") {
    deps.assignLocation(fallback.url);
    return { mode: "mailto", url: fallback.url };
  }
  if (fallback?.kind === "linkedin")
    return { mode: "linkedin", href: fallback.href };
  return { mode: "none" };
}
