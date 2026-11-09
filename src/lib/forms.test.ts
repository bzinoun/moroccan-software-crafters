import { describe, expect, it } from "vitest";
import { loadSite } from "@/content/load";
import { inMemorySubmitDeps } from "@/test/in-memory-submit-deps";
import {
  buildMailtoUrl,
  buildPayload,
  defaultMailBody,
  formSite,
  HONEYPOT_FIELD,
  readTracking,
  submitForm,
  type FormSite,
} from "./forms";

// A public-config style Formspree id, used only with a fake fetch.
const ENDPOINT = "https://formspree.io/f/xtestid";
const EMAIL = "hello@moroccansoftwarecrafters.ma";
const LINKEDIN = "https://www.linkedin.com/company/moroccansoftwarecrafters/";

const data = {
  entreprise: "Acme",
  nom: "Sara",
  email: "sara@acme.ma",
  niveau: "Or",
  message: "",
  equipements: ["wifi", "projecteur"],
};
const subject = "Partenariat SoCraTes · Acme · Or";
const SUBJECT_ENCODED = "Partenariat%20SoCraTes%20%C2%B7%20Acme%20%C2%B7%20Or";
const BODY_ENCODED =
  "entreprise%20%3A%20Acme%0Anom%20%3A%20Sara%0Aemail%20%3A%20sara%40acme.ma%0Aniveau%20%3A%20Or%0Aequipements%20%3A%20wifi%2C%20projecteur";

const site = (over: Partial<FormSite> = {}): FormSite => ({
  links: { linkedin: LINKEDIN },
  contact: { email: "" },
  form: { endpoint: "", extraFields: {} },
  ...over,
});

type DepsOptions = Parameters<typeof inMemorySubmitDeps>[0];

function makeDeps(over: DepsOptions = {}) {
  return inMemorySubmitDeps({
    href: "https://bzinoun.github.io/moroccan-software-crafters/socrates/?utm_source=x#sponsor-form",
    search:
      "?utm_source=linkedin&utm_medium=post&utm_campaign=socrates27&utm_content=banner&other=1",
    referrer: "https://www.linkedin.com/",
    ...over,
  });
}

describe("readTracking", () => {
  it("keeps the four utm keys and the referrer", () => {
    expect(
      readTracking(
        "?utm_source=linkedin&utm_medium=post&utm_campaign=socrates27&utm_content=banner&other=1",
        "https://www.linkedin.com/",
      ),
    ).toEqual({
      utm_source: "linkedin",
      utm_medium: "post",
      utm_campaign: "socrates27",
      utm_content: "banner",
      referrer: "https://www.linkedin.com/",
    });
  });

  it("omits empty utm values and an empty referrer", () => {
    expect(readTracking("?utm_source=&utm_term=x", "")).toEqual({});
  });
});

describe("defaultMailBody", () => {
  it("lists key : value lines, joins arrays, skips empty and null values", () => {
    expect(defaultMailBody({ ...data, telephone: null })).toBe(
      "entreprise : Acme\nnom : Sara\nemail : sara@acme.ma\nniveau : Or\nequipements : wifi, projecteur",
    );
  });
});

describe("buildMailtoUrl", () => {
  it("encodes the subject and the body", () => {
    expect(buildMailtoUrl(EMAIL, subject, defaultMailBody(data))).toBe(
      `mailto:${EMAIL}?subject=${SUBJECT_ENCODED}&body=${BODY_ENCODED}`,
    );
  });

  it("percent-encodes accents as UTF-8", () => {
    expect(buildMailtoUrl(EMAIL, "Réunion à Rabat", "Équipe tech")).toBe(
      `mailto:${EMAIL}?subject=R%C3%A9union%20%C3%A0%20Rabat&body=%C3%89quipe%20tech`,
    );
  });

  it("percent-encodes an emoji as four UTF-8 bytes", () => {
    expect(buildMailtoUrl(EMAIL, "Merci 🙏", "Bravo 🎉")).toBe(
      `mailto:${EMAIL}?subject=Merci%20%F0%9F%99%8F&body=Bravo%20%F0%9F%8E%89`,
    );
  });

  it("encodes a plus sign in an e-mail address of the body", () => {
    expect(buildMailtoUrl(EMAIL, "s", "E-mail : sara+crafters@acme.ma")).toBe(
      `mailto:${EMAIL}?subject=s&body=E-mail%20%3A%20sara%2Bcrafters%40acme.ma`,
    );
  });

  it("encodes line breaks, LF and CRLF", () => {
    expect(buildMailtoUrl(EMAIL, "s", "a\nb\r\nc")).toBe(
      `mailto:${EMAIL}?subject=s&body=a%0Ab%0D%0Ac`,
    );
  });

  it("keeps a 3000-character message whole, with no length cap", () => {
    const message = "é".repeat(3000);
    const url = buildMailtoUrl(EMAIL, "s", message);
    expect(url).toBe(`mailto:${EMAIL}?subject=s&body=${"%C3%A9".repeat(3000)}`);
    expect(decodeURIComponent(url.split("&body=")[1]!)).toBe(message);
  });

  it("does not throw on a lone surrogate: it becomes U+FFFD", () => {
    expect(buildMailtoUrl(EMAIL, "a\ud83d", "b\ude00c")).toBe(
      `mailto:${EMAIL}?subject=a%EF%BF%BD&body=b%EF%BF%BDc`,
    );
  });
});

