import { describe, expect, it, vi } from "vitest";
import { loadSite } from "@/content/load";
import {
  buildMailtoUrl,
  buildPayload,
  defaultMailBody,
  HONEYPOT_FIELD,
  readTracking,
  submitForm,
  type FormSite,
  type SubmitDeps,
} from "./forms";

// The endpoint id in content/site.json is empty today. This literal is a
// public-config style Formspree id used only with a fake fetch.
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

const okResponse = () => ({ ok: true, status: 200 }) as Response;

function makeDeps(over: Partial<SubmitDeps> = {}) {
  const fetchMock = vi.fn(async () => okResponse());
  const assignLocation = vi.fn();
  const deps: SubmitDeps = {
    fetch: fetchMock as unknown as typeof fetch,
    assignLocation,
    now: () => new Date("2026-11-07T10:20:30.000Z"),
    href: "https://bzinoun.github.io/moroccan-software-crafters/socrates/?utm_source=x#sponsor-form",
    search:
      "?utm_source=linkedin&utm_medium=post&utm_campaign=socrates27&utm_content=banner&other=1",
    referrer: "https://www.linkedin.com/",
    ...over,
  };
  return { deps, fetchMock, assignLocation };
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
  it("merges extraFields, data, lead fields and tracking in the old order", () => {
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
    const { deps, fetchMock, assignLocation } = makeDeps();
    const result = await submitForm(
      input(site({ form: { endpoint: ENDPOINT, extraFields: {} } }), {
        honeypot: "http://spam",
      }),
      deps,
    );
    expect(result).toEqual({ mode: "honeypot" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(assignLocation).not.toHaveBeenCalled();
  });

  it("posts JSON with the old headers to the endpoint and returns endpoint on 2xx", async () => {
    const { deps, fetchMock, assignLocation } = makeDeps();
    const result = await submitForm(
      input(
        site({
          form: { endpoint: ENDPOINT, extraFields: { access_key: "k" } },
        }),
      ),
      deps,
    );
    expect(result).toEqual({ mode: "endpoint" });
    expect(assignLocation).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
    expect(JSON.parse(init.body as string)).toEqual({
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
    const { deps, assignLocation } = makeDeps({
      fetch: vi.fn(
        async () => ({ ok: false, status: 422 }) as Response,
      ) as unknown as typeof fetch,
    });
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
    expect(assignLocation).not.toHaveBeenCalled();
  });

  it("points the error fallback to LinkedIn when there is no e-mail", async () => {
    const { deps } = makeDeps({
      fetch: vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }) as unknown as typeof fetch,
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
    const { deps, assignLocation } = makeDeps({
      fetch: vi.fn(
        async () => ({ ok: false, status: 500 }) as Response,
      ) as unknown as typeof fetch,
    });
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
    expect(assignLocation).toHaveBeenCalledWith(url);
  });

  it("with fallbackOnError and no e-mail, a failed endpoint gives the LinkedIn mode", async () => {
    const { deps, assignLocation } = makeDeps({
      fetch: vi.fn(
        async () => ({ ok: false, status: 500 }) as Response,
      ) as unknown as typeof fetch,
    });
    const result = await submitForm(
      input(site({ form: { endpoint: ENDPOINT, extraFields: {} } }), {
        fallbackOnError: true,
      }),
      deps,
    );
    expect(result).toEqual({ mode: "linkedin", href: LINKEDIN });
    expect(assignLocation).not.toHaveBeenCalled();
  });

  it("without endpoint, opens the prefilled mailto to contact.email", async () => {
    const { deps, fetchMock, assignLocation } = makeDeps();
    const result = await submitForm(
      input(site({ contact: { email: EMAIL } })),
      deps,
    );
    const url = `mailto:${EMAIL}?subject=${SUBJECT_ENCODED}&body=${BODY_ENCODED}`;
    expect(result).toEqual({ mode: "mailto", url });
    expect(assignLocation).toHaveBeenCalledWith(url);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses the caller body for the mailto when given", async () => {
    const { deps, assignLocation } = makeDeps();
    await submitForm(
      input(site({ contact: { email: EMAIL } }), {
        body: "Formule : Meetup\nVille : Casablanca",
      }),
      deps,
    );
    expect(assignLocation).toHaveBeenCalledWith(
      `mailto:${EMAIL}?subject=${SUBJECT_ENCODED}&body=Formule%20%3A%20Meetup%0AVille%20%3A%20Casablanca`,
    );
  });

  it("without endpoint and e-mail, gives the LinkedIn mode and touches nothing", async () => {
    const { deps, fetchMock, assignLocation } = makeDeps();
    const result = await submitForm(input(site()), deps);
    expect(result).toEqual({ mode: "linkedin", href: LINKEDIN });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(assignLocation).not.toHaveBeenCalled();
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

  it("works with the real content/site.json (nothing configured yet)", async () => {
    const real = loadSite();
    const { deps, fetchMock } = makeDeps();
    const result = await submitForm(input(real), deps);
    expect(real.form.endpoint).toBe("");
    expect(real.contact.email).toBe("");
    expect(result).toEqual({ mode: "linkedin", href: LINKEDIN });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
