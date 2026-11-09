import { describe, expect, it } from "vitest";
import { toLead, type Lead } from "./lead";
import { notionLeadRepository } from "./notion-lead-repository";

type Call = { url: string; init: RequestInit };

/** In-memory HTTP port: records the requests and answers from a list. */
function recordingFetch(statuses: number[]) {
  const calls: Call[] = [];
  const fetchFn = async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    const status = statuses[calls.length - 1] ?? 200;
    return new Response(JSON.stringify({ object: "page" }), { status });
  };
  return { calls, fetchFn: fetchFn as typeof fetch };
}

const noWait = async () => {};

function lead(): Lead {
  const result = toLead({
    entreprise: "Globex",
    nom: "Omar",
    email: "omar@globex.ma",
    type: "Sponsoring SoCraTes",
    niveau: "Partenaire",
  });
  if (!result.ok) throw new Error("fixture must be valid");
  return result.lead;
}

const config = { token: "test-token", dataSourceId: "ds-123" };

describe("notionLeadRepository", () => {
  it("creates one page in the Leads data source with the Notion headers", async () => {
    const http = recordingFetch([200]);
    await notionLeadRepository(config, http.fetchFn, noWait).save(lead());
    expect(http.calls).toHaveLength(1);
    const [call] = http.calls;
    expect(call?.url).toBe("https://api.notion.com/v1/pages");
    expect(call?.init.method).toBe("POST");
    const headers = new Headers(call?.init.headers);
    expect(headers.get("Authorization")).toBe("Bearer test-token");
    expect(headers.get("Notion-Version")).toBe("2025-09-03");
    expect(headers.get("Content-Type")).toBe("application/json");
    const body = JSON.parse(String(call?.init.body));
    expect(body.parent).toEqual({
      type: "data_source_id",
      data_source_id: "ds-123",
    });
    expect(body.properties["Entreprise"]).toEqual({
      title: [{ text: { content: "Globex" } }],
    });
  });

  it("retries once when Notion answers 429, then succeeds", async () => {
    const http = recordingFetch([429, 200]);
    await notionLeadRepository(config, http.fetchFn, noWait).save(lead());
    expect(http.calls).toHaveLength(2);
  });

  it("fails with the HTTP status when Notion refuses the page", async () => {
    const http = recordingFetch([400]);
    await expect(
      notionLeadRepository(config, http.fetchFn, noWait).save(lead()),
    ).rejects.toThrow("Notion answered 400");
  });

  it("fails after a second 429", async () => {
    const http = recordingFetch([429, 429]);
    await expect(
      notionLeadRepository(config, http.fetchFn, noWait).save(lead()),
    ).rejects.toThrow("Notion answered 429");
    expect(http.calls).toHaveLength(2);
  });
});