describe("buildPayload", () => {
  it("merges extraFields, data, lead fields and tracking in a fixed order", () => {
    const payload = buildPayload({
      site: site({
        form: { endpoint: ENDPOINT, extraFields: { access_key: "k" } },
      }),
      data,
      type: "Sponsoring SoCraTes",
      subject,
      href: "https://bzinoun.github.io/moroccan-software-crafters/socrates/?utm_source=x#sponsor-form",
      now: new Date("2026-11-07T10:20:30.000Z"),
      tracking: {
        utm_source: "linkedin",
        referrer: "https://www.linkedin.com/",
      },
    });
    expect(payload).toEqual({
      access_key: "k",
      ...data,
      type: "Sponsoring SoCraTes",
      _subject: subject,
      subject,
      _replyto: "sara@acme.ma",
      source: "https://bzinoun.github.io/moroccan-software-crafters/socrates/",
      envoye_le: "2026-11-07T10:20:30.000Z",
      utm_source: "linkedin",
      referrer: "https://www.linkedin.com/",
    });
    expect(Object.keys(payload).slice(0, 2)).toEqual([
      "access_key",
      "entreprise",
    ]);
  });
});

describe("submitForm", () => {
  const input = (s: FormSite, extra: Record<string, unknown> = {}) => ({
    site: s,
    data,
    type: "Sponsoring SoCraTes",
    subject,
    ...extra,
  });

  it("exports the honeypot field name", () => {
    expect(HONEYPOT_FIELD).toBe("website_hp");
  });

  it("short-circuits on a filled honeypot without any network or navigation", async () => {
    const { deps, requests, navigations } = makeDeps();
    const result = await submitForm(
      input(site({ form: { endpoint: ENDPOINT, extraFields: {} } }), {
        honeypot: "http://spam",
      }),
      deps,
    );
    expect(result).toEqual({ mode: "honeypot" });
    expect(requests).toEqual([]);
    expect(navigations).toEqual([]);
  });

  it("posts JSON with its headers to the endpoint and returns endpoint on 2xx", async () => {
    const { deps, requests, navigations } = makeDeps();
    const result = await submitForm(
      input(
        site({
          form: { endpoint: ENDPOINT, extraFields: { access_key: "k" } },
        }),
      ),
      deps,
    );
    expect(result).toEqual({ mode: "endpoint" });
    expect(navigations).toEqual([]);
    expect(requests).toHaveLength(1);
    const { url, init } = requests[0]!;
    expect(url).toBe(ENDPOINT);
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
    expect(JSON.parse(init?.body as string)).toEqual({
      access_key: "k",
      ...data,
      type: "Sponsoring SoCraTes",
      _subject: subject,
      subject,
      _replyto: "sara@acme.ma",
      source: "https://bzinoun.github.io/moroccan-software-crafters/socrates/",
      envoye_le: "2026-11-07T10:20:30.000Z",
      utm_source: "linkedin",
      utm_medium: "post",
      utm_campaign: "socrates27",
      utm_content: "banner",
      referrer: "https://www.linkedin.com/",
    });
  });

  it("returns an error result with the e-mail fallback on a non-2xx status", async () => {
    const { deps, navigations } = makeDeps({ status: 422 });
    const result = await submitForm(
      input(
        site({
          contact: { email: EMAIL },
          form: { endpoint: ENDPOINT, extraFields: {} },
        }),
      ),
      deps,
    );
    expect(result.mode).toBe("error");
    if (result.mode !== "error") return;
    expect(result.error.message).toBe("HTTP 422");
    expect(result.fallback).toEqual({
      kind: "mailto",
      email: EMAIL,
      url: `mailto:${EMAIL}?subject=${SUBJECT_ENCODED}&body=${BODY_ENCODED}`,
    });
    expect(navigations).toEqual([]);
  });

  it("points the error fallback to LinkedIn when there is no e-mail", async () => {
    const { deps } = makeDeps({
      networkError: new TypeError("Failed to fetch"),
    });
    const result = await submitForm(
      input(site({ form: { endpoint: ENDPOINT, extraFields: {} } })),
      deps,
    );
    expect(result.mode).toBe("error");
    if (result.mode !== "error") return;
    expect(result.error.message).toBe("Failed to fetch");
    expect(result.fallback).toEqual({ kind: "linkedin", href: LINKEDIN });
  });

  it("with fallbackOnError, a failed endpoint opens the prefilled mailto", async () => {
    const { deps, navigations } = makeDeps({ status: 500 });
    const result = await submitForm(
      input(
        site({
          contact: { email: EMAIL },
          form: { endpoint: ENDPOINT, extraFields: {} },
        }),
        {
          fallbackOnError: true,
        },
      ),
      deps,
    );
    const url = `mailto:${EMAIL}?subject=${SUBJECT_ENCODED}&body=${BODY_ENCODED}`;
    expect(result).toEqual({ mode: "mailto", url });
    expect(navigations).toEqual([url]);
  });

  it("with fallbackOnError and no e-mail, a failed endpoint gives the LinkedIn mode", async () => {
    const { deps, navigations } = makeDeps({ status: 500 });
    const result = await submitForm(
      input(site({ form: { endpoint: ENDPOINT, extraFields: {} } }), {
        fallbackOnError: true,
      }),
      deps,
    );
    expect(result).toEqual({ mode: "linkedin", href: LINKEDIN });
    expect(navigations).toEqual([]);
  });

  it("without endpoint, opens the prefilled mailto to contact.email", async () => {
    const { deps, requests, navigations } = makeDeps();
    const result = await submitForm(
      input(site({ contact: { email: EMAIL } })),
      deps,
    );
    const url = `mailto:${EMAIL}?subject=${SUBJECT_ENCODED}&body=${BODY_ENCODED}`;
    expect(result).toEqual({ mode: "mailto", url });
    expect(navigations).toEqual([url]);
    expect(requests).toEqual([]);
  });

  it("uses the caller body for the mailto when given", async () => {
    const { deps, navigations } = makeDeps();
    await submitForm(
      input(site({ contact: { email: EMAIL } }), {
        body: "Formule : Meetup\nVille : Casablanca",
      }),
      deps,
    );
    expect(navigations).toEqual([
      `mailto:${EMAIL}?subject=${SUBJECT_ENCODED}&body=Formule%20%3A%20Meetup%0AVille%20%3A%20Casablanca`,
    ]);
  });

  it("without endpoint and e-mail, gives the LinkedIn mode and touches nothing", async () => {
    const { deps, requests, navigations } = makeDeps();
    const result = await submitForm(input(site()), deps);
    expect(result).toEqual({ mode: "linkedin", href: LINKEDIN });
    expect(requests).toEqual([]);
    expect(navigations).toEqual([]);
  });

  it("with no endpoint, no e-mail and no LinkedIn link, gives none", async () => {
    const { deps } = makeDeps();
    const result = await submitForm(
      input({
        links: { linkedin: "" },
        contact: { email: "" },
        form: { endpoint: "", extraFields: {} },
      }),
      deps,
    );
    expect(result).toEqual({ mode: "none" });
    expect(await submitForm(input({}), deps)).toEqual({ mode: "none" });
  });

  it("accepts the shape of the real content/site.json, whatever is configured in it", async () => {
    const real = loadSite();
    const { deps } = makeDeps();
    const result = await submitForm(input(real), deps);
    expect(["endpoint", "mailto", "linkedin", "none"]).toContain(result.mode);
  });
});

