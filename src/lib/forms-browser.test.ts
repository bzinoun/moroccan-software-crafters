import { afterEach, describe, expect, it } from "vitest";
import { inMemorySubmitDeps } from "@/test/in-memory-submit-deps";
import { browserDeps, submitFormInBrowser } from "./forms-browser";

const ENDPOINT = "https://formspree.io/f/xtestid";

afterEach(() => {
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

  it("sends through the fetch function it is given", async () => {
    const { deps: memory, requests } = inMemorySubmitDeps({ status: 201 });
    const response = await browserDeps(memory.fetch).fetch(ENDPOINT, {
      method: "POST",
    });
    expect(response.status).toBe(201);
    expect(requests).toEqual([{ url: ENDPOINT, init: { method: "POST" } }]);
  });
});

describe("browserDeps send port", () => {
  it("carries the send port it is given (the saveLead Server Action by default)", async () => {
    const payloads: unknown[] = [];
    const send = async (payload: Record<string, unknown>) =>
      void payloads.push(payload);
    await browserDeps(undefined, send).send?.({ entreprise: "Acme" });
    expect(payloads).toEqual([{ entreprise: "Acme" }]);
  });
});

describe("submitFormInBrowser", () => {
  it("posts through the given fetch with the utm of the current URL", async () => {
    window.history.replaceState(null, "", "/socrates/?utm_source=linkedin");
    const { deps: memory, requests } = inMemorySubmitDeps();
    const result = await submitFormInBrowser(
      {
        site: { form: { endpoint: ENDPOINT, extraFields: {} } },
        data: { email: "sara@acme.ma" },
        type: "Sponsoring SoCraTes",
        subject: "Sujet",
      },
      // The endpoint path: no Server Action port.
      { ...browserDeps(), fetch: memory.fetch, send: undefined },
    );
    expect(result).toEqual({ mode: "endpoint" });
    expect(requests).toHaveLength(1);
    const { url, init } = requests[0]!;
    expect(url).toBe(ENDPOINT);
    const body = JSON.parse(init?.body as string);
    expect(body.utm_source).toBe("linkedin");
    expect(body.source).toBe("http://localhost:3000/socrates/");
  });
});
