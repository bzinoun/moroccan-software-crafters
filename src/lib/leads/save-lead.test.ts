import { describe, expect, it } from "vitest";
import { inMemoryLeadRepository } from "./lead-repository";
import { createSaveLead, leadRepositoryFromEnv } from "./save-lead";

const valid = {
  entreprise: "Globex",
  nom: "Omar",
  email: "omar@globex.ma",
  type: "Sponsoring SoCraTes",
};

describe("createSaveLead", () => {
  it("saves a valid lead once", async () => {
    const repository = inMemoryLeadRepository();
    await createSaveLead(() => repository)(valid);
    expect(repository.leads).toHaveLength(1);
    expect(repository.leads[0]?.entreprise).toBe("Globex");
  });

  it("refuses an invalid payload and saves nothing", async () => {
    const repository = inMemoryLeadRepository();
    await expect(
      createSaveLead(() => repository)({ ...valid, email: "x" }),
    ).rejects.toThrow("Invalid lead");
    expect(repository.leads).toHaveLength(0);
  });

  it("fails when no repository is configured", async () => {
    await expect(createSaveLead(() => null)(valid)).rejects.toThrow(
      "Lead storage is not configured",
    );
  });

  it("passes the repository failure on to the caller", async () => {
    const repository = inMemoryLeadRepository({ fail: true });
    await expect(createSaveLead(() => repository)(valid)).rejects.toThrow(
      "in-memory failure",
    );
  });
});

describe("leadRepositoryFromEnv", () => {
  it("gives no repository when the token or the data source id is missing", () => {
    expect(leadRepositoryFromEnv({})).toBeNull();
    expect(leadRepositoryFromEnv({ NOTION_TOKEN: "t" })).toBeNull();
    expect(
      leadRepositoryFromEnv({ NOTION_LEADS_DATA_SOURCE_ID: "d" }),
    ).toBeNull();
  });

  it("gives the Notion repository when both values are set", () => {
    expect(
      leadRepositoryFromEnv({
        NOTION_TOKEN: "t",
        NOTION_LEADS_DATA_SOURCE_ID: "d",
      }),
    ).not.toBeNull();
  });
});
