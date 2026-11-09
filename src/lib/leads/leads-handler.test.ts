import { describe, expect, it } from "vitest";
import { inMemoryLeadRepository, type LeadRepository } from "./lead-repository";
import { createLeadsHandler } from "./leads-handler";

const OFFERS = [{ id: "partenaire", name: "Meetup partenaire" }];
const URL_BASE = "https://site.test/api/leads";

const validJson = {
  type: "Sponsoring SoCraTes",
  entreprise: "Globex",
  nom: "Omar",
  email: "omar@globex.ma",
};

function handler(repository: LeadRepository | null) {
  return createLeadsHandler({
    repository: () => repository,
    offers: () => OFFERS,
  });
}

const postJson = (body: unknown) =>
  new Request(URL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const postForm = (entries: [string, string][]) =>
  new Request(URL_BASE, {
    method: "POST",
    body: new URLSearchParams(entries),
  });

const validForm: [string, string][] = [
  ["_type", "sponsor"],
  ["entreprise", "Globex"],
  ["nom", "Omar"],
  ["email", "omar@globex.ma"],
  ["consent", "on"],
  ["website_hp", ""],
];

describe("leads handler, JSON (the JavaScript path)", () => {
  it("saves a valid lead and answers 200", async () => {
    const repository = inMemoryLeadRepository();
    const response = await handler(repository)(postJson(validJson));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(repository.leads).toHaveLength(1);
  });

  it("answers 400 and saves nothing for an invalid lead", async () => {
    const repository = inMemoryLeadRepository();
    const response = await handler(repository)(
      postJson({ ...validJson, email: "x" }),
    );
    expect(response.status).toBe(400);
    expect(repository.leads).toHaveLength(0);
  });

  it("answers 503 when no storage is configured", async () => {
    const response = await handler(null)(postJson(validJson));
    expect(response.status).toBe(503);
  });

  it("answers 502 when the storage fails", async () => {
    const response = await handler(inMemoryLeadRepository({ fail: true }))(
      postJson(validJson),
    );
    expect(response.status).toBe(502);
  });

  it("answers 400 for a body that is not JSON", async () => {
    const response = await handler(inMemoryLeadRepository())(
      new Request(URL_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{oops",
      }),
    );
    expect(response.status).toBe(400);
  });
});

describe("leads handler, form post (the path without JavaScript)", () => {
  it("saves the lead and sends the visitor to the thank-you page", async () => {
    const repository = inMemoryLeadRepository();
    const response = await handler(repository)(postForm(validForm));
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("https://site.test/merci/");
    expect(repository.leads[0]?.entreprise).toBe("Globex");
  });

  it("treats a filled honeypot as a success and saves nothing", async () => {
    const repository = inMemoryLeadRepository();
    const response = await handler(repository)(
      postForm([...validForm.slice(0, -1), ["website_hp", "http://spam"]]),
    );
    expect(response.headers.get("Location")).toBe("https://site.test/merci/");
    expect(repository.leads).toHaveLength(0);
  });

  it("refuses a lead without consent and sends the visitor to the error page", async () => {
    const repository = inMemoryLeadRepository();
    const response = await handler(repository)(
      postForm(validForm.filter(([name]) => name !== "consent")),
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe(
      "https://site.test/envoi-impossible/",
    );
    expect(repository.leads).toHaveLength(0);
  });

  it("sends the visitor to the error page when the lead is invalid or not saved", async () => {
    const invalid = await handler(inMemoryLeadRepository())(
      postForm(
        validForm.map(([name, value]): [string, string] =>
          name === "email" ? [name, "x"] : [name, value],
        ),
      ),
    );
    expect(invalid.headers.get("Location")).toBe(
      "https://site.test/envoi-impossible/",
    );
    const failed = await handler(null)(postForm(validForm));
    expect(failed.headers.get("Location")).toBe(
      "https://site.test/envoi-impossible/",
    );
  });
});