describe("formSite", () => {
  it("keeps the LinkedIn page, the contact and the form, and nothing else of the site", () => {
    const full = {
      name: "Moroccan Software Crafters",
      links: { linkedin: LINKEDIN, other: "https://example.org/" },
      contact: { email: EMAIL },
      form: { endpoint: ENDPOINT, extraFields: { _captcha: "false" } },
    };
    expect(formSite(full)).toEqual({
      links: { linkedin: LINKEDIN },
      contact: { email: EMAIL },
      form: { endpoint: ENDPOINT, extraFields: { _captcha: "false" } },
    });
  });
});

describe("submitForm with a send port (the saveLead Server Action)", () => {
  const input = (s: FormSite) => ({
    site: s,
    data,
    type: "Sponsoring SoCraTes",
    subject,
  });

  it("sends the payload through the port, not to the endpoint, and returns endpoint", async () => {
    const payloads: unknown[] = [];
    const { deps, requests, navigations } = makeDeps();
    const result = await submitForm(
      input(site({ form: { endpoint: ENDPOINT, extraFields: {} } })),
      { ...deps, send: async (payload) => void payloads.push(payload) },
    );
    expect(result).toEqual({ mode: "endpoint" });
    expect(requests).toEqual([]);
    expect(navigations).toEqual([]);
    expect(payloads).toHaveLength(1);
    expect(payloads[0]).toMatchObject({
      entreprise: "Acme",
      type: "Sponsoring SoCraTes",
      source: "https://bzinoun.github.io/moroccan-software-crafters/socrates/",
      utm_source: "linkedin",
    });
  });

  it("sends through the port even when no endpoint is configured", async () => {
    const payloads: unknown[] = [];
    const { deps } = makeDeps();
    const result = await submitForm(input(site()), {
      ...deps,
      send: async (payload) => void payloads.push(payload),
    });
    expect(result).toEqual({ mode: "endpoint" });
    expect(payloads).toHaveLength(1);
  });

  it("returns the error with the LinkedIn fallback when the port fails", async () => {
    const { deps, navigations } = makeDeps();
    const result = await submitForm(input(site()), {
      ...deps,
      send: async () => {
        throw new Error("Lead storage is not configured");
      },
    });
    expect(result.mode).toBe("error");
    if (result.mode !== "error") return;
    expect(result.error.message).toBe("Lead storage is not configured");
    expect(result.fallback).toEqual({ kind: "linkedin", href: LINKEDIN });
    expect(navigations).toEqual([]);
  });
});
