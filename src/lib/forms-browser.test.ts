import { afterEach, describe, expect, it, vi } from "vitest";
import { browserDeps, submitFormInBrowser } from "./forms-browser";

const ENDPOINT = "https://formspree.io/f/xtestid";

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
});

describe("browserDeps", () => {
  it("reads the page URL, the query string and the referrer from the globals", () => {
    window.history.replaceState(
      null,
      "",
      "/accueillir/?utm_source=linkedin#funnel",
    );
    const deps = browserDeps();
    expect(deps.href).toBe(
      "http://localhost:3000/accueillir/?utm_source=linkedin#funnel",
    );
    expect(deps.search).toBe("?utm_source=linkedin");
    expect(deps.referrer).toBe(document.referrer);
    expect(deps.now()).toBeInstanceOf(Date);
  });
});

describe("submitFormInBrowser", () => {
  it("posts through the global fetch with the utm of the current URL", async () => {
    window.history.replaceState(null, "", "/socrates/?utm_source=linkedin");
    const fetchMock = vi.fn(
      async () => ({ ok: true, status: 200 }) as Response,
    );
    vi.stubGlobal("fetch", fetchMock);
    const result = await submitFormInBrowser({
      site: { form: { endpoint: ENDPOINT, extraFields: {} } },
      data: { email: "sara@acme.ma" },
      type: "Sponsoring SoCraTes",
      subject: "Sujet",
    });
    expect(result).toEqual({ mode: "endpoint" });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe(ENDPOINT);
    const body = JSON.parse(init.body as string);
    expect(body.utm_source).toBe("linkedin");
    expect(body.source).toBe("http://localhost:3000/socrates/");
  });
});
